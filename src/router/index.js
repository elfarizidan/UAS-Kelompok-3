import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { title: 'Beranda' } },
    { path: '/tim', name: 'about', component: () => import('@/views/AboutView.vue'), meta: { title: 'Tentang Tim' } },
    { path: '/proyek', name: 'projects', component: () => import('@/views/ProjectsView.vue'), meta: { title: 'Proyek' } },
    {
      path: '/proyek/:id',
      name: 'project-detail',
      component: () => import('@/views/ProjectDetailView.vue'),
      props: true,
      meta: { title: 'Detail Proyek' },
    },
    { path: '/kontak', name: 'contact', component: () => import('@/views/ContactView.vue'), meta: { title: 'Kontak' } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue'), meta: { title: '404' } },
  ],
  scrollBehavior(to, from, saved) {
    return saved || { top: 0 }
  },
})

router.afterEach((to) => {
  document.title = `${to.meta.title} | Kelompok 3`
})

export default router
