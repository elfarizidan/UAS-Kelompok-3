<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjects } from '@/composables/useProjects'
import { useTeam } from '@/composables/useTeam'
import { useToast } from '@/composables/useToast'
import Breadcrumbs from '@/components/common/Breadcrumbs.vue'
import Button from '@/components/common/Button.vue'
import Badge from '@/components/common/Badge.vue'
import AddProjectModal from '@/components/portfolio/AddProjectModal.vue'
import MemberModal from '@/components/portfolio/MemberModal.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const {
  projects,
  projectCategories,
  availableMembers,
  deleteProject,
  resetToDefault: resetProjectsToDefault,
} = useProjects()

const {
  teamMembers,
  deleteMember,
  resetToDefault: resetMembersToDefault,
  getInitials,
} = useTeam()

// ── Tab State: 'projects' | 'members' ──
const activeTab = ref(route.query.tab === 'members' ? 'members' : 'projects')

watch(() => route.query.tab, (val) => {
  if (val === 'members' || val === 'projects') {
    activeTab.value = val
  }
})

function switchTab(tab) {
  activeTab.value = tab
  router.replace({ query: { ...route.query, tab } })
}

// ── Project Modal State ──
const isAddModalOpen = ref(false)
const isEditModalOpen = ref(false)
const projectToEdit = ref(null)

function openAddModal() {
  projectToEdit.value = null
  isAddModalOpen.value = true
}

function openEditModal(proj) {
  projectToEdit.value = proj
  isEditModalOpen.value = true
}

// ── Member Modal State ──
const isAddMemberModalOpen = ref(false)
const isEditMemberModalOpen = ref(false)
const memberToEdit = ref(null)

function openAddMemberModal() {
  memberToEdit.value = null
  isAddMemberModalOpen.value = true
}

function openEditMemberModal(m) {
  memberToEdit.value = m
  isEditMemberModalOpen.value = true
}

// ── Confirm Delete Project ──
const projectToDelete = ref(null)
const isConfirmOpen = ref(false)

function promptDelete(proj) {
  projectToDelete.value = proj
  isConfirmOpen.value = true
}

function confirmDelete() {
  if (!projectToDelete.value) return
  const title = projectToDelete.value.title
  deleteProject(projectToDelete.value.id)
  toast.success(`Proyek "${title}" berhasil dihapus.`)
  projectToDelete.value = null
  isConfirmOpen.value = false
}

function cancelDelete() {
  projectToDelete.value = null
  isConfirmOpen.value = false
}

// ── Confirm Delete Member ──
const memberToDelete = ref(null)
const isMemberConfirmOpen = ref(false)

function promptDeleteMember(m) {
  memberToDelete.value = m
  isMemberConfirmOpen.value = true
}

function confirmDeleteMember() {
  if (!memberToDelete.value) return
  const name = memberToDelete.value.name
  deleteMember(memberToDelete.value.id)
  toast.success(`Anggota "${name}" berhasil dihapus.`)
  memberToDelete.value = null
  isMemberConfirmOpen.value = false
}

function cancelDeleteMember() {
  memberToDelete.value = null
  isMemberConfirmOpen.value = false
}

// ── Project Filters ──
const searchQuery = ref('')
const selectedMember = ref('All')
const selectedCategory = ref('All')
const sortOrder = ref('newest')

