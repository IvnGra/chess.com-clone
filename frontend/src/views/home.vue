<template>
  <div class="home-page">
    <div class="mx-auto max-w-7xl px-4 py-8">
      <div class="flex flex-col-reverse md:flex-row items-center md:items-start gap-20">
        <!-- Left: GIF -->
        <div class="md:w-1/2 flex justify-center">
          <img
            src="https://assets-configurator.chess.com/image/configurator/chessboard_1768166350728.gif"
            alt="Chess animation"
            class="w-100 h-auto rounded-lg "
          />
        </div>

        <!-- Right: Text -->
        <div class="md:w-1/2 text-center md:text-left">
          <h1 class="text-5xl w-max font-bold text-stone-50 mb-6">Welcome to Chess.ee</h1>
          <p class="text-stone-50 text-xl mb-4">Your top 2 chess platform</p>
          <button class="bg-lime-600 mt-5 h-12 px-4 w-90 rounded text-stone-50 shadow-md hover:shadow-lg hover:bg-lime-700 transition" @click="goToPlay">Get Started</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';


defineOptions({
  name: 'HomePage',
})

const router = useRouter();

function goToPlay() {
  router.push('/play');
}
</script>