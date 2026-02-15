<template>
  <section class="w-full max-w-xl px-6 py-10">
    <div class="rounded-2xl border border-stone-700 bg-stone-900/70 p-8 shadow-xl">
      <h1 class="text-3xl font-semibold text-stone-100">Welcome back</h1>
      <p class="mt-2 text-sm text-stone-400">Log in to continue your chess journey.</p>

      <form class="mt-8 space-y-5" @submit.prevent="handleLogin">
        <div>
          <label class="block text-sm text-stone-300">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="mt-2 w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100 focus:border-lime-500 focus:outline-none"
            autocomplete="email"
            required
          />
        </div>

        <div>
          <label class="block text-sm text-stone-300">Password</label>
          <input
            v-model="form.password"
            type="password"
            class="mt-2 w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100 focus:border-lime-500 focus:outline-none"
            autocomplete="current-password"
            required
          />
        </div>

        <p v-if="error" class="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {{ error }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-lg bg-lime-600 px-4 py-2 text-stone-900 font-semibold shadow-md transition hover:bg-lime-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {{ loading ? 'Logging in...' : 'Log in' }}
        </button>
      </form>

      <p class="mt-6 text-sm text-stone-400">
        Need an account?
        <router-link class="text-lime-400 hover:text-lime-300" to="/signup">Sign up</router-link>
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../api/auth.js';

const router = useRouter();
const loading = ref(false);
const error = ref('');

const form = ref({
  email: '',
  password: '',
});

function normalizeError(err) {
  if (!err) return 'Something went wrong. Please try again.';
  if (typeof err === 'string') return err;
  if (err.detail) return err.detail;
  return 'Invalid email or password.';
}

async function handleLogin() {
  error.value = '';
  loading.value = true;
  try {
    await login({
      email: form.value.email,
      password: form.value.password,
    });
    router.push('/play');
  } catch (err) {
    error.value = normalizeError(err);
  } finally {
    loading.value = false;
  }
}
</script>
