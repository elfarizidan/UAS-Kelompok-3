<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import AddProjectModal from '@/components/portfolio/AddProjectModal.vue'
import MemberModal from '@/components/portfolio/MemberModal.vue'

const route = useRoute()
const { theme, toggleTheme } = useTheme()

const isMenuOpen = ref(false)
const isScrolled = ref(false)
const isManageOpen = ref(false)

// Modal tambah proyek & tambah anggota langsung di navbar
const isAddModalOpen = ref(false)
const isAddMemberModalOpen = ref(false)

const navLinks = [
  { name: 'Home', to: '/' },
  { name: 'About', to: '/about' },
  { name: 'Projects', to: '/projects' },
  { name: 'GitHub API', to: '/api-explorer' },
  { name: 'Contact', to: '/contact' },
]

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function closeMenu() {
  isMenuOpen.value = false
  isManageOpen.value = false
}

function openAddModal() {
  isManageOpen.value = false
  isMenuOpen.value = false
  isAddModalOpen.value = true
}

function openAddMemberModal() {
  isManageOpen.value = false
  isMenuOpen.value = false
  isAddMemberModalOpen.value = true
}

function handleScroll() {
  isScrolled.value = window.scrollY > 20
}

function handleClickOutside(e) {
  if (!e.target.closest('.navbar__manage-wrap')) {
    isManageOpen.value = false
  }
}

watch(() => route.path, closeMenu)

if (typeof window !== 'undefined') {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('click', handleClickOutside)
}

const themeIcon = computed(() => (theme.value === 'dark' ? 'sun' : 'moon'))
</script>