const displayedProjects = computed(() => {
  let list = [...projects.value]

  if (selectedMember.value !== 'All') {
    const mid = Number(selectedMember.value)
    list = list.filter((p) => p.contributors.some((c) => c.memberId === mid))
  }

  if (selectedCategory.value !== 'All') {
    list = list.filter((p) => p.category === selectedCategory.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter((p) => {
      const hits = [
        p.title,
        p.shortDesc || '',
        ...(p.tech || []),
      ].some((s) => s.toLowerCase().includes(q))
      const memberHit = p.contributors.some((c) => {
        const m = teamMembers.value.find((tm) => tm.id === c.memberId)
        return m && m.name.toLowerCase().includes(q)
      })
      return hits || memberHit
    })
  }

  list.sort((a, b) => {
    if (sortOrder.value === 'newest') return Number(b.year) - Number(a.year)
    if (sortOrder.value === 'oldest') return Number(a.year) - Number(b.year)
    if (sortOrder.value === 'alpha') return a.title.localeCompare(b.title)
    return 0
  })

  return list
})

function resetFilters() {
  searchQuery.value = ''
  selectedMember.value = 'All'
  selectedCategory.value = 'All'
  sortOrder.value = 'newest'
}

function handleResetDefaultProjects() {
  if (confirm('Kembalikan seluruh proyek ke daftar awal bawaan? Semua proyek kustom tambahan akan dihapus.')) {
    resetProjectsToDefault()
    toast.info('Data proyek dikembalikan ke default.')
  }
}

// ── Member Filters & Search ──
const memberSearchQuery = ref('')

const displayedMembers = computed(() => {
  let list = [...teamMembers.value]
  if (memberSearchQuery.value.trim()) {
    const q = memberSearchQuery.value.toLowerCase().trim()
    list = list.filter((m) => {
      const matchName = m.name.toLowerCase().includes(q)
      const matchRole = (m.role || '').toLowerCase().includes(q)
      const matchNim = (m.nim || '').toLowerCase().includes(q)
      const matchBio = (m.bio || '').toLowerCase().includes(q)
      const matchSkills = (m.skills || []).some((s) => s.toLowerCase().includes(q))
      return matchName || matchRole || matchNim || matchBio || matchSkills
    })
  }
  return list
})

function handleResetDefaultMembers() {
  if (confirm('Kembalikan seluruh anggota tim ke daftar awal bawaan? Perubahan dan anggota baru akan dikembalikan.')) {
    resetMembersToDefault()
    toast.info('Data anggota tim dikembalikan ke default.')
  }
}

function getMemberProjectCount(memberId) {
  return projects.value.filter((p) =>
    p.contributors.some((c) => c.memberId === Number(memberId))
  ).length
}

function getMember(memberId) {
  return teamMembers.value.find((m) => m.id === memberId) || {
    id: memberId, name: `Anggota ${memberId}`, avatar: '', role: '',
  }
}

// Stats
const totalCount = computed(() => projects.value.length)
const customCount = computed(() => projects.value.filter((p) => p.isCustom).length)
const teamCount = computed(() => projects.value.filter((p) => p.type === 'Team').length)
const personalCount = computed(() => projects.value.filter((p) => p.type === 'Personal').length)
const totalMembers = computed(() => teamMembers.value.length)
</script>

<template>
  <main class="mgp">

    <!-- Breadcrumbs -->
    <div class="container mgp__breadcrumbs">
      <Breadcrumbs
        :items="[
          { label: 'Home', to: '/' },
          { label: 'Projects', to: '/projects' },
          { label: 'Kelola Portofolio & Tim', to: '/manage-projects' },
        ]"
      />
    </div>

    <!-- ── Header ── -->
    <section class="mgp__header">
      <div class="container">
        <div class="mgp__header__inner">
          <div>
            <div class="mgp__eyebrow">
              <span class="mgp__eyebrow__line" />
              <span>Project &amp; Team Management Hub · Multi-Member Portfolio</span>
            </div>
            <h1 class="mgp__title">Kelola Portofolio &amp; Anggota Tim</h1>
            <p class="mgp__desc">
              Tambah dan atur karya proyek baru, kelola profil anggota tim, dan modifikasi data secara
              <strong>persisten di peramban</strong> — tanpa perlu mengubah source code.
            </p>
          </div>

          <div class="mgp__header__actions">
            <!-- Tambah Proyek -->
            <button
              type="button"
              class="mgp__header__add-btn"
              @click="openAddModal"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span>Tambah Proyek Baru</span>
            </button>

            <!-- Tambah Anggota (SEPERTI TAMBAH PROYEK) -->
            <button
              type="button"
              class="mgp__header__add-member-btn"
              @click="openAddMemberModal"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
              <span>Tambah Anggota Baru</span>
            </button>

            <router-link to="/projects" class="mgp__header__showcase-btn">
              Lihat Showcase →
            </router-link>
          </div>
        </div>

        <!-- ── Navigation Tabs: [ Proyek Tim ] [ Anggota Tim ] ── -->
        <div class="mgp__tabs">
          <button
            type="button"
            class="mgp__tab"
            :class="{ 'mgp__tab--active': activeTab === 'projects' }"
            @click="switchTab('projects')"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
            <span>Daftar Proyek</span>
            <span class="mgp__tab__badge">{{ totalCount }}</span>
          </button>

          <button
            type="button"
            class="mgp__tab"
            :class="{ 'mgp__tab--active': activeTab === 'members' }"
            @click="switchTab('members')"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>Daftar Anggota Tim</span>
            <span class="mgp__tab__badge">{{ totalMembers }}</span>
          </button>
        </div>

        <!-- Stats (Proyek) -->
        <div v-if="activeTab === 'projects'" class="mgp__stats">
          <div class="mgp__stat">
            <span class="mgp__stat__val">{{ totalCount }}</span>
            <span class="mgp__stat__lbl">Total Proyek</span>
          </div>
          <div class="mgp__stat">
            <span class="mgp__stat__val">{{ personalCount }}</span>
            <span class="mgp__stat__lbl">Personal</span>
          </div>
          <div class="mgp__stat">
            <span class="mgp__stat__val">{{ teamCount }}</span>
            <span class="mgp__stat__lbl">Tim</span>
          </div>
          <div class="mgp__stat mgp__stat--accent">
            <span class="mgp__stat__val">{{ customCount }}</span>
            <span class="mgp__stat__lbl">Kustom (Tambahan)</span>
          </div>
        </div>

        <!-- Stats (Anggota) -->
        <div v-else class="mgp__stats">
          <div class="mgp__stat">
            <span class="mgp__stat__val">{{ totalMembers }}</span>
            <span class="mgp__stat__lbl">Total Anggota</span>
          </div>
          <div class="mgp__stat">
            <span class="mgp__stat__val">{{ totalCount }}</span>
            <span class="mgp__stat__lbl">Total Karya Terhubung</span>
          </div>
          <div class="mgp__stat mgp__stat--accent">
            <span class="mgp__stat__val">{{ teamMembers.reduce((acc, m) => acc + (m.skills?.length || 0), 0) }}</span>
            <span class="mgp__stat__lbl">Keahlian Terdata</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════ -->
    <!-- ── TAB 1: KELOLA PROYEK ────────────────────────────── -->
    <!-- ══════════════════════════════════════════════════════ -->
    <template v-if="activeTab === 'projects'">
      <!-- Filter Toolbar -->
      <div class="mgp__toolbar">
        <div class="container mgp__toolbar__inner">
          <!-- Search -->
          <div class="mgp__search">
            <svg class="mgp__search__icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              v-model="searchQuery"
              type="search"
              class="mgp__search__input"
              placeholder="Cari judul, teknologi, atau nama anggota..."
            />
            <button v-if="searchQuery" class="mgp__search__clear" @click="searchQuery = ''">✕</button>
          </div>

          <!-- Selects -->
          <div class="mgp__selects">
            <select v-model="selectedMember" class="mgp__select">
              <option v-for="m in availableMembers" :key="m.id" :value="m.id">{{ m.name }}</option>
            </select>

            <select v-model="selectedCategory" class="mgp__select">
              <option v-for="cat in projectCategories" :key="cat" :value="cat">
                {{ cat === 'All' ? 'Semua Kategori' : cat }}
              </option>
            </select>

            <select v-model="sortOrder" class="mgp__select">
              <option value="newest">Tahun Terbaru</option>
              <option value="oldest">Tahun Terlama</option>
              <option value="alpha">A – Z</option>
            </select>

            <button class="mgp__reset-btn" @click="handleResetDefaultProjects">
              Reset Default
            </button>
          </div>
        </div>
      </div>

      <!-- Project Content -->
      <section class="mgp__content">
        <div class="container">
          <!-- Result bar -->
          <div class="mgp__resultbar">
            <span class="mgp__resultbar__text">
              Menampilkan <strong>{{ displayedProjects.length }}</strong> dari <strong>{{ totalCount }}</strong> proyek
            </span>
            <button
              v-if="searchQuery || selectedMember !== 'All' || selectedCategory !== 'All'"
              class="mgp__resultbar__reset"
              @click="resetFilters"
            >
              Reset Filter
            </button>
          </div>

          <!-- Project rows -->
          <div v-if="displayedProjects.length > 0" class="mgp__list">
            <div
              v-for="proj in displayedProjects"
              :key="proj.id"
              class="mgp__row"
            >
              <!-- Thumbnail -->
              <div class="mgp__row__thumb-wrap">
                <img :src="proj.thumbnail" :alt="proj.title" class="mgp__row__thumb" loading="lazy" />
              </div>

              <!-- Info -->
              <div class="mgp__row__info">
                <div class="mgp__row__meta">
                  <Badge :variant="proj.type === 'Personal' ? 'accent' : 'default'" size="sm">
                    {{ proj.type }}
                  </Badge>
                  <span class="mgp__row__cat">{{ proj.category }}</span>
                  <span class="mgp__row__sep">·</span>
                  <span class="mgp__row__year">{{ proj.year }}</span>
                  <Badge v-if="proj.isCustom" variant="success" size="sm">Kustom</Badge>
                </div>

                <h2 class="mgp__row__title">
                  <router-link :to="`/projects/${proj.slug}`" class="mgp__row__title-link">
                    {{ proj.title }}
                  </router-link>
                </h2>

                <p class="mgp__row__desc">{{ proj.shortDesc }}</p>

                <!-- Contributors -->
                <div class="mgp__row__contribs">
                  <div
                    v-for="c in proj.contributors"
                    :key="c.memberId"
                    class="mgp__row__contrib"
                  >
                    <img
                      :src="getMember(c.memberId).avatar"
                      :alt="getMember(c.memberId).name"
                      class="mgp__row__contrib__avatar"
                      loading="lazy"
                    />
                    <span>{{ getMember(c.memberId).name }}</span>
                    <span class="mgp__row__contrib__role">({{ c.role }})</span>
                  </div>
                </div>

                <!-- Tech -->
                <div class="mgp__row__tech">
                  <span v-for="t in (proj.tech || []).slice(0, 5)" :key="t" class="mgp__row__tech__tag">
                    {{ t }}
                  </span>
                  <span v-if="(proj.tech || []).length > 5" class="mgp__row__tech__tag">
                    +{{ proj.tech.length - 5 }}
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="mgp__row__actions">
                <router-link
                  :to="`/projects/${proj.slug}`"
                  class="mgp__row__btn mgp__row__btn--view"
                  title="Lihat halaman proyek"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <span>Lihat</span>
                </router-link>

                <!-- Edit Project -->
                <button
                  type="button"
                  class="mgp__row__btn mgp__row__btn--edit"
                  title="Edit proyek"
                  @click="openEditModal(proj)"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  class="mgp__row__btn mgp__row__btn--delete"
                  title="Hapus proyek"
                  @click="promptDelete(proj)"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div v-else class="mgp__empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <h3 class="mgp__empty__title">{{ totalCount === 0 ? 'Belum Ada Proyek Terdaftar' : 'Tidak ada proyek yang cocok' }}</h3>
            <p class="mgp__empty__desc">
              {{ totalCount === 0 ? 'Seluruh proyek telah dihapus. Daftarkan proyek baru Anda atau pulihkan data default jika diperlukan.' : 'Coba reset filter atau daftarkan proyek baru.' }}
            </p>
            <div class="mgp__empty__actions">
              <button v-if="totalCount > 0" type="button" class="mgp__header__showcase-btn" @click="resetFilters">Reset Filter</button>
              <button v-else type="button" class="mgp__header__showcase-btn" @click="handleResetDefaultProjects">Pulihkan Proyek Default</button>
              <button type="button" class="mgp__header__add-btn" @click="openAddModal">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                <span>Tambah Proyek Baru</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- ══════════════════════════════════════════════════════ -->
    <!-- ── TAB 2: KELOLA ANGGOTA TIM ──────────────────────── -->
    <!-- ══════════════════════════════════════════════════════ -->
    <template v-else>
      <!-- Filter Toolbar Anggota -->
      <div class="mgp__toolbar">
        <div class="container mgp__toolbar__inner">
          <!-- Search -->
          <div class="mgp__search">
            <svg class="mgp__search__icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              v-model="memberSearchQuery"
              type="search"
              class="mgp__search__input"
              placeholder="Cari nama anggota, NIM, role, atau keahlian..."
            />
            <button v-if="memberSearchQuery" class="mgp__search__clear" @click="memberSearchQuery = ''">✕</button>
          </div>

          <div class="mgp__selects">
            <button class="mgp__reset-btn" @click="handleResetDefaultMembers">
              Reset Anggota Default
            </button>
          </div>
        </div>
      </div>

      <!-- Members Content -->
      <section class="mgp__content">
        <div class="container">
          <!-- Result bar -->
          <div class="mgp__resultbar">
            <span class="mgp__resultbar__text">
              Menampilkan <strong>{{ displayedMembers.length }}</strong> dari <strong>{{ totalMembers }}</strong> anggota tim
            </span>
            <button
              v-if="memberSearchQuery"
              class="mgp__resultbar__reset"
              @click="memberSearchQuery = ''"
            >
              Reset Pencarian
            </button>
          </div>

          <!-- Members Grid -->
          <div v-if="displayedMembers.length > 0" class="mgp__members-grid">
            <div
              v-for="m in displayedMembers"
              :key="m.id"
              class="mgp__member-card"
            >
              <!-- Card Header: Avatar & Main Info -->
              <div class="mgp__member-card__header">
                <div class="mgp__member-card__avatar-wrap">
                  <img
                    :src="m.avatar"
                    :alt="m.name"
                    class="mgp__member-card__avatar"
                    loading="lazy"
                  />
                </div>
                <div class="mgp__member-card__title-box">
                  <div class="mgp__member-card__badges">
                    <span class="mgp__member-card__badge-role">{{ m.role }}</span>
                    <span v-if="m.nim" class="mgp__member-card__nim">NIM: {{ m.nim }}</span>
                  </div>
                  <h3 class="mgp__member-card__name">
                    <router-link :to="`/members/${m.id}`" class="mgp__member-card__name-link">
                      {{ m.name }}
                    </router-link>
                  </h3>
                </div>
              </div>

              <!-- Card Bio -->
              <p class="mgp__member-card__bio">{{ m.bio || 'Belum ada bio atau ringkasan profil.' }}</p>

              <!-- Skills tags -->
              <div v-if="m.skills && m.skills.length > 0" class="mgp__member-card__skills">
                <span
                  v-for="s in m.skills.slice(0, 6)"
                  :key="s"
                  class="mgp__member-card__skill"
                >
                  {{ s }}
                </span>
                <span v-if="m.skills.length > 6" class="mgp__member-card__skill mgp__member-card__skill--more">
                  +{{ m.skills.length - 6 }}
                </span>
              </div>

              <!-- Meta Footer: Project Count & Socials -->
              <div class="mgp__member-card__meta">
                <div class="mgp__member-card__proj-count">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                  <span>{{ getMemberProjectCount(m.id) }} Proyek Terkait</span>
                </div>
                <div class="mgp__member-card__socials">
                  <a v-if="m.github" :href="m.github" target="_blank" rel="noopener noreferrer" class="mgp__member-card__social" title="GitHub">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                  </a>
                  <a v-if="m.linkedin" :href="m.linkedin" target="_blank" rel="noopener noreferrer" class="mgp__member-card__social" title="LinkedIn">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46V10.9M7.84 6.64a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z"/></svg>
                  </a>
                  <a v-if="m.email" :href="`mailto:${m.email}`" class="mgp__member-card__social" title="Email">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </a>
                </div>
              </div>

              <!-- Card Actions -->
              <div class="mgp__member-card__actions">
                <router-link
                  :to="`/members/${m.id}`"
                  class="mgp__member-btn mgp__member-btn--profile"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <span>Profil</span>
                </router-link>

                <button
                  type="button"
                  class="mgp__member-btn mgp__member-btn--edit"
                  @click="openEditMemberModal(m)"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  class="mgp__member-btn mgp__member-btn--delete"
                  @click="promptDeleteMember(m)"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Empty state Anggota -->
          <div v-else class="mgp__empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
            </svg>
            <h3 class="mgp__empty__title">{{ totalMembers === 0 ? 'Belum Ada Anggota Terdaftar' : 'Tidak ada anggota yang cocok' }}</h3>
            <p class="mgp__empty__desc">
              {{ totalMembers === 0 ? 'Seluruh anggota telah dihapus. Daftarkan anggota tim baru Anda atau pulihkan data default jika diperlukan.' : 'Coba ubah kata kunci pencarian atau daftarkan anggota tim baru.' }}
            </p>
            <div class="mgp__empty__actions">
              <button v-if="totalMembers > 0" type="button" class="mgp__header__showcase-btn" @click="memberSearchQuery = ''">Reset Pencarian</button>
              <button v-else type="button" class="mgp__header__showcase-btn" @click="handleResetDefaultMembers">Pulihkan Anggota Default</button>
              <button type="button" class="mgp__header__add-member-btn" @click="openAddMemberModal">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <line x1="19" y1="8" x2="19" y2="14"/>
                  <line x1="22" y1="11" x2="16" y2="11"/>
                </svg>
                <span>Tambah Anggota Baru</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- ── Modals Proyek ── -->
    <AddProjectModal
      v-model="isAddModalOpen"
      :preselected-member-id="selectedMember !== 'All' ? selectedMember : null"
    />
    <AddProjectModal
      v-model="isEditModalOpen"
      :edit-project="projectToEdit"
    />

    <!-- ── Modals Anggota ── -->
    <MemberModal
      v-model="isAddMemberModalOpen"
    />
    <MemberModal
      v-model="isEditMemberModalOpen"
      :edit-member="memberToEdit"
    />

    <!-- ── Confirm Delete Proyek ── -->
    <Transition name="fade">
      <div v-if="isConfirmOpen" class="mgp__confirm-backdrop" @click.self="cancelDelete">
        <div class="mgp__confirm-box">
          <div class="mgp__confirm-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
          </div>

          <h3 class="mgp__confirm-title">Hapus Proyek?</h3>
          <p class="mgp__confirm-desc">
            Anda akan menghapus <strong>"{{ projectToDelete?.title }}"</strong> dari portofolio.
            Tindakan ini langsung tersimpan secara nyata di peramban.
          </p>

          <div class="mgp__confirm-actions">
            <button type="button" class="mgp__header__showcase-btn" @click="cancelDelete">Batal</button>
            <button type="button" class="mgp__confirm-delete-btn" @click="confirmDelete">
              Ya, Hapus Sekarang
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── Confirm Delete Anggota ── -->
    <Transition name="fade">
      <div v-if="isMemberConfirmOpen" class="mgp__confirm-backdrop" @click.self="cancelDeleteMember">
        <div class="mgp__confirm-box">
          <div class="mgp__confirm-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="18" y1="8" x2="23" y2="13"/>
              <line x1="23" y1="8" x2="18" y2="13"/>
            </svg>
          </div>

          <h3 class="mgp__confirm-title">Hapus Anggota Tim?</h3>
          <p class="mgp__confirm-desc">
            Anda akan menghapus profil anggota <strong>"{{ memberToDelete?.name }}"</strong>.
            Data anggota akan terhapus dari peramban dan tidak lagi tampil di showcase tim.
          </p>

          <div class="mgp__confirm-actions">
            <button type="button" class="mgp__header__showcase-btn" @click="cancelDeleteMember">Batal</button>
            <button type="button" class="mgp__confirm-delete-btn" @click="confirmDeleteMember">
              Ya, Hapus Anggota
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </main>
</template>

