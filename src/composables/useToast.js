import { ref } from 'vue'

const toasts = ref([])
let idCounter = 0

export function useToast() {
  function addToast({ message, type = 'info', duration = 4000 }) {
    const id = ++idCounter
    toasts.value.push({ id, message, type })

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }
    return id
  }

  function removeToast(id) {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) toasts.value.splice(index, 1)
  }

  function success(message, duration) {
    return addToast({ message, type: 'success', duration })
  }

  function error(message, duration) {
    return addToast({ message, type: 'error', duration })
  }

  function info(message, duration) {
    return addToast({ message, type: 'info', duration })
  }

  function warning(message, duration) {
    return addToast({ message, type: 'warning', duration })
  }

  return { toasts, addToast, removeToast, success, error, info, warning }
}

