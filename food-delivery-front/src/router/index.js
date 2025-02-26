import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import App from '/src/App.vue';


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/restaurant/:id',
    name: 'Restaurant',
    component: () => import('@/views/Restaurants.vue'),
    props: true
  },
  /*
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/Cart.vue')
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue')
  }
  */
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

const app = createApp(App);
app.use(router);
app.mount('#app');

export default router;



