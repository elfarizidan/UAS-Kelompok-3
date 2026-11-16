<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  items: { type: Array, default: null }, // override auto-generate
})

const route = useRoute()

const crumbs = computed(() => {
  if (props.items) return props.items

  const segments = route.path.split('/').filter(Boolean)
  const result = [{ label: 'Home', to: '/' }]

  let path = ''
  segments.forEach((seg) => {
    path += `/${seg}`
    // prettify slug
    const label = seg
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
    result.push({ label, to: path })
  })
  return result
})
</script>

<template>
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <ol role="list">
      <li v-for="(crumb, i) in crumbs" :key="crumb.to" class="breadcrumbs__item">
        <router-link
          v-if="i < crumbs.length - 1"
          :to="crumb.to"
          class="breadcrumbs__link"
        >{{ crumb.label }}</router-link>
        <span v-else class="breadcrumbs__current" aria-current="page">{{ crumb.label }}</span>
        <span v-if="i < crumbs.length - 1" class="breadcrumbs__sep" aria-hidden="true">/</span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.breadcrumbs ol {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  list-style: none;
  gap: var(--space-1);
}
.breadcrumbs__item {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}
.breadcrumbs__link {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  transition: color var(--transition-fast);
}
.breadcrumbs__link:hover { color: var(--color-text); }
.breadcrumbs__current {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  font-weight: 500;
}
.breadcrumbs__sep {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}
</style>

