<template>
  <div class="flex  h-screen">
      
      <div class="flex flex-1">
      <aside class="w-48 bg-stone-900  flex flex-col items-center justify-start space-y-10 py-6">
        
        <a href="/" class="w-28 py-2 bg-green-600 text-stone-50 font-medium rounded-xl shadow-md hover:shadow-lg hover:bg-green-700 transition text-center no-underline">logo</a>
        <router-link
          v-for="button in buttons"
          :key="button.name"
          :to="button.path"
          class="w-28 py-2 bg-green-600 text-stone-50 font-medium rounded-xl shadow-md hover:shadow-lg hover:bg-green-700 transition text-center no-underline"
          active-class="bg-green-700 ">
          {{ button.name }}
        </router-link>
      </aside>

      <!-- Main content -->
      <main class="flex-1 bg-neutral-800 flex items-center justify-center">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
const buttons = [
  { name: 'play', path: '/play' },
  { name: 'puzzles', path: '/puzzles' },
  { name: 'learn', path: '/learn' },
]
defineOptions({
  name: 'NavigationBar',
})
</script>