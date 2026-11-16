import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: 'Home — Kelompok 3' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
      meta: { title: 'About Team — Kelompok 3' },
    },
    {
      path: '/members/:id',
      name: 'member-detail',
      component: () => import('@/views/MemberDetailView.vue'),
      meta: { title: 'Member Portfolio — Kelompok 3' },
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('@/views/ProjectsView.vue'),
      meta: { title: 'Project Showcase — Kelompok 3' },
    },
    {
      path: '/projects/:slug',
      name: 'project-detail',
      component: () => import('@/views/ProjectDetailView.vue'),
      meta: { title: 'Project Detail — Kelompok 3' },
    },
    {
      path: '/manage-projects',
      name: 'manage-projects',
      component: () => import('@/views/ManageProjectsView.vue'),
      meta: { title: 'Kelola Proyek — Kelompok 3' },
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/ContactView.vue'),
      meta: { title: 'Contact — Kelompok 3' },
    },
    {
      path: '/api-explorer',
      name: 'api-explorer',
      component: () => import('@/views/ApiExplorerView.vue'),
      meta: { title: 'GitHub API Explorer — Kelompok 3' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: '404 — Kelompok 3' },
    },
  ],
})

// Update document title on route change
router.afterEach((to) => {
  document.title = to.meta?.title ?? 'Kelompok 3'
})

export default router
