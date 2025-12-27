export class StockfishEngine {
    constructor({
        threads = 8,
        hash = 1024,
        multipv = 2,
        depth = 12,
        path = '/stockfish/stockfish-17.1-single-a496a04.js',
        timeout = 5000, // timeout por defecto 5s
    } = {}) {
        this.path = path
        this.worker = null

        this.defaultThreads = threads
        this.defaultHash = hash
        this.defaultMultiPV = multipv
        this.defaultDepth = depth
        this.timeout = timeout

        this._currentAnalysis = null
    }

    init() {
        return new Promise((resolve) => {
            this.worker = new Worker(this.path)
            const onReady = (e) => {
                if (e.data?.toString?.() === 'readyok') {
                    this.worker.removeEventListener('message', onReady)
                    resolve(true)
                }
            }
            this.worker.addEventListener('message', onReady)
            this.worker.postMessage('uci')
            this.worker.postMessage('isready')

            this.setThreads(this.defaultThreads)
            this.setHash(this.defaultHash)
            this.setMultiPV(this.defaultMultiPV)
        })
    }

    // Dentro de la clase
    async _waitReady(timeout = this.timeout) {
        if (!this.worker) throw new Error('Worker no inicializado')

        return new Promise(async (resolve, reject) => {
            let done = false

            const timer = setTimeout(async () => {
                if (!done) {
                    console.warn('Worker no respondió, reiniciando...')
                    this.stop()
                    await this.init()
                    done = true
                    resolve() // continuamos después de reiniciar
                }
            }, timeout)

            const onReady = (e) => {
                if (e.data?.toString?.() === 'readyok') {
                    clearTimeout(timer)
                    this.worker.removeEventListener('message', onReady)
                    done = true
                    resolve()
                }
            }

            this.worker.addEventListener('message', onReady)
            this.worker.postMessage('ucinewgame')
            this.worker.postMessage('isready')
        })
    }

    setThreads(n) {
        this.worker?.postMessage(`setoption name Threads value ${n}`)
    }

    setHash(mb) {
        this.worker?.postMessage(`setoption name Hash value ${mb}`)
    }

    setMultiPV(n) {
        this.worker?.postMessage(`setoption name MultiPV value ${n}`)
    }

    stop() {
        this.worker?.terminate()
    }

    normalizeScore({ cp = null, mate = null }, sideToMove) {
        if (cp !== null) return { type: 'cp', value: sideToMove === 'w' ? cp : -cp }
        if (mate !== null) return { type: 'mate', value: sideToMove === 'w' ? mate : -mate }
        return null
    }

    async analyze(fen, depth = null, pvMoves = 4) {
        // Espera a que termine cualquier análisis en curso
        if (this._currentAnalysis) {
            await this._currentAnalysis.catch(() => {}) // ignoramos errores previos
        }

        this._currentAnalysis = new Promise(async (resolve, reject) => {
            if (!this.worker) return reject(new Error('Worker not initialized'))

            const targetDepth = depth || this.defaultDepth
            const sideToMove = fen.split(' ')[1]
            const bestLines = {}

            await this._waitReady()

            const onMessage = (e) => {
                const msg = e.data?.toString?.() || ''

                if (msg.startsWith('info depth')) {
                    const parts = msg.split(' ')
                    const depthVal = parseInt(parts[parts.indexOf('depth') + 1])
                    const multipv = parts.includes('multipv') ? parseInt(parts[parts.indexOf('multipv') + 1]) : 1

                    const cpIndex = parts.indexOf('cp')
                    const mateIndex = parts.indexOf('mate')

                    const cp = cpIndex !== -1 ? parseInt(parts[cpIndex + 1]) : null
                    const mate = mateIndex !== -1 ? parseInt(parts[mateIndex + 1]) : null

                    const pvIndex = parts.indexOf('pv')
                    const pv = pvIndex !== -1 ? parts.slice(pvIndex + 1, pvIndex + 1 + pvMoves) : []

                    const prev = bestLines[multipv]
                    if (!prev || depthVal >= prev.depth) {
                        bestLines[multipv] = { multipv, depth: depthVal, score: { cp, mate }, pv }
                    }
                } else if (msg.startsWith('bestmove')) {
                    this.worker.removeEventListener('message', onMessage)

                    const variants = Object.values(bestLines)
                        .sort((a, b) => a.multipv - b.multipv)
                        .map((v) => ({
                            multipv: v.multipv,
                            score: this.normalizeScore(v.score, sideToMove),
                            pv: v.pv,
                        }))

                    resolve(variants)
                }
            }

            this.worker.addEventListener('message', onMessage)
            this.worker.postMessage(`position fen ${fen}`)
            this.worker.postMessage(`go depth ${targetDepth}`)
        })

        try {
            const result = await this._currentAnalysis
            return result
        } finally {
            this._currentAnalysis = null
        }
    }
}
