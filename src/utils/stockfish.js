import * as Stockfish from 'stockfish'

export function useStockfishWorker() {
    const ready = ref(false)
    const analysis = ref(null)

    const worker = Stockfish() // todavía llamando a la función

    worker.onmessage = (event) => {
        const msg = event.data?.toString?.() || ''
        console.log(msg)

        if (msg === 'readyok') ready.value = true

        if (msg.startsWith('bestmove')) {
            analysis.value = msg
        }
    }

    const init = () => {
        worker.postMessage('uci')
        worker.postMessage('isready')
        worker.postMessage('setoption name Threads value 1')
        worker.postMessage('setoption name Hash value 128')
        worker.postMessage('setoption name MultiPV value 3')
    }

    const analyze = (fen, depth = 15) => {
        worker.postMessage(`position fen ${fen}`)
        worker.postMessage(`go depth ${depth}`)
    }

    return { ready, analysis, init, analyze }
}
