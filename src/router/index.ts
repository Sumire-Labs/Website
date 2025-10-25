import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// Lazy load route components for better code splitting
const HomeView = () => import('@/views/HomeView.vue')
const LabsView = () => import('@/views/LabsView.vue')
const WikiView = () => import('@/views/WikiView.vue')

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
  {
    path: '/wiki/:category?/:page?',
    name: 'wiki',
    component: WikiView,
    meta: {
      title: 'Wiki - すみれさば',
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
