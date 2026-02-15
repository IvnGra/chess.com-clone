<template>
  <section class="w-full max-w-xl px-6 py-10">
    <div class="rounded-2xl border border-stone-700 bg-stone-900/70 p-8 shadow-xl">
      <h1 class="text-3xl font-semibold text-stone-100">Create account</h1>
      <p class="mt-2 text-sm text-stone-400">Join to save puzzles and track progress.</p>

      <form class="mt-8 space-y-5" @submit.prevent="handleSignup">
        <div>
          <label class="block text-sm text-stone-300">Name</label>
          <input
            v-model="form.name"
            type="text"
            class="mt-2 w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100 focus:border-lime-500 focus:outline-none"
            autocomplete="name"
            required
          />
        </div>

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
          <label class="block text-sm text-stone-300">Age</label>
          <input
            v-model.number="form.age"
            type="number"
            min="1"
            class="mt-2 w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100 focus:border-lime-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label class="block text-sm text-stone-300">Password</label>
          <input
            v-model="form.password"
            type="password"
            class="mt-2 w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100 focus:border-lime-500 focus:outline-none"
            autocomplete="new-password"
            required
          />
        </div>

        <div>
          <label class="block text-sm text-stone-300">Confirm password</label>
          <input
            v-model="form.passwordConfirm"
            type="password"
            class="mt-2 w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100 focus:border-lime-500 focus:outline-none"
            autocomplete="new-password"
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
          {{ loading ? 'Creating account...' : 'Sign up' }}
        </button>
      </form>

      <p class="mt-6 text-sm text-stone-400">
        Already have an account?
        <router-link class="text-lime-400 hover:text-lime-300" to="/login">Log in</router-link>
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signup } from '../api/auth.js';

const router = useRouter();
const loading = ref(false);
const error = ref('');

const form = ref({
  name: '',
  email: '',
  age: null,
  password: '',
  passwordConfirm: '',
});

function normalizeError(err) {
  if (!err) return 'Something went wrong. Please try again.';
  if (typeof err === 'string') return err;
  if (err.detail) return err.detail;
  if (err.email) return err.email.join(' ');
  if (err.password) return err.password.join(' ');
  return 'Something went wrong. Please try again.';
}

async function handleSignup() {
  error.value = '';
  if (form.value.password !== form.value.passwordConfirm) {
    error.value = 'Passwords do not match.';
    return;
  }

  loading.value = true;
  try {
    await signup({
      name: form.value.name,
      email: form.value.email,
      age: form.value.age,
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
