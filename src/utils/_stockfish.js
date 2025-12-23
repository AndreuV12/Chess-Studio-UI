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
        this.ready = false

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

            const onInitMessage = (event) => {
                const msg = event.data?.toString?.() || ''
                if (msg === 'readyok') {
                    this.ready = true
                    this.worker.removeEventListener('message', onInitMessage)
                    resolve(true)
                }
            }

            this.worker.addEventListener('message', onInitMessage)

            this.worker.onerror = (e) => console.error('Stockfish worker error:', e)

            // UCI handshake
            this.worker.postMessage('uci')
            this.worker.postMessage('isready')

            console.log('Worker params:', this.defaultHash, this.defaultMultiPV)

            // Default config
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

    newGame() {
        this.worker?.postMessage('ucinewgame')
    }

    stop() {
        this.worker?.terminate()
    }

    // ------------------------------------------
    // ANALYZE
    // ------------------------------------------
    analyze(fen, depth = null) {
        return new Promise(async (resolve) => {
            if (!this.worker) return resolve(null)

            const targetDepth = depth || this.defaultDepth
            const result = {
                bestMove: null,
                evaluation: null,
                depth: 0,
                pvs: [],
            }

            const bestLines = {}

            // Primero asegurarnos de empezar un nuevo juego
            await new Promise((res) => {
                const onReady = (event) => {
                    const msg = event.data?.toString?.() || ''
                    if (msg.startsWith('readyok')) {
                        this.worker.removeEventListener('message', onReady)
                        res(true)
                    }
                }
                this.worker.addEventListener('message', onReady)
                this.worker.postMessage('ucinewgame')
                this.worker.postMessage('isready')
            })

            const handleMessage = (event) => {
                const msg = event.data?.toString?.() || ''

                if (msg.startsWith('info depth')) {
                    const parts = msg.split(' ')
                    const depthVal = parseInt(parts[parts.indexOf('depth') + 1])
                    const mpv = parts.includes('multipv') ? parseInt(parts[parts.indexOf('multipv') + 1]) : 1
                    const cpIndex = parts.indexOf('cp')
                    const score = cpIndex !== -1 ? parseInt(parts[cpIndex + 1]) : null
                    const pvIndex = parts.indexOf('pv')
                    const pv = pvIndex !== -1 ? parts.slice(pvIndex + 1) : []

                    bestLines[mpv] = { multipv: mpv, depth: depthVal, score, pv }
                    return
                }

                if (msg.startsWith('bestmove')) {
                    const parts = msg.split(' ')
                    result.bestMove = parts[1]
                    result.pvs = Object.values(bestLines).sort((a, b) => a.multipv - b.multipv)
                    result.evaluation = result.pvs[0]?.score || null
                    result.depth = result.pvs[0]?.depth || 0

                    this.worker.removeEventListener('message', handleMessage)
                    resolve(result)
                }
            }

            this.worker.addEventListener('message', handleMessage)

            this.worker.postMessage(`position fen ${fen}`)
            this.worker.postMessage(`go depth ${targetDepth}`)
        })
    }
}
