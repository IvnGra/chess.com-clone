import { createWebHistory, createRouter } from 'vue-router';

import HomeView from '../views/home.vue';
import playView from '../views/play.vue';
import PuzzlesView from '../views/puzzles.vue';
import learnView from '../views/learn.vue';


const routes = [
  //main routes
  { path: '/', name: 'Home', component: HomeView },
  { path: '/play', name: 'play', component: playView },
  { path: '/puzzles', name: 'puzzles', component: PuzzlesView },
  { path: '/learn', name: 'learn', component: learnView },
  
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

export default router;