<style scoped>
.mgp {
  min-height: 100vh;
  padding-bottom: var(--space-24);
}

.mgp__breadcrumbs {
  padding-top: calc(64px + var(--space-6));
  padding-bottom: var(--space-4);
}

/* ── Header ── */
.mgp__header {
  padding: var(--space-6) 0 var(--space-10);
  border-bottom: 1px solid var(--color-border-subtle);
}

.mgp__header__inner {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-8);
  flex-wrap: wrap;
  margin-bottom: var(--space-8);
}

.mgp__eyebrow {
  display: flex; align-items: center; gap: var(--space-3);
  font-size: var(--text-xs); color: var(--color-text-muted);
  letter-spacing: 0.08em; text-transform: uppercase;
  margin-bottom: var(--space-3);
}
.mgp__eyebrow__line {
  display: block; width: 24px; height: 1px; background: var(--color-highlight);
}

.mgp__title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 800; line-height: 1.1;
  color: var(--color-text); margin-bottom: var(--space-3);
  letter-spacing: -0.02em;
}

.mgp__desc {
  font-size: var(--text-base); color: var(--color-text-secondary);
  line-height: 1.6; max-width: 620px; margin: 0;
}

.mgp__header__actions {
  display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap;
}

.mgp__header__add-btn {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  background: var(--color-text); color: var(--color-bg);
  border: 1px solid var(--color-text); border-radius: var(--radius-sm);
  font-size: var(--text-sm); font-weight: 700; cursor: pointer;
  transition: opacity var(--transition-fast);
}
.mgp__header__add-btn:hover { opacity: 0.85; }

