<script setup>
// Textarea bound to an array of strings. One item per line, or comma-separated.
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  label: { type: String, required: true },
  separator: { type: String, default: 'line' }, // 'line' | 'comma'
  rows: { type: Number, default: 4 },
})
const emit = defineEmits(['update:modelValue'])

const joiner = props.separator === 'comma' ? ', ' : '\n'
const splitter = props.separator === 'comma' ? /,|\n/ : /\n/

const parse = (value) =>
  value
    .split(splitter)
    .map((s) => s.trim())
    .filter(Boolean)

const text = ref((props.modelValue || []).join(joiner))

watch(
  () => props.modelValue,
  (value) => {
    if (JSON.stringify(value || []) !== JSON.stringify(parse(text.value))) {
      text.value = (value || []).join(joiner)
    }
  },
)

function onInput(event) {
  text.value = event.target.value
  emit('update:modelValue', parse(text.value))
}
</script>

<template>
  <label class="ed-field">
    <span class="ed-label">{{ label }}</span>
    <textarea class="ed-textarea" :rows="rows" :value="text" @input="onInput" />
    <span class="ed-hint">{{ separator === 'comma' ? 'Pisahkan dengan koma.' : 'Satu item per baris.' }}</span>
  </label>
</template>
