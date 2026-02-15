<template>
  <div class="px-4 py-6">
    <div class="mx-auto grid w-full max-w-[640px] grid-cols-8 overflow-hidden border-2 border-neutral-900 flex flex-col items-center justify-start">
      <div
        v-for="square in squares"
        :key="square.key"
        class="flex aspect-square items-center justify-center select-none relative"
        :class="square.color"
        @click="onSquareClick(square.square)"
      >
        <img 
          v-if="square.piece" 
          class="h-3/4 w-3/4 object-contain pointer-events-none transition-all" 
          :class="{
             'brightness-150 scale-110': selected === square.square ,
              

             }"
          :src="square.piece" 
          alt="" 
        />
        <div
          v-if="isValidMove(square.square)"
          class="absolute w-4 h-4 bg-white rounded-full opacity-80 pointer-events-none"
        ></div>
      </div>
    </div>
    <div class="mx-auto mt-3 flex w-full max-w-[640px] items-center justify-between text-sm text-stone-50">
      {{ status }}
      <button
        class="rounded border text-stone-50 px-3 py-1 text-xs uppercase tracking-wide"
        type="button"
        @click="resetGame"
      >
        Reset
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import WP from '../assets/wp.png'
import BP from '../assets/bp.png'
import WN from '../assets/wn.png'
import BN from '../assets/bn.png'
import WB from '../assets/wb.png'
import BB from '../assets/bb.png'
import WR from '../assets/wr.png'
import BR from '../assets/br.png'
import WQ from '../assets/wq.png'
import BQ from '../assets/bq.png'
import WK from '../assets/wk.png'
import BK from '../assets/bk.png'

const selected = ref(null)
const turn = ref('w')
const enPassant = ref(null)
const castling = ref({
  w: { k: true, q: true },
  b: { k: true, q: true }
})
const board = ref(createInitialBoard())

const pieceToChar = {
  wp: WP, bp: BP,
  wn: WN, bn: BN,
  wb: WB, bb: BB,
  wr: WR, br: BR,
  wq: WQ, bq: BQ,
  wk: WK, bk: BK
}

const squares = computed(() => {
  const files = ['a','b','c','d','e','f','g','h']
  return board.value.flatMap((rank, r) =>
    rank.map((piece, f) => {
      const square = `${files[f]}${8 - r}`
      const color = (r + f) % 2 === 0 ? 'bg-amber-100' : 'bg-green-700'
      const key = `${square}-${piece || 'empty'}`
      return {
        key,
        square,
        color,
        piece: piece ? pieceToChar[piece] : ''
      }
    })
  )
})

const validMoves = computed(() => {
  if (!selected.value) return []
  return getLegalMovesForSquare(selected.value, board.value).map(move => move.square)
})

const status = computed(() => {
  const inCheck = isKingInCheck(turn.value, board.value)
  const moves = getAllLegalMoves(turn.value, board.value)
  if (moves.length === 0 && inCheck) return 'Checkmate'
  if (moves.length === 0 && !inCheck) return 'Draw'
  if (inCheck) return 'Check'
  return `${turn.value === 'w' ? 'White' : 'Black'} turn`
})

function isValidMove(square) {
  return validMoves.value.includes(square)
}

function onSquareClick(square) {
  const from = selected.value
  const target = getSquarePiece(square)

  if (!from) {
    if (target && target[0] === turn.value) selected.value = square
    return
  }

  if (from === square) {
    selected.value = null
    return
  }

  const legal = getLegalMovesForSquare(from, board.value)
  const isLegal = legal.some((move) => move.square === square)

  if (!isLegal) {
    if (target && target[0] === turn.value) selected.value = square
    else selected.value = null
    return
  }

  applyMove(from, square)
  selected.value = null
} // move piece if valid, otherwise select new piece if clicked on one