.mgp__header__add-member-btn {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  background: var(--color-bg-elevated); color: var(--color-text);
  border: 1px solid var(--color-border); border-radius: var(--radius-sm);
  font-size: var(--text-sm); font-weight: 700; cursor: pointer;
  transition: all var(--transition-fast);
}
.mgp__header__add-member-btn:hover {
  background: var(--color-bg-alt);
  border-color: var(--color-text);
}

.mgp__header__showcase-btn {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  background: var(--color-bg-elevated); color: var(--color-text);
  border: 1px solid var(--color-border); border-radius: var(--radius-sm);
  font-size: var(--text-sm); font-weight: 600; text-decoration: none;
  cursor: pointer; transition: all var(--transition-fast);
}
.mgp__header__showcase-btn:hover { background: var(--color-bg-alt); border-color: var(--color-text); }

/* ── Tabs Navigation ── */
.mgp__tabs {
  display: flex; gap: var(--space-3);
  margin-bottom: var(--space-6);
  border-bottom: 2px solid var(--color-border-subtle);
  padding-bottom: 2px;
}
.mgp__tab {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  background: none; border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -4px;
  font-family: inherit; font-size: var(--text-sm); font-weight: 600;
  color: var(--color-text-secondary); cursor: pointer;
  transition: all var(--transition-fast);
}
.mgp__tab:hover { color: var(--color-text); }
.mgp__tab--active {
  color: var(--color-text);
  border-bottom-color: var(--color-highlight);
  font-weight: 700;
}
.mgp__tab__badge {
  font-size: 11px; font-weight: 700;
  padding: 1px 7px; border-radius: var(--radius-full);
  background: var(--color-bg-alt); border: 1px solid var(--color-border);
  color: var(--color-text-muted);
}
.mgp__tab--active .mgp__tab__badge {
  background: var(--color-highlight-subtle);
  border-color: color-mix(in srgb, var(--color-highlight) 30%, transparent);
  color: var(--color-highlight);
}