<template>
  <header class="navbar" :class="{ 'navbar--scrolled': isScrolled }">
    <nav class="container navbar__inner">
      <!-- Logo -->
      <router-link to="/" class="navbar__logo" @click="closeMenu">
        <span class="navbar__logo-mark">K3</span>
        <span class="navbar__logo-text">Kelompok 3</span>
      </router-link>

      <!-- Desktop nav links -->
      <ul class="navbar__links" role="list">
        <li v-for="link in navLinks" :key="link.to">
          <router-link
            :to="link.to"
            class="navbar__link"
            :class="{ 'navbar__link--active': isActive(link.to) }"
          >
            {{ link.name }}
          </router-link>
        </li>
      </ul>

      <!-- Right side actions -->
      <div class="navbar__actions">

        <!-- ★ Manage Projects Dropdown ★ -->
        <div class="navbar__manage-wrap">
          <button
            class="navbar__manage-btn"
            :class="{ 'is-open': isManageOpen }"
            aria-haspopup="true"
            :aria-expanded="isManageOpen"
            @click.stop="isManageOpen = !isManageOpen"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span class="navbar__manage-btn__label">Kelola Proyek</span>
            <svg
              class="navbar__manage-btn__caret"
              width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="3" stroke-linecap="round"
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          <!-- Dropdown panel -->
          <Transition name="dropdown">
            <div v-if="isManageOpen" class="navbar__dropdown" role="menu">
              <p class="navbar__dropdown__eyebrow">Manajemen Portofolio &amp; Tim</p>

              <!-- Tambah Proyek (CTA utama) — langsung buka modal -->
              <button
                class="navbar__dropdown__item navbar__dropdown__item--cta navbar__dropdown__item--btn"
                role="menuitem"
                @click="openAddModal"
              >
                <span class="navbar__dropdown__item__icon navbar__dropdown__item__icon--accent">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </span>
                <span class="navbar__dropdown__item__text">
                  <span class="navbar__dropdown__item__title">Tambah Proyek Baru</span>
                  <span class="navbar__dropdown__item__desc">Daftarkan karya ke portofolio</span>
                </span>
              </button>

              <!-- Tambah Anggota (CTA kedua) — langsung buka modal anggota -->
              <button
                class="navbar__dropdown__item navbar__dropdown__item--cta-member navbar__dropdown__item--btn"
                role="menuitem"
                @click="openAddMemberModal"
              >
                <span class="navbar__dropdown__item__icon navbar__dropdown__item__icon--member">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <line x1="19" y1="8" x2="19" y2="14"/>
                    <line x1="22" y1="11" x2="16" y2="11"/>
                  </svg>
                </span>
                <span class="navbar__dropdown__item__text">
                  <span class="navbar__dropdown__item__title">Tambah Anggota Baru</span>
                  <span class="navbar__dropdown__item__desc">Daftarkan profil &amp; NIM anggota</span>
                </span>
              </button>

              <div class="navbar__dropdown__divider" />

              <!-- Kelola Proyek Tim -->
              <router-link
                to="/manage-projects?tab=projects"
                class="navbar__dropdown__item"
                role="menuitem"
                @click="closeMenu"
              >
                <span class="navbar__dropdown__item__icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                </span>
                <span class="navbar__dropdown__item__text">
                  <span class="navbar__dropdown__item__title">Kelola &amp; Edit Proyek</span>
                  <span class="navbar__dropdown__item__desc">Tambah, edit, hapus data proyek tim</span>
                </span>
              </router-link>

              <!-- Kelola Anggota Tim -->
              <router-link
                to="/manage-projects?tab=members"
                class="navbar__dropdown__item"
                role="menuitem"
                @click="closeMenu"
              >
                <span class="navbar__dropdown__item__icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </span>
                <span class="navbar__dropdown__item__text">
                  <span class="navbar__dropdown__item__title">Kelola Anggota Tim</span>
                  <span class="navbar__dropdown__item__desc">Edit, hapus, dan atur profil anggota</span>
                </span>
              </router-link>

              <div class="navbar__dropdown__divider" />

              <!-- Lihat showcase -->
              <router-link
                to="/projects"
                class="navbar__dropdown__item"
                role="menuitem"
                @click="closeMenu"
              >
                <span class="navbar__dropdown__item__icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </span>
                <span class="navbar__dropdown__item__text">
                  <span class="navbar__dropdown__item__title">Lihat Showcase</span>
                  <span class="navbar__dropdown__item__desc">Halaman publik portofolio tim</span>
                </span>
              </router-link>
            </div>
          </Transition>
        </div>

        <!-- Theme toggle -->
        <button
          class="navbar__theme-toggle"
          :aria-label="`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`"
          @click="toggleTheme"
        >
          <svg v-if="theme === 'dark'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>

        <!-- Hamburger (mobile only) -->
        <button
          class="navbar__hamburger"
          :class="{ 'navbar__hamburger--open': isMenuOpen }"
          :aria-expanded="isMenuOpen"
          aria-label="Toggle menu"
          @click="isMenuOpen = !isMenuOpen"
        >
          <span class="navbar__hamburger-line" />
          <span class="navbar__hamburger-line" />
          <span class="navbar__hamburger-line" />
        </button>
      </div>
    </nav>

    <!-- Mobile menu -->
    <Transition name="mobile-menu">
      <div v-if="isMenuOpen" class="navbar__mobile" role="dialog" aria-label="Mobile navigation">
        <ul role="list">
          <li v-for="link in navLinks" :key="link.to">
            <router-link
              :to="link.to"
              class="navbar__mobile-link"
              :class="{ 'navbar__mobile-link--active': isActive(link.to) }"
              @click="closeMenu"
            >
              {{ link.name }}
            </router-link>
          </li>
          <li class="navbar__mobile-divider" />
          <li>
            <button
              class="navbar__mobile-link navbar__mobile-link--add"
              @click="openAddModal"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Tambah Proyek Baru
            </button>
          </li>
          <li>
            <button
              class="navbar__mobile-link navbar__mobile-link--add-member"
              @click="openAddMemberModal"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
              Tambah Anggota Baru
            </button>
          </li>
          <li>
            <router-link
              to="/manage-projects?tab=projects"
              class="navbar__mobile-link"
              @click="closeMenu"
            >
              Kelola &amp; Edit Proyek
            </router-link>
          </li>
          <li>
            <router-link
              to="/manage-projects?tab=members"
              class="navbar__mobile-link"
              @click="closeMenu"
            >
              Kelola Anggota Tim
            </router-link>
          </li>
        </ul>
      </div>
    </Transition>
  </header>

  <!-- ★ Modal Proyek & Anggota Global di Navbar ★ -->
  <AddProjectModal v-model="isAddModalOpen" />
  <MemberModal v-model="isAddMemberModalOpen" />
