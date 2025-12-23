export class StockfishEngine {
    constructor({
        threads = 8,
        hash = 1024,
        multipv = 2,
        depth = 20,
        path = '/stockfish/stockfish-17.1-single-a496a04.js',
    } = {}) {
        this.path = path
        this.worker = null

        this.defaultThreads = threads
        this.defaultHash = hash
        this.defaultMultiPV = multipv
        this.defaultDepth = depth
    }

    // ------------------------------------------
    // INIT
    // ------------------------------------------
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

    // ------------------------------------------
    // OPTIONS
    // ------------------------------------------
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

    // ------------------------------------------
    // NORMALIZATION
    // ------------------------------------------
    normalizeScore({ cp = null, mate = null }, sideToMove) {
        if (cp !== null) {
            return {
                type: 'cp',
                value: sideToMove === 'w' ? cp : -cp,
            }
        }

        if (mate !== null) {
            return {
                type: 'mate',
                value: sideToMove === 'w' ? mate : -mate,
            }
        }

        return null
    }

    // ------------------------------------------
    // ANALYZE
    // ------------------------------------------
    analyze(fen, depth = null, pvMoves = 4) {
        return new Promise(async (resolve) => {
            if (!this.worker) return resolve([])

            const targetDepth = depth || this.defaultDepth
            const sideToMove = fen.split(' ')[1]

            const bestLines = {}

            // Reset limpio
            await new Promise((res) => {
                const onReady = (e) => {
                    if (e.data?.toString?.() === 'readyok') {
                        this.worker.removeEventListener('message', onReady)
                        res(true)
                    }
                }
                this.worker.addEventListener('message', onReady)
                this.worker.postMessage('ucinewgame')
                this.worker.postMessage('isready')
            })

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
                        bestLines[multipv] = {
                            multipv,
                            depth: depthVal, // interno, no se expone
                            score: { cp, mate },
                            pv,
                        }
                    }
                }

                if (msg.startsWith('bestmove')) {
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
    }
}