/* Stats */
.mgp__stats {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: var(--space-4);
}
.mgp__stat {
  padding: var(--space-4); background: var(--color-bg-alt);
  border: 1px solid var(--color-border-subtle); border-radius: var(--radius-md);
  display: flex; flex-direction: column; gap: var(--space-1);
}
.mgp__stat--accent {
  border-color: color-mix(in srgb, var(--color-highlight) 30%, transparent);
  background: color-mix(in srgb, var(--color-highlight) 6%, transparent);
}
.mgp__stat__val {
  font-family: var(--font-display); font-size: var(--text-2xl);
  font-weight: 800; color: var(--color-text); line-height: 1;
}
.mgp__stat__lbl {
  font-size: var(--text-xs); color: var(--color-text-muted); text-transform: uppercase;
  letter-spacing: 0.05em; font-weight: 500;
}

/* ── Toolbar ── */
.mgp__toolbar {
  padding: var(--space-4) 0; background: var(--color-bg-elevated);
  border-bottom: 1px solid var(--color-border-subtle);
  position: sticky; top: 64px; z-index: var(--z-sticky, 20);
}
.mgp__toolbar__inner {
  display: flex; gap: var(--space-3); align-items: center;
  justify-content: space-between; flex-wrap: wrap;
}
.mgp__search {
  position: relative; flex: 1; min-width: 260px; max-width: 480px;
}
.mgp__search__icon {
  position: absolute; left: var(--space-3); top: 50%;
  transform: translateY(-50%); color: var(--color-text-muted); pointer-events: none;
}
.mgp__search__input {
  width: 100%; padding: var(--space-2) var(--space-8) var(--space-2) var(--space-8);
  border: 1px solid var(--color-border); border-radius: var(--radius-sm);
  background: var(--color-bg); color: var(--color-text); font-size: var(--text-sm);
  font-family: inherit; transition: border-color var(--transition-fast);
}
.mgp__search__input:focus { outline: none; border-color: var(--color-highlight); }
.mgp__search__clear {
  position: absolute; right: var(--space-3); top: 50%; transform: translateY(-50%);
  background: none; border: none; color: var(--color-text-muted); cursor: pointer;
  font-size: 12px; padding: 2px 4px;
}
.mgp__selects { display: flex; gap: var(--space-2); align-items: center; }
.mgp__select {
  padding: var(--space-2) var(--space-3); border: 1px solid var(--color-border);
  border-radius: var(--radius-sm); background: var(--color-bg);
  color: var(--color-text); font-size: var(--text-xs); font-family: inherit;
  cursor: pointer;
}
.mgp__reset-btn {
  padding: var(--space-2) var(--space-3); background: none; border: 1px dashed var(--color-border);
  border-radius: var(--radius-sm); color: var(--color-text-muted);
  font-size: var(--text-xs); cursor: pointer; transition: all var(--transition-fast);
  white-space: nowrap;
}
.mgp__reset-btn:hover { color: #ef4444; border-color: #ef4444; }

/* ── Content ── */
.mgp__content { padding: var(--space-8) 0; }
.mgp__resultbar {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: var(--space-6); font-size: var(--text-xs); color: var(--color-text-muted);
}
.mgp__resultbar strong { color: var(--color-text); }
.mgp__resultbar__reset {
  background: none; border: none; color: var(--color-highlight);
  font-size: var(--text-xs); cursor: pointer; text-decoration: underline;
}

/* ── Project List Rows ── */
.mgp__list { display: flex; flex-direction: column; gap: var(--space-4); }
.mgp__row {
  display: grid;
  grid-template-columns: 160px 1fr auto;
  gap: var(--space-5);
  align-items: center;
  padding: var(--space-5);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}
.mgp__row:hover {
  border-color: var(--color-border);
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}
.mgp__row__thumb-wrap {
  width: 160px; height: 100px; border-radius: var(--radius-sm);
  overflow: hidden; background: var(--color-bg-alt); flex-shrink: 0;
}
.mgp__row__thumb { width: 100%; height: 100%; object-fit: cover; }
.mgp__row__info { display: flex; flex-direction: column; gap: var(--space-2); min-width: 0; }
.mgp__row__meta { display: flex; align-items: center; gap: var(--space-2); flex-wrap: wrap; }
.mgp__row__cat { font-size: var(--text-xs); color: var(--color-text-muted); font-weight: 500; }
.mgp__row__sep { color: var(--color-border); }
.mgp__row__year { font-size: var(--text-xs); color: var(--color-text-muted); }
.mgp__row__title { font-size: var(--text-base); font-weight: 700; margin: 0; line-height: 1.3; }
.mgp__row__title-link { color: var(--color-text); text-decoration: none; }
.mgp__row__title-link:hover { color: var(--color-highlight); }
.mgp__row__desc {
  font-size: var(--text-xs); color: var(--color-text-secondary); line-height: 1.5; margin: 0;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.mgp__row__contribs {
  display: flex; align-items: center; gap: var(--space-2); flex-wrap: wrap;
}
.mgp__row__contrib {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 2px 8px; border-radius: var(--radius-sm);
  background: var(--color-bg); border: 1px solid var(--color-border);
  font-size: 11px; color: var(--color-text-secondary);
}
.mgp__row__contrib__avatar {
  width: 16px; height: 16px; border-radius: 50%; object-fit: cover;
}
.mgp__row__contrib__role { color: var(--color-text-muted); }
.mgp__row__tech { display: flex; gap: var(--space-1); flex-wrap: wrap; }
.mgp__row__tech__tag {
  font-size: 10px; padding: 1px 7px;
  background: var(--color-bg); border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-sm); color: var(--color-text-muted);
}
.mgp__row__actions {
  display: flex; flex-direction: column; gap: var(--space-2);
  align-items: stretch; min-width: 100px;
}
.mgp__row__btn {
  display: inline-flex; align-items: center; justify-content: center;
  gap: var(--space-1); padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm); font-size: var(--text-xs); font-weight: 600;
  cursor: pointer; transition: all var(--transition-fast); text-decoration: none; border: none;
}
.mgp__row__btn--view {
  background: var(--color-bg-alt); color: var(--color-text);
  border: 1px solid var(--color-border);
}
.mgp__row__btn--view:hover { background: var(--color-bg); border-color: var(--color-text-secondary); }
.mgp__row__btn--edit {
  background: var(--color-bg-alt);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
.mgp__row__btn--edit:hover {
  background: var(--color-bg);
  border-color: var(--color-text-secondary);
}
.mgp__row__btn--delete {
  background: var(--color-bg-alt);
  color: var(--color-text-muted);
  border: 1px solid var(--color-border-subtle);
}
.mgp__row__btn--delete:hover {
  background: color-mix(in srgb, #ef4444 10%, transparent);
  color: #ef4444;
  border-color: color-mix(in srgb, #ef4444 30%, transparent);
}

/* ── Members Grid ── */
.mgp__members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: var(--space-6);
}
.mgp__member-card {
  display: flex; flex-direction: column;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  transition: all var(--transition-fast);
}
.mgp__member-card:hover {
  border-color: var(--color-border);
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
}
.mgp__member-card__header {
  display: flex; align-items: center; gap: var(--space-4);
  margin-bottom: var(--space-4);
}
.mgp__member-card__avatar-wrap {
  width: 56px; height: 56px; border-radius: 50%;
  overflow: hidden; flex-shrink: 0;
  border: 2px solid var(--color-border);
  background: var(--color-bg-alt);
}
.mgp__member-card__avatar { width: 100%; height: 100%; object-fit: cover; }
.mgp__member-card__title-box { flex: 1; min-width: 0; }
.mgp__member-card__badges {
  display: flex; align-items: center; gap: var(--space-2); flex-wrap: wrap; margin-bottom: 4px;
}
.mgp__member-card__badge-role {
  font-size: 11px; font-weight: 700;
  color: var(--color-highlight);
  background: color-mix(in srgb, var(--color-highlight) 10%, transparent);
  padding: 1px 7px; border-radius: var(--radius-sm);
}
.mgp__member-card__nim {
  font-size: 11px; color: var(--color-text-muted); font-family: monospace;
}
.mgp__member-card__name {
  font-size: var(--text-base); font-weight: 700; margin: 0; line-height: 1.2;
}
.mgp__member-card__name-link {
  color: var(--color-text); text-decoration: none;
}
.mgp__member-card__name-link:hover { color: var(--color-highlight); }
.mgp__member-card__bio {
  font-size: var(--text-xs); color: var(--color-text-secondary);
  line-height: 1.6; margin: 0 0 var(--space-4);
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.mgp__member-card__skills {
  display: flex; flex-wrap: wrap; gap: var(--space-1); margin-bottom: var(--space-4);
}
.mgp__member-card__skill {
  font-size: 10px; padding: 2px 7px;
  background: var(--color-bg); border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-sm); color: var(--color-text-muted);
}
.mgp__member-card__skill--more {
  background: var(--color-bg-alt); color: var(--color-text-secondary);
}
.mgp__member-card__meta {
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--space-3) 0;
  border-top: 1px solid var(--color-border-subtle);
  margin-top: auto;
}
.mgp__member-card__proj-count {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 11px; color: var(--color-text-muted); font-weight: 500;
}
.mgp__member-card__socials {
  display: flex; align-items: center; gap: var(--space-2);
}
.mgp__member-card__social {
  color: var(--color-text-muted); transition: color var(--transition-fast);
  display: inline-flex; align-items: center;
}
.mgp__member-card__social:hover { color: var(--color-text); }
.mgp__member-card__actions {
  display: flex; gap: var(--space-2); margin-top: var(--space-3);
}
.mgp__member-btn {
  flex: 1; display: inline-flex; align-items: center; justify-content: center;
  gap: var(--space-1); padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm); font-size: var(--text-xs); font-weight: 600;
  cursor: pointer; text-decoration: none; border: none; transition: all var(--transition-fast);
}
.mgp__member-btn--profile {
  background: var(--color-bg-alt); color: var(--color-text);
  border: 1px solid var(--color-border);
}
.mgp__member-btn--profile:hover { background: var(--color-bg); }
.mgp__member-btn--edit {
  background: var(--color-bg-alt);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
.mgp__member-btn--edit:hover {
  background: var(--color-bg);
  border-color: var(--color-text-secondary);
}
.mgp__member-btn--delete {
  background: var(--color-bg-alt);
  color: var(--color-text-muted);
  border: 1px solid var(--color-border-subtle);
}
.mgp__member-btn--delete:hover {
  background: color-mix(in srgb, #ef4444 10%, transparent);
  color: #ef4444;
  border-color: color-mix(in srgb, #ef4444 30%, transparent);
}

/* Empty state */
.mgp__empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: var(--space-16) var(--space-8); text-align: center;
  border: 1px dashed var(--color-border); border-radius: var(--radius-lg);
  color: var(--color-text-muted);
}
.mgp__empty__title { font-size: var(--text-lg); font-weight: 700; color: var(--color-text); margin: var(--space-3) 0 var(--space-2); }
.mgp__empty__desc { font-size: var(--text-sm); margin-bottom: var(--space-5); }
.mgp__empty__actions { display: flex; gap: var(--space-3); flex-wrap: wrap; justify-content: center; }

/* ── Confirm Modal ── */
.mgp__confirm-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.6); backdrop-filter: blur(6px);
  z-index: 9999;
  display: flex; align-items: center; justify-content: center; padding: var(--space-4);
}
.mgp__confirm-box {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  max-width: 420px; width: 100%;
  text-align: center; display: flex; flex-direction: column; align-items: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}