</template>

<style scoped>
/* ── Base ── */
.navbar {
  position: fixed; top: 0; left: 0; right: 0;
  height: 64px; z-index: var(--z-navbar, 100);
  background: var(--color-bg);
  border-bottom: 1px solid transparent;
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
}
.navbar--scrolled {
  border-bottom-color: var(--color-border-subtle);
  box-shadow: 0 1px 12px rgba(0,0,0,0.06);
}
.navbar__inner {
  display: flex; align-items: center; justify-content: space-between;
  height: 100%; gap: var(--space-6);
}

/* Logo */
.navbar__logo {
  display: flex; align-items: center; gap: var(--space-2);
  text-decoration: none; flex-shrink: 0;
}
.navbar__logo-mark {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px;
  background: var(--color-text); color: var(--color-bg);
  font-family: var(--font-display); font-size: 13px; font-weight: 800;
  border-radius: var(--radius-sm);
}
.navbar__logo-text {
  font-family: var(--font-display); font-size: var(--text-sm);
  font-weight: 700; color: var(--color-text); letter-spacing: -0.01em;
}

/* Nav Links */
.navbar__links {
  display: flex; align-items: center; gap: var(--space-1);
  list-style: none; margin: 0; padding: 0;
}
.navbar__link {
  font-size: var(--text-sm); font-weight: 500;
  color: var(--color-text-secondary); text-decoration: none;
  padding: var(--space-2) var(--space-3); border-radius: var(--radius-sm);
  transition: color var(--transition-fast), background-color var(--transition-fast);
}
.navbar__link:hover { color: var(--color-text); background: var(--color-bg-alt); }
.navbar__link--active { color: var(--color-text); font-weight: 600; }

/* Actions */
.navbar__actions {
  display: flex; align-items: center; gap: var(--space-2); flex-shrink: 0;
}

/* Manage wrap */
.navbar__manage-wrap { position: relative; }

.navbar__manage-btn {
  display: flex; align-items: center; gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm); font-weight: 600;
  color: var(--color-bg);
  background: var(--color-text);
  border: 1px solid var(--color-text);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.navbar__manage-btn:hover { opacity: 0.85; }
.navbar__manage-btn.is-open {
  background: var(--color-text); opacity: 0.9;
}
.navbar__manage-btn__caret {
  transition: transform var(--transition-fast);
}
.navbar__manage-btn.is-open .navbar__manage-btn__caret {
  transform: rotate(180deg);
}

/* Dropdown */
.navbar__dropdown {
  position: absolute; top: calc(100% + 8px); right: 0;
  width: 260px;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
  padding: var(--space-2);
  z-index: 999;
}

.navbar__dropdown__eyebrow {
  font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--color-text-muted);
  padding: var(--space-2) var(--space-3) var(--space-1); margin: 0;
}

.navbar__dropdown__divider {
  height: 1px; background: var(--color-border-subtle); margin: var(--space-2) 0;
}

/* Dropdown item — shared for both <a> and <button> */
.navbar__dropdown__item {
  display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: background-color var(--transition-fast);
  cursor: pointer; margin-bottom: 2px;
  width: 100%;
}
.navbar__dropdown__item:hover { background: var(--color-bg-alt); }

/* When item is a <button> */
.navbar__dropdown__item--btn {
  background: none;
  border: none;
  font-family: inherit;
  text-align: left;
}

.navbar__dropdown__item--cta {
  background: var(--color-highlight-subtle);
  border: 1px solid color-mix(in srgb, var(--color-highlight) 25%, transparent);
  margin-bottom: var(--space-2);
}
.navbar__dropdown__item--cta:hover {
  background: color-mix(in srgb, var(--color-highlight) 18%, transparent);
}

