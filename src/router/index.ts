import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/promptpay',
      name: 'promptpay',
      component: () => import('@/views/promptpay/PromptPayView.vue'),
    },
    {
      path: '/fukuoka-trip',
      name: 'fukuoka-trip',
      component: () => import('@/views/fukuoka-trip/FukuokaTripView.vue'),
    },
  ],
})

export default router
