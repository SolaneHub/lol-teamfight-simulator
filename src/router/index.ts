import { createRouter, createWebHashHistory } from 'vue-router'
import CustomizerView from '../views/CustomizerView.vue'
import CalculatorView from '../views/CalculatorView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'workshop',
      component: CustomizerView,
    },
    {
      path: '/workbench',
      redirect: '/',
    },
    {
      path: '/calculator',
      name: 'calculator',
      component: CalculatorView,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
