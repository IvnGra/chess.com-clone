import { createWebHistory, createRouter } from 'vue-router';

import HomeView from '../views/home.vue';


const routes = [
  //main routes
  { path: '/', name: 'Home', component: HomeView },
  
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

export default router;