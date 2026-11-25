<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import BrandMark from './BrandMark.vue'

const links = [
  { to: '/', label: 'Beranda' },
  { to: '/tim', label: 'Tentang Kami' },
  { to: '/proyek', label: 'Proyek' },
  { to: '/kontak', label: 'Kontak' },
]

const open = ref(false)
const route = useRoute()
watch(() => route.fullPath, () => (open.value = false))
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <RouterLink to="/" class="header__brand" aria-label="Beranda Kelompok 3">
        <BrandMark />
      </RouterLink>

      <button
        class="header__toggle"
        type="button"
        :aria-expanded="open"
        aria-controls="main-nav"
        @click="open = !open"
      >
        <span class="sr-only">Menu</span>
        <span class="bar" /><span class="bar" /><span class="bar" />
      </button>

      <nav id="main-nav" class="header__nav" :class="{ 'is-open': open }">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="header__link"
          :exact-active-class="link.to === '/' ? 'is-active' : ''"
          :active-class="link.to === '/' ? '' : 'is-active'"
        >
          {{ link.label }}
        </RouterLink>
        <RouterLink to="/kontak" class="header__cta">Hubungi Kami</RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(15, 25, 35, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(236, 232, 225, 0.08);
  color: var(--white);
}

.header__inner {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 var(--gutter);
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header__brand {
  text-decoration: none;
}

.header__nav {
  display: flex;
  align-items: center;
  gap: 32px;
}

.header__link {
  position: relative;
  font-family: var(--font-cond);
  font-weight: 700;
  font-size: 0.92rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--cream);
  padding: 8px 0;
  transition: color 0.2s var(--ease);
}

.header__link::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background: var(--red);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.25s var(--ease);
}

.header__link:hover,
.header__link.is-active {
  color: var(--white);
}

.header__link:hover::after,
.header__link.is-active::after {
  transform: scaleX(1);
}

.header__cta {
  font-family: var(--font-cond);
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-decoration: none;
  padding: 10px 18px;
  background: var(--white);
  color: var(--navy);
  transition: background 0.2s var(--ease), color 0.2s var(--ease);
}

.header__cta:hover {
  background: var(--red);
  color: var(--white);
}

.header__toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 10px;
  background: none;
  border: 0;
  cursor: pointer;
}

.bar {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--white);
}

@media (max-width: 860px) {
  .header__toggle {
    display: flex;
  }

  .header__nav {
    position: absolute;
    top: 68px;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 12px var(--gutter) 24px;
    background: var(--navy);
    border-bottom: 3px solid var(--red);
    display: none;
  }

  .header__nav.is-open {
    display: flex;
  }

  .header__link {
    padding: 14px 0;
    border-bottom: 1px solid rgba(236, 232, 225, 0.1);
  }

  .header__link::after {
    display: none;
  }

  .header__link.is-active {
    color: var(--red);
  }

  .header__cta {
    margin-top: 16px;
    text-align: center;
  }
}
</style>
