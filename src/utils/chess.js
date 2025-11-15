import { move, status, moves, Game } from 'js-chess-engine'

// FEN inicial del tablero
export const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

/**
 * Hace un movimiento y devuelve la nueva configuración.
 * @param {string} fen - FEN actual del tablero
 * @param {string} from - Casilla de origen (por ej. "E2")
 * @param {string} to - Casilla de destino (por ej. "E4")
 * @returns {string} Nuevo FEN
 */
export function makeMove(fen, from, to) {
    return move(fen, from, to)
}

/**
 * Devuelve todas las jugadas legales desde el tablero actual.
 * @param {string} fen
 * @returns {object} { E2: ["E3","E4"], G1: ["F3","H3"], ... }
 */
export function getLegalMoves(fen) {
    return moves(fen)
}

/**
 * Devuelve el estado actual del tablero: turnos, jaque, piezas, etc.
 * @param {string} fen
 * @returns {object}
 */
export function getStatus(fen) {
    return status(fen)
}

/**
 * Convierte el FEN actual en un objeto JSON de piezas.
 * @param {string} fen
 * @returns {object} piezas por coordenada
 */
export function getBoardFromFEN(fen) {
    function importFEN(fen) {
        const game = new Game(fen)
        return game.exportJson()
    }
    const { pieces } = importFEN(fen)
    return pieces
}
