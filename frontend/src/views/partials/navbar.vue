<template>
  <div class="flex  h-screen">
      
      <div class="flex flex-1">
      <aside class="w-48 bg-stone-900  flex flex-col items-center justify-start space-y-10 py-6">
        
        <a  href='/' >
          <img src="../../assets/logo.png" alt="Chess.ee Logo" class="h-12 w-auto mt-2">
        </a>
        <router-link
          v-for="button in buttons"
          :key="button.name"
          :to="button.path"
          class="w-28 py-2 bg-green-600 text-stone-50 font-medium rounded-xl shadow-md hover:shadow-lg hover:bg-green-700 transition text-center no-underline"
          active-class="bg-green-700 ">
          {{ button.name }}
        </router-link>

        <button
          v-if="isLoggedIn"
          type="button"
          class="w-28 py-2 bg-red-500 text-stone-50 font-medium rounded-xl shadow-md hover:shadow-lg hover:bg-red-600 transition text-center"
          @click="handleLogout"
        >
          logout
        </button>
      </aside>

      <!-- Main content -->
      <main class="flex-1 bg-neutral-800 flex items-center justify-center">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentUser, logout } from '../../api/auth.js'

const router = useRouter()
const user = ref(null)

const buttons = [
  { name: 'play', path: '/play' },
  { name: 'puzzles', path: '/puzzles' },
  { name: 'learn', path: '/learn' },
  { name: 'signup', path: '/signup' },
  { name: 'login', path: '/login'},
]

const isLoggedIn = computed(() => Boolean(user.value))

async function handleLogout() {
  try {
    await logout()
  } finally {
    user.value = null
    router.push('/login')
  }
}

onMounted(async () => {
  try {
    user.value = await getCurrentUser()
  } catch {
    user.value = null
  }
})
defineOptions({
  name: 'NavigationBar',
})
</script>