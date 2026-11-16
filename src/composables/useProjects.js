import { ref, computed } from 'vue'
import {
  initialProjects,
  projectCategories,
  getAllTechnologies,
} from '../data/projects.js'
import { useTeam } from './useTeam.js'

const STORAGE_KEY = 'k3_portfolio_projects_v2'

function loadSavedProjects() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [...initialProjects]
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return [...initialProjects]
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed
    }
  } catch (err) {
    console.error('Gagal membaca proyek dari localStorage:', err)
  }
  return [...initialProjects]
}

// Global reactive state shared across all components
const projects = ref(loadSavedProjects())

function persist() {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects.value))
    } catch (err) {
      console.error('Gagal menyimpan proyek ke localStorage:', err)
    }
  }
}

export function useProjects() {
  const { teamMembers } = useTeam()

  const searchQuery = ref('')
  const selectedCategory = ref('All')
  const selectedMember = ref('All') // 'All' or memberId number
  const selectedTech = ref('All')
  const sortOrder = ref('newest') // 'newest' | 'oldest' | 'alpha'
  const isLoading = ref(false)

  // Ekstrak teknologi secara dinamis dari proyek yang aktif saat ini
  const availableTechs = computed(() => {
    return ['All', ...getAllTechnologies(projects.value)]
  })

  const availableMembers = computed(() => [
    { id: 'All', name: 'Semua Anggota' },
    ...teamMembers.value.map((m) => ({ id: m.id, name: m.name, role: m.role })),
  ])

  const filteredProjects = computed(() => {
    let result = [...projects.value]

    // 1. Filter by Member
    if (selectedMember.value !== 'All') {
      const targetMemberId = Number(selectedMember.value)
      result = result.filter((p) =>
        p.contributors.some((c) => c.memberId === targetMemberId)
      )
    }

    // 2. Filter by Category
    if (selectedCategory.value !== 'All') {
      result = result.filter((p) => p.category === selectedCategory.value)
    }

    // 3. Filter by Technology
    if (selectedTech.value !== 'All') {
      result = result.filter(
        (p) => Array.isArray(p.tech) && p.tech.includes(selectedTech.value)
      )
    }

    // 4. Search query
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      result = result.filter((p) => {
        const matchesTitle = p.title.toLowerCase().includes(q)
        const matchesDesc = p.shortDesc.toLowerCase().includes(q)
        const matchesTech = p.tech.some((t) => t.toLowerCase().includes(q))
        const matchesTag = p.tags && p.tags.some((t) => t.toLowerCase().includes(q))
        const matchesCategory = p.category.toLowerCase().includes(q)

        const matchesContributor = p.contributors.some((c) => {
          const m = teamMembers.value.find((tm) => tm.id === c.memberId)
          return m && (m.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q))
        })

        return (
          matchesTitle ||
          matchesDesc ||
          matchesTech ||
          matchesTag ||
          matchesCategory ||
          matchesContributor
        )
      })
    }

    // 5. Sorting
    result.sort((a, b) => {
      if (sortOrder.value === 'newest') return Number(b.year) - Number(a.year)
      if (sortOrder.value === 'oldest') return Number(a.year) - Number(b.year)
      if (sortOrder.value === 'alpha') return a.title.localeCompare(b.title)
      return 0
    })

    return result
  })

  const hasResults = computed(() => filteredProjects.value.length > 0)
  const totalCount = computed(() => filteredProjects.value.length)

  function resetFilters() {
    searchQuery.value = ''
    selectedCategory.value = 'All'
    selectedMember.value = 'All'
    selectedTech.value = 'All'
    sortOrder.value = 'newest'
  }

  function filterByMember(memberId) {
    selectedMember.value = memberId
  }

  function filterByTech(tech) {
    selectedTech.value = tech
  }

  /**
   * Menambahkan proyek baru secara dinamis
   */
  function addProject(payload) {
    const maxId = projects.value.reduce((acc, p) => Math.max(acc, p.id || 0), 0)
    const id = maxId + 1

    let baseSlug = (payload.slug || payload.title || `proyek-${id}`)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')

    let finalSlug = baseSlug
    let counter = 1
    while (projects.value.some((p) => p.slug === finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`
      counter++
    }

    // Parse tech string jika berupa teks koma
    let techList = []
    if (Array.isArray(payload.tech)) {
      techList = payload.tech
    } else if (typeof payload.tech === 'string') {
      techList = payload.tech.split(',').map((s) => s.trim()).filter(Boolean)
    }
    if (techList.length === 0) techList = ['Web']

    // Contributors
    const contributors = Array.isArray(payload.contributors) && payload.contributors.length > 0
      ? payload.contributors
      : [{ memberId: payload.memberId ? Number(payload.memberId) : 1, role: payload.role || 'Creator & Developer' }]

    const newProject = {
      id,
      slug: finalSlug,
      title: payload.title.trim(),
      type: payload.type || (contributors.length > 1 ? 'Team' : 'Personal'),
      shortDesc: payload.shortDesc?.trim() || payload.description?.trim() || '',
      description: payload.description?.trim() || payload.shortDesc?.trim() || '',
      category: payload.category || 'Web App',
      tags: payload.tags || [payload.category || 'Web App'],
      tech: techList,
      year: String(payload.year || new Date().getFullYear()),
      status: payload.status || 'Completed',
      thumbnail: payload.thumbnail?.trim() || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
      gallery: payload.gallery && payload.gallery.length > 0
        ? payload.gallery
        : [payload.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80'],
      overview: payload.overview?.trim() || payload.description?.trim() || payload.shortDesc?.trim() || '',
      background: payload.background?.trim() || 'Proyek dikembangkan untuk menjawab kebutuhan digitalisasi dan efisiensi sistem.',
      problemStatement: payload.problemStatement?.trim() || 'Kebutuhan solusi otomatisasi sistem yang mudah digunakan dan dapat diandalkan.',
      objectives: Array.isArray(payload.objectives) && payload.objectives.length > 0
        ? payload.objectives
        : ['Membangun antarmuka pengguna yang intuitif', 'Menyediakan fungsionalitas yang andal dan teruji'],
      solution: payload.solution?.trim() || 'Implementasi arsitektur sistem modern yang modular dan scalable.',
      keyFeatures: Array.isArray(payload.keyFeatures) && payload.keyFeatures.length > 0
        ? payload.keyFeatures
        : ['Fitur utama terintegrasi', 'Manajemen data terstruktur'],
      developmentProcess: payload.developmentProcess || [
        { phase: '01. Analisis Kebutuhan', desc: 'Identifikasi alur sistem dan riset pengguna.' },
        { phase: '02. Implementasi Sistem', desc: 'Pengembangan kode dan integrasi fitur utama.' },
        { phase: '03. Pengujian & Evaluasi', desc: 'Pengujian fungsi dan verifikasi kinerja.' },
      ],
      contributors,
      results: payload.results?.trim() || 'Proyek berhasil diimplementasikan dan siap didemonstrasikan.',
      repoUrl: payload.repoUrl?.trim() || null,
      demoUrl: payload.demoUrl?.trim() || null,
      isCustom: true, // Tanda proyek ditambahkan oleh pengguna
    }

    projects.value.unshift(newProject)
    persist()
    return newProject
  }

  /**
   * Mengupdate proyek yang sudah ada
   */
  function updateProject(idOrSlug, payload) {
    const idx = projects.value.findIndex((p) => p.id === idOrSlug || p.slug === idOrSlug)
    if (idx === -1) return null

    const existing = projects.value[idx]

    let techList = []
    if (Array.isArray(payload.tech)) {
      techList = payload.tech
    } else if (typeof payload.tech === 'string') {
      techList = payload.tech.split(',').map((s) => s.trim()).filter(Boolean)
    }
    if (techList.length === 0) techList = existing.tech

    const contributors = Array.isArray(payload.contributors) && payload.contributors.length > 0
      ? payload.contributors
      : existing.contributors

    const updated = {
      ...existing,
      title: payload.title?.trim() || existing.title,
      type: payload.type || existing.type,
      shortDesc: payload.shortDesc?.trim() || existing.shortDesc,
      description: payload.description?.trim() || payload.shortDesc?.trim() || existing.description,
      overview: payload.overview?.trim() || payload.shortDesc?.trim() || existing.overview,
      background: payload.background?.trim() !== undefined && payload.background?.trim() !== '' ? payload.background.trim() : existing.background,
      problemStatement: payload.problemStatement?.trim() !== undefined && payload.problemStatement?.trim() !== '' ? payload.problemStatement.trim() : existing.problemStatement,
      solution: payload.solution?.trim() !== undefined && payload.solution?.trim() !== '' ? payload.solution.trim() : existing.solution,
      objectives: Array.isArray(payload.objectives) && payload.objectives.length > 0 ? payload.objectives : existing.objectives,
      keyFeatures: Array.isArray(payload.keyFeatures) && payload.keyFeatures.length > 0 ? payload.keyFeatures : existing.keyFeatures,
      developmentProcess: Array.isArray(payload.developmentProcess) && payload.developmentProcess.length > 0 ? payload.developmentProcess : existing.developmentProcess,
      results: payload.results?.trim() !== undefined && payload.results?.trim() !== '' ? payload.results.trim() : existing.results,
      category: payload.category || existing.category,
      tech: techList,
      year: String(payload.year || existing.year),
      status: payload.status || existing.status,
      thumbnail: payload.thumbnail?.trim() || existing.thumbnail,
      gallery: payload.gallery && payload.gallery.length > 0 ? payload.gallery : existing.gallery,
      contributors,
      repoUrl: payload.repoUrl?.trim() || null,
      demoUrl: payload.demoUrl?.trim() || null,
    }

    projects.value.splice(idx, 1, updated)
    persist()
    return updated
  }

  /**
   * Menghapus proyek
   */
  function deleteProject(idOrSlug) {
    const idx = projects.value.findIndex((p) => p.id === idOrSlug || p.slug === idOrSlug)
    if (idx !== -1) {
      projects.value.splice(idx, 1)
      persist()
      return true
    }
    return false
  }

  /**
   * Mengembalikan data proyek ke daftar default
   */
  function resetToDefault() {
    projects.value = [...initialProjects]
    persist()
  }

  function getProjectBySlug(slug) {
    return projects.value.find((p) => p.slug === slug) || null
  }

  function getProjectsByMember(memberId) {
    const id = Number(memberId)
    return projects.value.filter((p) => p.contributors.some((c) => c.memberId === id))
  }

  /**
   * Sinkronisasi repositori GitHub publik ke daftar proyek anggota
   */
  function syncMemberGithubProjects(memberId, repos) {
    const mid = Number(memberId)
    if (!Array.isArray(repos) || repos.length === 0) return []

    const synced = []

    repos.forEach((repo) => {
      if (!repo || !repo.html_url) return

      // Cari proyek yang sudah ada berdasarkan URL repo atau slug repo
      const existing = projects.value.find(
        (p) =>
          (p.repoUrl && p.repoUrl.toLowerCase() === repo.html_url.toLowerCase()) ||
          p.slug === `gh-${repo.name.toLowerCase()}`
      )

      if (existing) {
        if (!existing.contributors.some((c) => c.memberId === mid)) {
          existing.contributors.push({
            memberId: mid,
            role: repo.fork ? 'Team Contributor' : 'Lead Developer',
          })
        }
        synced.push(existing)
      } else {
        const isPersonal = !repo.fork
        const lang = repo.language || 'Web'
        let category = 'Web App'
        if (['Kotlin', 'Swift', 'Flutter', 'Dart', 'React Native'].includes(lang)) {
          category = 'Mobile App'
        } else if (['Figma', 'CSS', 'HTML'].includes(lang)) {
          category = 'Design'
        } else if (['Python', 'Go', 'PHP', 'Java', 'Rust', 'C#', 'C++'].includes(lang)) {
          category = 'Backend / API'
        }

        const formattedTitle = (repo.name || 'Proyek')
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase())

        const maxId = projects.value.reduce((acc, p) => Math.max(acc, p.id || 0), 0)
        const id = maxId + 1

        const newProj = {
          id,
          slug: `gh-${(repo.name || `project-${id}`).toLowerCase()}-${id}`,
          title: formattedTitle,
          type: isPersonal ? 'Personal' : 'Team',
          shortDesc: repo.description?.trim() || `Proyek repositori publik GitHub (${repo.name})`,
          description:
            repo.description?.trim() ||
            `Proyek open-source ${repo.name} yang dikembangkan dan dipublikasikan di platform GitHub.`,
          overview:
            repo.description?.trim() ||
            `Proyek ${formattedTitle} dibangun menggunakan ${lang} dengan repositori terbuka di GitHub.`,
          category,
          tech: [repo.language, ...(repo.topics || [])].filter(Boolean),
          year: String(new Date(repo.updated_at || repo.created_at || Date.now()).getFullYear()),
          status: 'Completed',
          thumbnail:
            category === 'Mobile App'
              ? 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80'
              : category === 'Design'
                ? 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80'
                : category === 'Backend / API'
                  ? 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80'
                  : 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          gallery: [],
          contributors: [
            {
              memberId: mid,
              role: isPersonal ? 'Lead Developer & Solo Creator' : 'Team Contributor',
            },
          ],
          repoUrl: repo.html_url,
          demoUrl: repo.homepage || null,
          isCustom: true,
        }

        projects.value.unshift(newProj)
        synced.push(newProj)
      }
    })

    persist()
    return synced
  }

  return {
    projects,
    projectCategories,
    availableTechs,
    availableMembers,
    searchQuery,
    selectedCategory,
    selectedMember,
    selectedTech,
    sortOrder,
    filteredProjects,
    hasResults,
    totalCount,
    isLoading,
    resetFilters,
    filterByMember,
    filterByTech,
    addProject,
    updateProject,
    deleteProject,
    resetToDefault,
    getProjectBySlug,
    getProjectsByMember,
    syncMemberGithubProjects,
  }
}
