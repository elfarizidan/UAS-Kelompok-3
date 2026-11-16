<script setup>
defineProps({
  size: { type: String, default: 'md', validator: (v) => ['sm', 'md', 'lg'].includes(v) },
  label: { type: String, default: 'Loading…' },
})
</script>

<template>
  <div class="spinner-wrap" :class="`spinner-wrap--${size}`" role="status" :aria-label="label">
    <svg class="spinner" viewBox="0 0 50 50" fill="none" aria-hidden="true">
      <circle class="spinner__track" cx="25" cy="25" r="20" stroke="currentColor" stroke-width="4" />
      <circle class="spinner__fill" cx="25" cy="25" r="20" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
    </svg>
    <span class="sr-only">{{ label }}</span>
  </div>
</template>

<style scoped>
.spinner-wrap { display: flex; align-items: center; justify-content: center; color: var(--color-text-muted); }
.spinner-wrap--sm .spinner { width: 20px; height: 20px; }
.spinner-wrap--md .spinner { width: 36px; height: 36px; }
.spinner-wrap--lg .spinner { width: 56px; height: 56px; }

.spinner { animation: rotate 1.4s linear infinite; }
.spinner__track { opacity: 0.15; }
.spinner__fill {
  stroke-dasharray: 94;
  stroke-dashoffset: 70;
  animation: dash 1.4s ease-in-out infinite;
}

@keyframes rotate { 100% { transform: rotate(360deg); } }
@keyframes dash {
  0% { stroke-dashoffset: 94; }
  50% { stroke-dashoffset: 20; }
  100% { stroke-dashoffset: 94; transform: rotate(360deg); }
}
</style>

