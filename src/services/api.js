// MockAPI client. Base URL comes from .env.local (VITE_API_BASE_URL).
import { ref } from 'vue'

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')

// Increments after every successful write. useAsync watches it so all pages reload.
export const dataVersion = ref(0)

async function request(method, path, body) {
  if (!BASE_URL || BASE_URL.includes('<project-id>')) {
    throw new Error('VITE_API_BASE_URL belum diatur. Salin .env.example ke .env.local lalu isi URL MockAPI.')
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (res.status === 404) {
    throw new Error('Data tidak ditemukan.')
  }
  if (!res.ok) {
    const verb = method === 'GET' ? 'memuat' : 'menyimpan'
    throw new Error(`Gagal ${verb} data (HTTP ${res.status}).`)
  }
  return res.json()
}

function afterWrite(result) {
  teamRequest = null
  dataVersion.value++
  return result
}

// ---------- Team (1 item, includes members array) ----------
// The request is shared so pages that need team + members only fetch once.
let teamRequest = null

export function getTeam() {
  if (!teamRequest) {
    teamRequest = request('GET', '/team')
      .then((list) => {
        if (!list.length) throw new Error('Data tim kosong.')
        return list[0]
      })
      .catch((err) => {
        teamRequest = null
        throw err
      })
  }
  return teamRequest
}

export async function getMembers() {
  const team = await getTeam()
  return team.members || []
}

export function updateTeam(team) {
  return request('PUT', `/team/${encodeURIComponent(team.id)}`, team).then(afterWrite)
}

// ---------- Projects ----------
export function getProjects() {
  return request('GET', '/projects')
}

export function getProject(id) {
  return request('GET', `/projects/${encodeURIComponent(id)}`)
}

export function createProject(project) {
  const { id, ...data } = project
  return request('POST', '/projects', data).then(afterWrite)
}

export function updateProject(project) {
  return request('PUT', `/projects/${encodeURIComponent(project.id)}`, project).then(afterWrite)
}

export function deleteProject(id) {
  return request('DELETE', `/projects/${encodeURIComponent(id)}`).then(afterWrite)
}
