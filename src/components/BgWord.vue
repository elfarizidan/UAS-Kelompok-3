<script setup>
defineProps({
  text: { type: String, required: true },
  position: { type: String, default: 'top' },
})
</script>

<template>
  <span class="bg-word" :class="`bg-word--${position}`" aria-hidden="true">{{ text }}</span>
</template>

<style scoped>
.bg-word {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 0;
  font-family: var(--font-display);
  font-size: clamp(6rem, 22vw, 18rem);
  line-height: 0.8;
  text-transform: uppercase;
  white-space: nowrap;
  color: transparent;
  -webkit-text-stroke: 2px currentColor;
  opacity: 0.08;
  pointer-events: none;
  user-select: none;
}

.bg-word--top {
  top: 24px;
}

.bg-word--bottom {
  bottom: -10px;
}
</style>
