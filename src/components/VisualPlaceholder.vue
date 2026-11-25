<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  // Caption text, an image URL (http/https), or a local path in public/ (e.g. /images/kopi-1.jpg).
  label: { type: String, required: true },
  index: { type: Number, default: 0 },
})

const failed = ref(false)
watch(() => props.label, () => (failed.value = false))

const isImage = computed(() => !failed.value && /^(https?:\/\/|\/)/.test(props.label))
// Caption shown when the image path is wrong: file name without extension.
const caption = computed(() =>
  /^(https?:\/\/|\/)/.test(props.label) ? props.label.split('/').pop().replace(/\.[a-z0-9]+$/i, '') : props.label,
)
const tone = computed(() => ['red', 'navy', 'steel'][props.index % 3])
</script>

<template>
  <figure class="visual" :class="`visual--${tone}`">
    <img v-if="isImage" :src="label" alt="Dokumentasi proyek" loading="lazy" @error="failed = true" />
    <template v-else>
      <span class="visual__grid" aria-hidden="true" />
      <span class="visual__no" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
      <figcaption class="visual__label">{{ caption }}</figcaption>
    </template>
  </figure>
</template>

<style scoped>
.visual {
  position: relative;
  margin: 0;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  color: var(--white);
}

.visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.visual--red {
  background: linear-gradient(150deg, var(--red) 0%, var(--red-deep) 100%);
}
.visual--navy {
  background: linear-gradient(150deg, var(--navy-3) 0%, var(--navy) 100%);
}
.visual--steel {
  background: linear-gradient(150deg, #4b5a68 0%, var(--navy-2) 100%);
}

.visual__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 28px 28px;
}

.visual__no {
  position: absolute;
  right: 12px;
  top: 4px;
  font-family: var(--font-display);
  font-size: 4.5rem;
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4);
}

.visual__label {
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 8px 14px;
  background: var(--navy);
  font-family: var(--font-cond);
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.visual--navy .visual__label {
  background: var(--red);
}
</style>
