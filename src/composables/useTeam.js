import { ref } from 'vue'
import { teamMembers as initialTeamMembers } from '../data/team.js'

const STORAGE_KEY = 'k3_portfolio_members_v1'

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.substring(0, 2).toUpperCase()
}

function loadSavedMembers() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return initialTeamMembers.map((m) => ({ ...m }))
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return initialTeamMembers.map((m) => ({ ...m }))
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed
  } catch (err) {
    console.error('Gagal membaca anggota dari localStorage:', err)
  }
  return initialTeamMembers.map((m) => ({ ...m }))
}

// Global reactive singleton — shared across all components
const members = ref(loadSavedMembers())

function persistMembers() {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(members.value))
    } catch (err) {
      console.error('Gagal menyimpan anggota ke localStorage:', err)
    }
  }
}

export function useTeam() {
  /**
   * Tambah anggota baru
   */
  function addMember(payload) {
    const maxId = members.value.reduce((acc, m) => Math.max(acc, m.id || 0), 0)
    const id = maxId + 1
    const initials = payload.initials?.trim() || getInitials(payload.name)

    const skillsArray = Array.isArray(payload.skills)
      ? payload.skills
      : typeof payload.skills === 'string'
        ? payload.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : []

    const newMember = {
      id,
      name: payload.name?.trim() || `Anggota ${id}`,
      nim: payload.nim?.trim() || '',
      role: payload.role?.trim() || 'Developer',
      avatar:
        payload.avatar?.trim() ||
        `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(initials)}&backgroundColor=1a1714&fontFamily=Georgia&fontSize=42&fontWeight=700&textColor=ffffff`,
      bio: payload.bio?.trim() || '',
      skills: skillsArray,
      github: payload.github?.trim() || '',
      linkedin: payload.linkedin?.trim() || '',
      email: payload.email?.trim() || '',
      githubUsername: payload.githubUsername?.trim() || payload.github?.trim().split('/').pop() || '',
      initials,
      color: payload.color?.trim() || '#1a1714',
    }

    members.value.push(newMember)
    persistMembers()
    return newMember
  }

  /**
   * Edit anggota yang sudah ada
   */
  function updateMember(id, payload) {
    const idx = members.value.findIndex((m) => m.id === Number(id))
    if (idx === -1) return null

    const existing = members.value[idx]
    const initials = payload.initials?.trim() || getInitials(payload.name || existing.name)

    const skillsArray = Array.isArray(payload.skills)
      ? payload.skills
      : typeof payload.skills === 'string'
        ? payload.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : existing.skills

    const updated = {
      ...existing,
      name: payload.name?.trim() || existing.name,
      nim: payload.nim?.trim() !== undefined ? payload.nim.trim() : existing.nim,
      role: payload.role?.trim() || existing.role,
      avatar:
        payload.avatar?.trim() ||
        `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(initials)}&backgroundColor=1a1714&fontFamily=Georgia&fontSize=42&fontWeight=700&textColor=ffffff`,
      bio: payload.bio !== undefined ? payload.bio.trim() : existing.bio,
      skills: skillsArray,
      github: payload.github?.trim() ?? existing.github,
      linkedin: payload.linkedin?.trim() ?? existing.linkedin,
      email: payload.email?.trim() ?? existing.email,
      githubUsername:
        payload.githubUsername?.trim() ||
        payload.github?.trim().split('/').pop() ||
        existing.githubUsername,
      initials,
      color: payload.color?.trim() || existing.color,
    }

    members.value.splice(idx, 1, updated)
    persistMembers()
    return updated
  }

  /**
   * Hapus anggota berdasarkan id
   */
  function deleteMember(id) {
    const idx = members.value.findIndex((m) => m.id === Number(id))
    if (idx !== -1) {
      members.value.splice(idx, 1)
      persistMembers()
      return true
    }
    return false
  }

  /**
   * Kembalikan data anggota ke default
   */
  function resetToDefault() {
    members.value = initialTeamMembers.map((m) => ({ ...m }))
    persistMembers()
  }

  function getMemberById(id) {
    return members.value.find((m) => m.id === Number(id)) || null
  }

  return {
    teamMembers: members,
    addMember,
    updateMember,
    deleteMember,
    resetToDefault,
    getMemberById,
    getInitials,
  }
}
