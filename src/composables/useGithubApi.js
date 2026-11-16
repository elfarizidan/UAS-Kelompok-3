import { ref, readonly } from 'vue'

const BASE_URL = 'https://api.github.com'

/**
 * GitHub REST API composable
 * Docs: https://docs.github.com/en/rest
 *
 * API yang digunakan:
 * GET /users/{username}             → profil pengguna GitHub
 * GET /users/{username}/repos       → daftar repository publik
 * GET /users/{username}/events/public → aktivitas publik terbaru
 */
export function useGithubApi() {
  const loading = ref(false)
  const error = ref(null)
  const data = ref(null)

  async function fetchUserProfile(username) {
    loading.value = true
    error.value = null
    data.value = null

    try {
      const res = await fetch(`${BASE_URL}/users/${username}`, {
        headers: { Accept: 'application/vnd.github.v3+json' },
      })
      if (!res.ok) {
        if (res.status === 404) throw new Error(`User "${username}" tidak ditemukan di GitHub.`)
        if (res.status === 403) throw new Error('Rate limit GitHub API tercapai. Coba lagi nanti.')
        throw new Error(`GitHub API error: ${res.status}`)
      }
      const json = await res.json()
      data.value = json
      return json
    } catch (err) {
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  async function fetchUserRepos(username, { sort = 'updated', per_page = 6 } = {}) {
    loading.value = true
    error.value = null
    data.value = null

    try {
      const url = `${BASE_URL}/users/${username}/repos?sort=${sort}&per_page=${per_page}&type=public`
      const res = await fetch(url, {
        headers: { Accept: 'application/vnd.github.v3+json' },
      })
      if (!res.ok) {
        if (res.status === 404) throw new Error(`User "${username}" tidak ditemukan.`)
        if (res.status === 403) throw new Error('Rate limit GitHub API tercapai. Coba lagi nanti.')
        throw new Error(`GitHub API error: ${res.status}`)
      }
      const json = await res.json()
      data.value = json
      return json
    } catch (err) {
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  async function fetchMultipleProfiles(usernames) {
    loading.value = true
    error.value = null

    try {
      const results = await Promise.allSettled(
        usernames.map((u) =>
          fetch(`${BASE_URL}/users/${u}`, {
            headers: { Accept: 'application/vnd.github.v3+json' },
          }).then((r) => {
            if (!r.ok) throw new Error(`${u}: HTTP ${r.status}`)
            return r.json()
          })
        )
      )

      const profiles = results
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value)

      const errors = results
        .filter((r) => r.status === 'rejected')
        .map((r) => r.reason?.message)

      if (errors.length) {
        error.value = errors.join('; ')
      }

      data.value = profiles
      return profiles
    } catch (err) {
      error.value = err.message
      return []
    } finally {
      loading.value = false
    }
  }

  function reset() {
    loading.value = false
    error.value = null
    data.value = null
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    data: readonly(data),
    fetchUserProfile,
    fetchUserRepos,
    fetchMultipleProfiles,
    reset,
  }
}

