<script setup>
defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'accent', 'success', 'warning', 'error', 'outline'].includes(v),
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md'].includes(v),
  },
})
</script>

<template>
  <span class="badge" :class="[`badge--${variant}`, `badge--${size}`]">
    <slot />
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  letter-spacing: 0.03em;
  border-radius: var(--radius-full);
  white-space: nowrap;
  font-family: var(--font-sans);
}

.badge--sm { font-size: 10px; padding: 2px var(--space-2); }
.badge--md { font-size: var(--text-xs); padding: 3px var(--space-3); }

.badge--default {
  background: var(--color-bg-alt);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}
.badge--accent {
  background: var(--color-highlight-subtle);
  color: var(--color-highlight);
  border: 1px solid color-mix(in srgb, var(--color-highlight) 20%, transparent);
}
.badge--success {
  background: color-mix(in srgb, var(--color-success) 10%, transparent);
  color: var(--color-success);
  border: 1px solid color-mix(in srgb, var(--color-success) 20%, transparent);
}
.badge--warning {
  background: color-mix(in srgb, var(--color-warning) 10%, transparent);
  color: var(--color-warning);
  border: 1px solid color-mix(in srgb, var(--color-warning) 20%, transparent);
}
.badge--error {
  background: color-mix(in srgb, var(--color-error) 10%, transparent);
  color: var(--color-error);
  border: 1px solid color-mix(in srgb, var(--color-error) 20%, transparent);
}
.badge--outline {
  background: transparent;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}
</style>

