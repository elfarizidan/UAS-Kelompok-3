import { ref, shallowRef, watch } from 'vue'
import { dataVersion } from '@/services/api'

/**
 * Run an async loader and expose loading / error / data + reload().
 * Pass `source` (a ref or getter) to re-run when it changes.
 * Also re-runs silently (no loading state) after any data edit (dataVersion).
 */
export function useAsync(loader, source) {
  const data = shallowRef(null)
  const error = ref(null)
  const loading = ref(false)
  let requestId = 0

  async function run({ silent = false } = {}) {
    const current = ++requestId
    if (!silent) {
      loading.value = true
      error.value = null
    }
    try {
      const result = await loader()
      if (current === requestId) {
        data.value = result
        error.value = null
      }
    } catch (err) {
      if (current === requestId) error.value = err.message || 'Terjadi kesalahan.'
    } finally {
      if (current === requestId) loading.value = false
    }
  }

  if (source) {
    watch(source, () => run(), { immediate: true })
  } else {
    run()
  }
  watch(dataVersion, () => run({ silent: data.value !== null }))

  return { data, error, loading, reload: () => run() }
}