function resetGame() {
  board.value = createInitialBoard()
  turn.value = 'w'
  selected.value = null
  enPassant.value = null
  castling.value = { w: { k: true, q: true }, b: { k: true, q: true } }
}

function createInitialBoard() {
  return [
    ['br','bn','bb','bq','bk','bb','bn','br'],
    ['bp','bp','bp','bp','bp','bp','bp','bp'],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    ['wp','wp','wp','wp','wp','wp','wp','wp'],
    ['wr','wn','wb','wq','wk','wb','wn','wr']
  ]
}

function getSquareCoords(square) {
  const files = ['a','b','c','d','e','f','g','h']
  const file = square[0]
  const rank = Number(square[1])
  return { row: 8 - rank, col: files.indexOf(file) }
}

function getSquareName(row, col) {
  const files = ['a','b','c','d','e','f','g','h']
  return `${files[col]}${8 - row}`
}

function getSquarePiece(square) {
  const { row, col } = getSquareCoords(square)
  return board.value[row][col]
}

function cloneBoard(srcBoard) {
  return srcBoard.map((row) => row.slice())
}

function isInside(row, col) {
  return row >= 0 && row < 8 && col >= 0 && col < 8
}

function isKingInCheck(color, checkBoard) {
  const kingSquare = findKing(color, checkBoard)
  if (!kingSquare) return false
  return isSquareAttacked(kingSquare.row, kingSquare.col, color === 'w' ? 'b' : 'w', checkBoard)
}

function findKing(color, checkBoard) {
  for (let r = 0; r < 8; r += 1) {
    for (let c = 0; c < 8; c += 1) {
      if (checkBoard[r][c] === `${color}k`) return { row: r, col: c }
    }
  }
  return null
}

function isSquareAttacked(row, col, byColor, checkBoard) {
  const pawnDir = byColor === 'w' ? -1 : 1
  const pawnRows = row + pawnDir
  for (const dc of [-1, 1]) {
    const r = pawnRows
    const c = col + dc
    if (isInside(r, c) && checkBoard[r][c] === `${byColor}p`) return true
  }

  const knightMoves = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
  ]
  for (const [dr, dc] of knightMoves) {
    const r = row + dr
    const c = col + dc
    if (isInside(r, c) && checkBoard[r][c] === `${byColor}n`) return true
  }

  const kingMoves = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
  ]
  for (const [dr, dc] of kingMoves) {
    const r = row + dr
    const c = col + dc
    if (isInside(r, c) && checkBoard[r][c] === `${byColor}k`) return true
  }

  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
    [-1, -1], [-1, 1], [1, -1], [1, 1]
  ]
  for (const [dr, dc] of directions) {
    let r = row + dr
    let c = col + dc
    while (isInside(r, c)) {
      const piece = checkBoard[r][c]
      if (piece) {
        const color = piece[0]
        const type = piece[1]
        if (color === byColor) {
          const isStraight = dr === 0 || dc === 0
          const isDiag = dr !== 0 && dc !== 0
          if ((isStraight && (type === 'r' || type === 'q')) ||
              (isDiag && (type === 'b' || type === 'q')))
            return true
        }
        break
      }
      r += dr
      c += dc
    }
  }

  return false
}

function getAllLegalMoves(color, checkBoard) {
  const moves = []
  for (let r = 0; r < 8; r += 1) {
    for (let c = 0; c < 8; c += 1) {
      const piece = checkBoard[r][c]
      if (!piece || piece[0] !== color) continue
      const square = getSquareName(r, c)
      moves.push(...getLegalMovesForSquare(square, checkBoard))
    }
  }
  return moves
}

function getLegalMovesForSquare(square, checkBoard) {
  const { row, col } = getSquareCoords(square)
  const piece = checkBoard[row][col]
  if (!piece) return []
  const color = piece[0]
  const pseudo = getPseudoMovesForSquare(row, col, piece, checkBoard)
  const legal = []

  for (const move of pseudo) {
    const nextBoard = cloneBoard(checkBoard)
    applyMoveOnBoard({ fromRow: row, fromCol: col, toRow: move.row, toCol: move.col, piece }, nextBoard, move)
    if (!isKingInCheck(color, nextBoard)) {
      legal.push({ square: getSquareName(move.row, move.col), flags: move.flags })
    }
  }
  return legal
}

