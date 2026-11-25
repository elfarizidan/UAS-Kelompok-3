<script setup>
defineProps({
  label: { type: String, default: 'KELOMPOK 3' },
})
</script>

<template>
  <span class="brand">
    <svg class="brand__mark" viewBox="0 0 40 40" aria-hidden="true">
      <rect width="40" height="40" fill="currentColor" />
      <path d="M8 9h7l5 11-5 11H8l5-11z" fill="var(--brand-bg, #ff4655)" />
      <path d="M21 9h11l-6 11 6 11H21l6-11z" fill="var(--brand-bg, #ff4655)" opacity="0.65" />
    </svg>
    <span class="brand__text">{{ label }}</span>
  </span>
</template>

<style scoped>
.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.brand__mark {
  width: 30px;
  height: 30px;
  color: var(--white);
}
.brand__text {
  font-family: var(--font-display);
  font-size: 1.15rem;
  letter-spacing: 0.06em;
  line-height: 1;
}
</style>
