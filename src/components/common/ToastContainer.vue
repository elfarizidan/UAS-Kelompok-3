<script setup>
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()
</script>

<template>
  <Teleport to="body">
    <div class="toast-container" role="region" aria-label="Notifications" aria-live="polite">
      <TransitionGroup name="toast" tag="div" class="toast-list">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="`toast--${toast.type}`"
          role="alert"
        >
          <!-- Icon -->
          <span class="toast__icon" aria-hidden="true">
            <svg v-if="toast.type === 'success'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M20 6 9 17l-5-5"/></svg>
            <svg v-else-if="toast.type === 'error'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            <svg v-else-if="toast.type === 'warning'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/></svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          </span>
          <span class="toast__message">{{ toast.message }}</span>
          <button class="toast__dismiss" aria-label="Dismiss" @click="removeToast(toast.id)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: var(--space-6);
  right: var(--space-6);
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  pointer-events: none;
}
.toast-list { display: contents; }

.toast {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  border: 1px solid;
  box-shadow: var(--shadow-lg);
  min-width: 280px;
  max-width: 400px;
  pointer-events: all;
  backdrop-filter: blur(8px);
}

.toast--success { background: color-mix(in srgb, var(--color-success) 12%, var(--color-bg-elevated)); border-color: color-mix(in srgb, var(--color-success) 30%, transparent); color: var(--color-success); }
.toast--error { background: color-mix(in srgb, var(--color-error) 12%, var(--color-bg-elevated)); border-color: color-mix(in srgb, var(--color-error) 30%, transparent); color: var(--color-error); }
.toast--warning { background: color-mix(in srgb, var(--color-warning) 12%, var(--color-bg-elevated)); border-color: color-mix(in srgb, var(--color-warning) 30%, transparent); color: var(--color-warning); }
.toast--info { background: var(--color-bg-elevated); border-color: var(--color-border); color: var(--color-text); }

.toast__icon { flex-shrink: 0; }
.toast__message { font-size: var(--text-sm); font-weight: 500; flex: 1; }
.toast__dismiss {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  opacity: 0.5;
  transition: opacity var(--transition-fast);
  color: inherit;
}
.toast__dismiss:hover { opacity: 1; }

/* Transition */
.toast-enter-active { transition: all var(--transition-base); }
.toast-leave-active { transition: all var(--transition-base); }
.toast-enter-from { opacity: 0; transform: translateX(100%) scale(0.9); }
.toast-leave-to { opacity: 0; transform: translateX(100%) scale(0.9); }

@media (max-width: 480px) {
  .toast-container { left: var(--space-4); right: var(--space-4); bottom: var(--space-4); }
  .toast { min-width: unset; max-width: 100%; }
}
</style>