function getPseudoMovesForSquare(row, col, piece, checkBoard) {
  const color = piece[0]
  const type = piece[1]
  const moves = []

  if (type === 'p') {
    const dir = color === 'w' ? -1 : 1
    const startRow = color === 'w' ? 6 : 1
    const oneRow = row + dir
    if (isInside(oneRow, col) && !checkBoard[oneRow][col]) {
      moves.push({ row: oneRow, col, flags: [] })
      const twoRow = row + dir * 2
      if (row === startRow && !checkBoard[twoRow][col]) {
        moves.push({ row: twoRow, col, flags: ['double'] })
      }
    }
    for (const dc of [-1, 1]) {
      const r = row + dir
      const c = col + dc
      if (!isInside(r, c)) continue
      const target = checkBoard[r][c]
      if (target && target[0] !== color) moves.push({ row: r, col: c, flags: ['capture'] })
      if (!target && enPassant.value && enPassant.value.row === r && enPassant.value.col === c) {
        moves.push({ row: r, col: c, flags: ['enpassant'] })
      }
    }
  }

  if (type === 'n') {
    const knightMoves = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ]
    for (const [dr, dc] of knightMoves) {
      const r = row + dr
      const c = col + dc
      if (!isInside(r, c)) continue
      const target = checkBoard[r][c]
      if (!target || target[0] !== color) moves.push({ row: r, col: c, flags: target ? ['capture'] : [] })
    }
  }

  if (type === 'b' || type === 'r' || type === 'q') {
    const directions = []
    if (type === 'b' || type === 'q') directions.push([-1,-1], [-1,1], [1,-1], [1,1])
    if (type === 'r' || type === 'q') directions.push([-1,0], [1,0], [0,-1], [0,1])
    for (const [dr, dc] of directions) {
      let r = row + dr
      let c = col + dc
      while (isInside(r, c)) {
        const target = checkBoard[r][c]
        if (!target) {
          moves.push({ row: r, col: c, flags: [] })
        } else {
          if (target[0] !== color) moves.push({ row: r, col: c, flags: ['capture'] })
          break
        }
        r += dr
        c += dc
      }
    }
  }

  if (type === 'k') {
    const kingMoves = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1]
    ]
    for (const [dr, dc] of kingMoves) {
      const r = row + dr
      const c = col + dc
      if (!isInside(r, c)) continue
      const target = checkBoard[r][c]
      if (!target || target[0] !== color) moves.push({ row: r, col: c, flags: target ? ['capture'] : [] })
    }

    if (canCastle(color, 'k', checkBoard)) {
      moves.push({ row, col: col + 2, flags: ['castle-k'] })
    }
    if (canCastle(color, 'q', checkBoard)) {
      moves.push({ row, col: col - 2, flags: ['castle-q'] })
    }
  }

  return moves
}

function canCastle(color, side, checkBoard) {
  const row = color === 'w' ? 7 : 0
  const kingCol = 4
  if (!castling.value[color][side]) return false
  if (isKingInCheck(color, checkBoard)) return false
  if (side === 'k') {
    if (checkBoard[row][5] || checkBoard[row][6]) return false
    if (isSquareAttacked(row, 5, color === 'w' ? 'b' : 'w', checkBoard)) return false
    if (isSquareAttacked(row, 6, color === 'w' ? 'b' : 'w', checkBoard)) return false
    if (checkBoard[row][kingCol] !== `${color}k` || checkBoard[row][7] !== `${color}r`) return false
    return true
  }
  if (checkBoard[row][1] || checkBoard[row][2] || checkBoard[row][3]) return false
  if (isSquareAttacked(row, 3, color === 'w' ? 'b' : 'w', checkBoard)) return false
  if (isSquareAttacked(row, 2, color === 'w' ? 'b' : 'w', checkBoard)) return false
  if (checkBoard[row][kingCol] !== `${color}k` || checkBoard[row][0] !== `${color}r`) return false
  return true
}

