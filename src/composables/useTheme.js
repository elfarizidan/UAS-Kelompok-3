import { ref, readonly } from 'vue'

const theme = ref(localStorage.getItem('theme') ?? 'light')

function applyTheme(value) {
  document.documentElement.setAttribute('data-theme', value)
  localStorage.setItem('theme', value)
}

// Apply on init
applyTheme(theme.value)

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    applyTheme(theme.value)
  }

  function setTheme(value) {
    theme.value = value
    applyTheme(value)
  }

  return {
    theme: readonly(theme),
    toggleTheme,
    setTheme,
  }
}

