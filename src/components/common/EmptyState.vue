<script setup>
defineProps({
  title: { type: String, default: 'Tidak ada hasil' },
  description: { type: String, default: '' },
  icon: { type: String, default: 'search' }, // 'search' | 'folder' | 'error' | 'wifi'
})

defineEmits(['action'])
</script>

<template>
  <div class="empty-state" role="status">
    <div class="empty-state__icon" aria-hidden="true">
      <!-- Search icon -->
      <svg v-if="icon === 'search'" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <!-- Folder icon -->
      <svg v-else-if="icon === 'folder'" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
      <!-- Error / warning icon -->
      <svg v-else-if="icon === 'error'" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      <!-- Wifi off icon -->
      <svg v-else-if="icon === 'wifi'" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.56 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
    </div>
    <h3 class="empty-state__title">{{ title }}</h3>
    <p v-if="description" class="empty-state__desc">{{ description }}</p>
    <div v-if="$slots.action" class="empty-state__action">
      <slot name="action" />
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-16) var(--space-8);
  gap: var(--space-3);
}
.empty-state__icon {
  color: var(--color-text-muted);
  margin-bottom: var(--space-2);
  opacity: 0.6;
}
.empty-state__title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}
.empty-state__desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  max-width: 320px;
  margin: 0;
}
.empty-state__action { margin-top: var(--space-4); }
</style>