.navbar__dropdown__item--cta-member {
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  margin-bottom: var(--space-2);
}
.navbar__dropdown__item--cta-member:hover {
  background: var(--color-bg);
  border-color: var(--color-text-secondary);
}

.navbar__dropdown__item__icon {
  width: 34px; height: 34px;
  display: flex; align-items: center; justify-content: center;
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  color: var(--color-text-secondary);
  flex-shrink: 0;
  border: 1px solid var(--color-border-subtle);
}
.navbar__dropdown__item__icon--accent {
  background: var(--color-highlight); color: white; border-color: transparent;
}
.navbar__dropdown__item__icon--member {
  background: var(--color-bg-elevated); color: var(--color-text); border-color: var(--color-border);
}

.navbar__dropdown__item__text {
  display: flex; flex-direction: column; gap: 2px;
}
.navbar__dropdown__item__title {
  font-size: var(--text-sm); font-weight: 600; color: var(--color-text); line-height: 1.2;
}
.navbar__dropdown__item__desc {
  font-size: 11px; color: var(--color-text-muted); line-height: 1.3;
}

/* Theme toggle */
.navbar__theme-toggle {
  display: flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  transition: color var(--transition-fast), background-color var(--transition-fast);
}
.navbar__theme-toggle:hover { color: var(--color-text); background: var(--color-bg-alt); }

/* Hamburger */
.navbar__hamburger {
  display: none; flex-direction: column; justify-content: center;
  gap: 5px; width: 36px; height: 36px; padding: var(--space-2);
  border-radius: var(--radius-sm); transition: background-color var(--transition-fast);
}
.navbar__hamburger:hover { background: var(--color-bg-alt); }
.navbar__hamburger-line {
  display: block; width: 100%; height: 1.5px;
  background: var(--color-text); border-radius: 2px;
  transition: transform var(--transition-base), opacity var(--transition-base);
  transform-origin: center;
}
.navbar__hamburger--open .navbar__hamburger-line:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
.navbar__hamburger--open .navbar__hamburger-line:nth-child(2) { opacity: 0; transform: scaleX(0); }
.navbar__hamburger--open .navbar__hamburger-line:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

/* Mobile menu */
.navbar__mobile {
  position: absolute; top: 64px; left: 0; right: 0;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-4) var(--container-pad);
}
.navbar__mobile ul { list-style: none; display: flex; flex-direction: column; gap: var(--space-1); }
.navbar__mobile-link {
  display: flex; align-items: center; gap: var(--space-2);
  font-size: var(--text-base); font-weight: 500; color: var(--color-text-secondary);
  padding: var(--space-3) var(--space-4); border-radius: var(--radius-md);
  transition: color var(--transition-fast), background-color var(--transition-fast);
  text-decoration: none; width: 100%; background: none; border: none;
  font-family: inherit; cursor: pointer; text-align: left;
}
.navbar__mobile-link:hover,
.navbar__mobile-link--active { color: var(--color-text); background: var(--color-bg-alt); }
.navbar__mobile-link--add {
  background: var(--color-text); color: var(--color-bg) !important; font-weight: 700;
}
.navbar__mobile-link--add:hover { background: var(--color-highlight) !important; color: white !important; }
.navbar__mobile-link--add-member {
  background: var(--color-bg-alt);
  color: var(--color-text) !important;
  border: 1px solid var(--color-border);
  font-weight: 600;
}
.navbar__mobile-link--add-member:hover { background: var(--color-bg) !important; }
.navbar__mobile-divider {
  height: 1px; background: var(--color-border-subtle); margin: var(--space-2) 0;
}

/* Transitions */
.dropdown-enter-active, .dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-6px) scale(0.98); }
.mobile-menu-enter-active, .mobile-menu-leave-active { transition: opacity var(--transition-base), transform var(--transition-base); }
.mobile-menu-enter-from, .mobile-menu-leave-to { opacity: 0; transform: translateY(-8px); }

/* Responsive */
@media (max-width: 768px) {
  .navbar__links { display: none; }
  .navbar__hamburger { display: flex; }
  .navbar__manage-wrap { display: none; }
}
</style>
