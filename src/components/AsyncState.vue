<script setup>
defineProps({
  loading: { type: Boolean, default: false },
  error: { type: String, default: null },
  skeletons: { type: Number, default: 3 },
})
defineEmits(['retry'])
</script>

<template>
  <div v-if="loading" class="state state--loading" role="status" aria-live="polite">
    <span class="sr-only">Memuat data...</span>
    <div v-for="n in skeletons" :key="n" class="skeleton" />
  </div>

  <div v-else-if="error" class="state state--error" role="alert">
    <span class="state__code">ERROR</span>
    <p class="state__msg">{{ error }}</p>
    <button type="button" class="btn" @click="$emit('retry')">Coba Lagi</button>
  </div>

  <slot v-else />
</template>

<style scoped>
.state--loading {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}

.skeleton {
  height: 220px;
  background: linear-gradient(90deg, rgba(128, 128, 128, 0.12) 0%, rgba(128, 128, 128, 0.24) 50%, rgba(128, 128, 128, 0.12) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.2s linear infinite;
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%);
}

@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}

.state--error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 24px;
  text-align: center;
  border: 1px dashed currentColor;
}

.state__code {
  font-family: var(--font-display);
  font-size: 2rem;
  color: var(--red);
  letter-spacing: 0.08em;
}

.state__msg {
  max-width: 52ch;
  opacity: 0.85;
}
</style>
