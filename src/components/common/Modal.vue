<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg', 'xl'].includes(v),
  },
})

const emit = defineEmits(['update:modelValue', 'close'])

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function handleKeydown(e) {
  if (e.key === 'Escape' && props.modelValue) close()
}

onMounted(() => document.addEventListener('keydown', handleKeydown))
onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="modal-overlay"
        role="dialog"
        :aria-label="title || 'Dialog'"
        aria-modal="true"
        @click.self="close"
      >
        <div class="modal-panel" :class="`modal-panel--${size}`">
          <!-- Header -->
          <div v-if="title || $slots.header" class="modal-header">
            <slot name="header">
              <h2 class="modal-title">{{ title }}</h2>
            </slot>
            <button class="modal-close" aria-label="Close dialog" @click="close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
}

.modal-panel {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-panel--sm { max-width: 400px; }
.modal-panel--md { max-width: 560px; }
.modal-panel--lg { max-width: 720px; }
.modal-panel--xl { max-width: 960px; }

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-6) var(--space-6) var(--space-4);
  border-bottom: 1px solid var(--color-border-subtle);
  flex-shrink: 0;
}
.modal-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}
.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  transition: color var(--transition-fast), background-color var(--transition-fast);
  flex-shrink: 0;
}
.modal-close:hover {
  color: var(--color-text);
  background: var(--color-bg-alt);
}

.modal-body {
  padding: var(--space-6);
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--color-border-subtle);
  flex-shrink: 0;
}

/* Transition */
.modal-enter-active, .modal-leave-active {
  transition: opacity var(--transition-base);
}
.modal-enter-active .modal-panel, .modal-leave-active .modal-panel {
  transition: transform var(--transition-base), opacity var(--transition-base);
}
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-panel { transform: scale(0.95) translateY(16px); opacity: 0; }
.modal-leave-to .modal-panel { transform: scale(0.97) translateY(8px); opacity: 0; }

@media (max-width: 480px) {
  .modal-overlay { align-items: flex-end; padding: 0; }
  .modal-panel { border-radius: var(--radius-lg) var(--radius-lg) 0 0; max-width: 100%; max-height: 85vh; }
}
</style>

