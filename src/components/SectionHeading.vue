<script setup>
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  align: { type: String, default: 'center' },
})
</script>

<template>
  <div class="heading" :class="`heading--${align}`">
    <span v-if="eyebrow" class="eyebrow">{{ eyebrow }}</span>
    <h2 class="heading__title">{{ title }}</h2>
    <p v-if="subtitle" class="heading__sub">{{ subtitle }}</p>
  </div>
</template>

<style scoped>
.heading {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: clamp(32px, 5vw, 56px);
}

.heading--center {
  align-items: center;
  text-align: center;
}

.heading--left {
  align-items: flex-start;
}

.heading__title {
  font-size: clamp(2.4rem, 5.5vw, 4rem);
}

.heading__sub {
  max-width: 60ch;
  opacity: 0.8;
}
</style>
