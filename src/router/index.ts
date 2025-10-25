import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LabsView from '@/views/LabsView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Home - すみれさば',
    },
  },
  {
    path: '/labs',
    name: 'labs',
    component: LabsView,
    meta: {
      title: 'Labs - すみれさば',
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

router.beforeEach((to, _from, next) => {
  document.title = (to.meta.title as string) || 'すみれさば'
  next()
})

export default router
