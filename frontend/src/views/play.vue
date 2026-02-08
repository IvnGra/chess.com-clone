<template>
  <div class="play">
    <div class="board">
      <div
        v-for="square in squares"
        :key="square.key"
        class="square"
        :class="square.color"
        @click="onSquareClick(square.square)"
        console.log(selected)
      >
        <img v-if="square.piece" class="piece" :src="square.piece" alt="" />
      </div>
    </div>
    <div class="status">
      {{ status }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Chess } from 'chess.js'
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


const game = ref(new Chess())
const selected = ref(null)

const pieceToChar = {
  wp: WP, bp: BP,
  wn: WN, bn: BN,
  wb: WB, bb: BB,
  wr: WR, br: BR,
  wq: WQ, bq: BQ,
  wk: WK, bk: BK
}

const squares = computed(() => {
  const board = game.value.board()
  const files = ['a','b','c','d','e','f','g','h']
  return board.flatMap((rank, r) =>
    rank.map((piece, f) => {
      const square = `${files[f]}${8 - r}`
      const color = (r + f) % 2 === 0 ? 'light' : 'dark'
      const key = `${square}-${piece ? piece.color + piece.type : 'empty'}`
      return {
        key,
        square,
        color,
        piece: piece ? pieceToChar[`${piece.color}${piece.type}`] : ''
      }
    })
  )
})

const status = computed(() => {
  if (game.value.isCheckmate()) return 'Checkmate'
  if (game.value.isDraw()) return 'Draw'
  if (game.value.isCheck()) return 'Check'
  return `${game.value.turn() === 'w' ? "White" : "Black"} turn`
})

function onSquareClick(square) {
  if (!selected.value) {
    const piece = game.value.get(square)
    if (piece) selected.value = square
    return
  }

  const move = game.value.move({ from: selected.value, to: square })
  selected.value = null
  if (!move) {
    const piece = game.value.get(square)
    if (piece) selected.value = square
  }
}
defineOptions({
  name: 'PlayView',
})
</script>

<style scoped>
.board {
  display: grid;
  grid-template-columns: repeat(8, 64px);
  grid-template-rows: repeat(8, 64px);
  gap: 0;
  border: 2px solid #222;
  width: 512px;
}
.square {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38px;
  user-select: none;
}
.piece {
  width: 44px;
  height: 44px;
  object-fit: contain;
  pointer-events: none;
}
.light { background: #e8d4b5; }
.dark { background: #378630; }
.status { margin-top: 12px; font-size: 16px; }
</style>