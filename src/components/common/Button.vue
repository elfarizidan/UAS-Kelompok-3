<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'ghost', 'danger', 'outline'].includes(v),
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
  as: {
    type: String,
    default: 'button',
  },
  disabled: Boolean,
  loading: Boolean,
  fullWidth: Boolean,
})

const emit = defineEmits(['click'])

function handleClick(event) {
  if (props.disabled || props.loading) {
    event.preventDefault()
    event.stopPropagation()
    return
  }
  emit('click', event)
}
</script>

<template>
  <component
    :is="as"
    class="btn"
    :type="as === 'button' ? 'button' : undefined"
    :class="[`btn--${variant}`, `btn--${size}`, { 'btn--disabled': disabled || loading, 'btn--full': fullWidth }]"
    :disabled="as === 'button' ? (disabled || loading) : undefined"
    :aria-disabled="disabled || loading"
    v-bind="$attrs"
    @click="handleClick"
  >
    <!-- Loading spinner -->
    <span v-if="loading" class="btn__spinner" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
    </span>
    <slot />
  </component>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: var(--font-sans);
  font-weight: 500;
  letter-spacing: 0.01em;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
  text-decoration: none;
  border: 1px solid transparent;
  position: relative;
}

/* Sizes */
.btn--sm { font-size: var(--text-xs); padding: var(--space-2) var(--space-4); height: 32px; }
.btn--md { font-size: var(--text-sm); padding: var(--space-2) var(--space-5); height: 40px; }
.btn--lg { font-size: var(--text-base); padding: var(--space-3) var(--space-6); height: 48px; }

/* Variants */
.btn--primary {
  background: var(--color-text);
  color: var(--color-bg);
  border-color: var(--color-text);
}
.btn--primary:hover:not(.btn--disabled) {
  background: var(--color-accent-hover);
  border-color: var(--color-accent-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn--secondary {
  background: var(--color-bg-alt);
  color: var(--color-text);
  border-color: var(--color-border);
}
.btn--secondary:hover:not(.btn--disabled) {
  background: var(--color-border);
  transform: translateY(-1px);
}

.btn--ghost {
  background: transparent;
  color: var(--color-text-secondary);
  border-color: transparent;
}
.btn--ghost:hover:not(.btn--disabled) {
  background: var(--color-bg-alt);
  color: var(--color-text);
}

.btn--outline {
  background: transparent;
  color: var(--color-text);
  border-color: var(--color-text);
}
.btn--outline:hover:not(.btn--disabled) {
  background: var(--color-text);
  color: var(--color-bg);
  transform: translateY(-1px);
}

.btn--danger {
  background: var(--color-error);
  color: white;
  border-color: var(--color-error);
}
.btn--danger:hover:not(.btn--disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* States */
.btn--disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}
.btn--full { width: 100%; }

/* Spinner animation */
.btn__spinner {
  animation: spin 0.8s linear infinite;
}
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>