function applyMove(fromSquare, toSquare) {
  const { row: fromRow, col: fromCol } = getSquareCoords(fromSquare)
  const { row: toRow, col: toCol } = getSquareCoords(toSquare)
  const movingPiece = board.value[fromRow][fromCol]
  
  console.log(`Move: ${movingPiece} from ${fromSquare} to ${toSquare}`)
  
  const nextBoard = cloneBoard(board.value)
  const moveFlags = getPseudoMovesForSquare(fromRow, fromCol, movingPiece, board.value)
    .find((move) => move.row === toRow && move.col === toCol)?.flags || []

  applyMoveOnBoard({ fromRow, fromCol, toRow, toCol, piece: movingPiece }, nextBoard, { flags: moveFlags })
  updateStateAfterMove({ fromRow, fromCol, toRow, toCol, piece: movingPiece }, moveFlags, board.value)

  board.value = nextBoard
  turn.value = turn.value === 'w' ? 'b' : 'w'
}

function applyMoveOnBoard(move, nextBoard, moveData) {
  const { fromRow, fromCol, toRow, toCol, piece } = move
  const type = piece[1]

  nextBoard[fromRow][fromCol] = null

  if (type === 'p' && moveData.flags.includes('enpassant')) {
    const captureRow = piece[0] === 'w' ? toRow + 1 : toRow - 1
    nextBoard[captureRow][toCol] = null
  }

  if (type === 'k' && Math.abs(toCol - fromCol) === 2) {
    if (toCol > fromCol) {
      nextBoard[toRow][5] = nextBoard[toRow][7]
      nextBoard[toRow][7] = null
    } else {
      nextBoard[toRow][3] = nextBoard[toRow][0]
      nextBoard[toRow][0] = null
    }
  }

  if (type === 'p' && (toRow === 0 || toRow === 7)) {
    nextBoard[toRow][toCol] = `${piece[0]}q`
    return
  }

  nextBoard[toRow][toCol] = piece
}

function updateStateAfterMove(move, moveFlags, currentBoard) {
  const { fromRow, fromCol, toRow, toCol, piece } = move
  const color = piece[0]
  const opponent = color === 'w' ? 'b' : 'w'

  if (piece[1] === 'p' && Math.abs(toRow - fromRow) === 2) {
    enPassant.value = { row: (fromRow + toRow) / 2, col: fromCol }
  } else {
    enPassant.value = null
  }

  if (piece[1] === 'k') {
    castling.value[color].k = false
    castling.value[color].q = false
  }

  if (piece[1] === 'r') {
    if (color === 'w' && fromRow === 7 && fromCol === 0) castling.value.w.q = false
    if (color === 'w' && fromRow === 7 && fromCol === 7) castling.value.w.k = false
    if (color === 'b' && fromRow === 0 && fromCol === 0) castling.value.b.q = false
    if (color === 'b' && fromRow === 0 && fromCol === 7) castling.value.b.k = false
  }

  const captured = moveFlags.includes('enpassant') ? null : currentBoard[toRow][toCol]
  if (captured === `${opponent}r`) {
    if (opponent === 'w' && toRow === 7 && toCol === 0) castling.value.w.q = false
    if (opponent === 'w' && toRow === 7 && toCol === 7) castling.value.w.k = false
    if (opponent === 'b' && toRow === 0 && toCol === 0) castling.value.b.q = false
    if (opponent === 'b' && toRow === 0 && toCol === 7) castling.value.b.k = false
  }
}
defineOptions({
  name: 'PlayView',
})
</script>
