import { createWebHistory, createRouter } from 'vue-router';

import HomeView from '../views/home.vue';
import playView from '../views/play.vue';
import PuzzlesView from '../views/puzzles.vue';
import learnView from '../views/learn.vue';
import SignupView from '../views/signup.vue';
import LoginView from '../views/login.vue';
import { getCurrentUser } from '../api/auth.js';


const routes = [
  //main routes
  { path: '/', name: 'Home', component: HomeView },
  { path: '/play', name: 'play', component: playView, meta: { requiresAuth: true } },
  { path: '/puzzles', name: 'puzzles', component: PuzzlesView, meta: { requiresAuth: true } },
  { path: '/learn', name: 'learn', component: learnView, meta: { requiresAuth: true } },
  { path: '/signup', name: 'signup', component: SignupView },
  { path: '/login', name: 'login', component: LoginView },
  
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) {
    return true;
  }

  try {
    const user = await getCurrentUser();
    if (user) {
      return true;
    }
    return { path: '/login', query: { next: to.fullPath } };
  } catch {
    return { path: '/login', query: { next: to.fullPath } };
  }
});

export default router;