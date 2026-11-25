<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  // Image URL or local path in public/ (e.g. /images/members/zidan.jpg). Empty = initials.
  src: { type: String, default: '' },
})

// Fall back to initials when the image path is wrong.
const failed = ref(false)
watch(() => props.src, () => (failed.value = false))

const initials = computed(() =>
  props.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join(''),
)
</script>

<template>
  <div class="avatar">
    <img v-if="src && !failed" :src="src" :alt="`Foto ${name}`" loading="lazy" @error="failed = true" />
    <span v-else class="avatar__initials" aria-hidden="true">{{ initials }}</span>
  </div>
</template>

<style scoped>
.avatar {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background:
    repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0 2px, transparent 2px 14px),
    linear-gradient(170deg, var(--red) 0%, var(--red-deep) 100%);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar__initials {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-family: var(--font-display);
  font-size: clamp(4rem, 9vw, 7rem);
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.02em;
}
</style>