.mgp__confirm-icon {
  width: 56px; height: 56px; border-radius: 50%;
  background: color-mix(in srgb, #ef4444 12%, transparent);
  color: #ef4444;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: var(--space-4);
}
.mgp__confirm-title {
  font-family: var(--font-display); font-size: var(--text-xl); font-weight: 800;
  color: var(--color-text); margin-bottom: var(--space-2);
}
.mgp__confirm-desc {
  font-size: var(--text-sm); color: var(--color-text-secondary);
  line-height: 1.6; margin-bottom: var(--space-6);
}
.mgp__confirm-actions {
  display: flex; gap: var(--space-3); width: 100%;
}
.mgp__confirm-actions > * { flex: 1; }
.mgp__confirm-delete-btn {
  flex: 1; padding: var(--space-2) var(--space-4);
  background: #ef4444; color: white; border: none;
  border-radius: var(--radius-sm); font-weight: 700; font-size: var(--text-sm);
  cursor: pointer; transition: background var(--transition-fast);
}
.mgp__confirm-delete-btn:hover { background: #dc2626; }

/* Fade transition */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 860px) {
  .mgp__row { grid-template-columns: 1fr; gap: var(--space-3); }
  .mgp__row__thumb-wrap { width: 100%; height: 160px; }
  .mgp__row__actions { flex-direction: row; }
}
@media (max-width: 600px) {
  .mgp__toolbar__inner { flex-direction: column; align-items: stretch; }
  .mgp__selects { flex-wrap: wrap; }
}
</style>
