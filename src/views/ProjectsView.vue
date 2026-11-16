<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProjects } from '@/composables/useProjects'
import ProjectCard from '@/components/portfolio/ProjectCard.vue'
import AddProjectModal from '@/components/portfolio/AddProjectModal.vue'
import Button from '@/components/common/Button.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const {
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
  resetFilters,
  resetToDefault,
} = useProjects()

const isAddModalOpen = ref(false)

onMounted(() => {
  if (route.query.member) {
    selectedMember.value = Number(route.query.member)
  }
  if (route.query.category) {
    selectedCategory.value = route.query.category
  }
  if (route.query.tech) {
    selectedTech.value = route.query.tech
  }
  if (route.query.new === 'true') {
    isAddModalOpen.value = true
  }
})

function goToProject(project) {
  router.push(`/projects/${project.slug}`)
}

function handleMemberSelect(memberId) {
  selectedMember.value = memberId
}

function handleResetDefault() {
  if (confirm('Kembalikan seluruh daftar proyek ke pengaturan awal? Proyek tambahan yang belum di-backup akan dihapus.')) {
    resetToDefault()
    toast.info('Data proyek telah dikembalikan ke pengaturan awal.')
  }
}
</script>

<template>
  <main class="projects">
    <!-- ── Page Header ── -->
    <section class="projects-hero">
      <div class="container">
        <div class="projects-hero__inner">
          <div class="projects-hero__label">
            <span class="projects-hero__label-line" />
            <span>Multi-Member Portfolio Showcase</span>
          </div>
          <h1 class="projects-hero__title">All Works,<br>Every Contributor.</h1>
          <p class="projects-hero__desc">
            Kumpulan seluruh karya digital yang dikembangkan oleh anggota <strong>Kelompok 3</strong> &mdash; mencakup proyek kolaborasi tim maupun portofolio mandiri (personal projects) masing-masing developer dan desainer.
          </p>
        </div>
      </div>
    </section>

    <!-- ── Filter & Search Controls ── -->
    <div class="projects-controls">
      <div class="container">
        <!-- 1. Member Filter Strip -->
        <div class="projects-controls__member-strip">
          <span class="projects-controls__strip-label">Filter Anggota:</span>
          <div class="projects-controls__member-chips" role="tablist" aria-label="Filter berdasarkan anggota">
            <button
              v-for="m in availableMembers"
              :key="m.id"
              class="projects-controls__member-chip"
              :class="{ 'projects-controls__member-chip--active': String(selectedMember) === String(m.id) }"
              role="tab"
              :aria-selected="String(selectedMember) === String(m.id)"
              @click="handleMemberSelect(m.id)"
            >
              <span>{{ m.name }}</span>
            </button>
          </div>
        </div>

        <!-- 2. Category, Tech & Search Row -->
        <div class="projects-controls__bar">
          <!-- Categories -->
          <div class="projects-controls__categories" role="tablist" aria-label="Project categories">
            <button
              v-for="cat in projectCategories"
              :key="cat"
              class="projects-controls__cat-btn"
              :class="{ 'projects-controls__cat-btn--active': selectedCategory === cat }"
              role="tab"
              :aria-selected="selectedCategory === cat"
              @click="selectedCategory = cat"
            >
              {{ cat }}
            </button>
          </div>

          <!-- Secondary Filters (Tech, Sort, Search) -->
          <div class="projects-controls__right">
            <!-- Tech Filter Dropdown -->
            <div class="projects-controls__select-wrap">
              <label for="tech-filter" class="sr-only">Filter Teknologi</label>
              <select
                id="tech-filter"
                v-model="selectedTech"
                class="projects-controls__select"
              >
                <option value="All">Semua Teknologi</option>
                <option v-for="t in availableTechs.slice(1)" :key="t" :value="t">
                  {{ t }}
                </option>
              </select>
            </div>

            <!-- Sort Dropdown -->
            <div class="projects-controls__select-wrap">
              <label for="sort-filter" class="sr-only">Urutkan</label>
              <select
                id="sort-filter"
                v-model="sortOrder"
                class="projects-controls__select"
              >
                <option value="newest">Tahun: Terbaru</option>
                <option value="oldest">Tahun: Terlama</option>
                <option value="alpha">Nama: A &rarr; Z</option>
              </select>
            </div>

            <!-- Search Input -->
            <div class="projects-controls__search" role="search">
              <svg class="projects-controls__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                v-model="searchQuery"
                type="search"
                class="projects-controls__search-input"
                placeholder="Cari proyek, teknologi, nama anggota…"
                aria-label="Cari proyek"
              />
              <button
                v-if="searchQuery"
                class="projects-controls__clear"
                aria-label="Hapus pencarian"
                @click="searchQuery = ''"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- 3. Summary & Reset Bar -->
        <div class="projects-controls__summary">
          <span>
            Menampilkan <strong>{{ totalCount }}</strong> proyek
            <span v-if="selectedMember !== 'All'">
              oleh <strong>{{ availableMembers.find(m => String(m.id) === String(selectedMember))?.name }}</strong>
            </span>
            <span v-if="selectedCategory !== 'All'">
              dalam kategori <strong>{{ selectedCategory }}</strong>
            </span>
            <span v-if="selectedTech !== 'All'">
              menggunakan <strong>{{ selectedTech }}</strong>
            </span>
            <span v-if="searchQuery">
              kata kunci &ldquo;<strong>{{ searchQuery }}</strong>&rdquo;
            </span>
          </span>

          <div class="projects-controls__summary-actions">
            <button
              v-if="searchQuery || selectedCategory !== 'All' || selectedMember !== 'All' || selectedTech !== 'All'"
              class="projects-controls__reset"
              @click="resetFilters"
            >
              Reset Filter
            </button>
            <span class="projects-controls__sep">&middot;</span>
            <button
              class="projects-controls__reset projects-controls__reset--dim"
              title="Kembalikan ke daftar proyek awal"
              @click="handleResetDefault"
            >
              Reset ke Default
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Project Grid ── -->
    <section class="projects-grid-section">
      <div class="container">
        <Transition name="fade" mode="out-in">
          <!-- Has results -->
          <div
            v-if="hasResults"
            class="projects-grid"
            :key="`${selectedCategory}-${selectedMember}-${selectedTech}-${searchQuery}-${sortOrder}-${totalCount}`"
          >
            <ProjectCard
              v-for="(project, i) in filteredProjects"
              :key="project.id"
              :project="project"
              :index="i"
              @click="goToProject(project)"
            />
          </div>

          <!-- Empty state -->
          <EmptyState
            v-else
            title="Tidak ada proyek yang sesuai"
            :description="searchQuery
              ? `Tidak ada proyek yang cocok dengan kata kunci '${searchQuery}' pada filter aktif.`
              : 'Belum ada proyek yang cocok dengan kombinasi filter anggota, kategori, dan teknologi yang Anda pilih.'"
            icon="search"
          >
            <template #action>
              <div class="empty-actions">
                <Button variant="outline" size="sm" @click="resetFilters">
                  Reset Semua Filter
                </Button>
                <Button variant="primary" size="sm" @click="isAddModalOpen = true">
                  + Daftarkan Proyek Ini
                </Button>
              </div>
            </template>
          </EmptyState>
        </Transition>
      </div>
    </section>

    <!-- Modal Tambah Proyek (hanya untuk ?new=true atau empty state) -->
    <AddProjectModal
      v-model="isAddModalOpen"
      :preselected-member-id="selectedMember !== 'All' ? selectedMember : null"
    />
  </main>
</template>

<style scoped>
/* ── Hero ── */
.projects-hero {
  padding: calc(64px + var(--space-16)) 0 var(--space-12);
  border-bottom: 1px solid var(--color-border-subtle);
}
.projects-hero__inner {
  max-width: 720px;
}
.projects-hero__label {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: var(--space-6);
}
.projects-hero__label-line {
  display: block;
  width: 32px;
  height: 1px;
  background: var(--color-text-muted);
}
.projects-hero__title {
  font-family: var(--font-display);
  font-size: clamp(2.25rem, 5vw, 4rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
  margin-bottom: var(--space-5);
}
.projects-hero__desc {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: 1.65;
  max-width: 580px;
}

/* ── Controls ── */
.projects-controls {
  background: var(--color-bg);
  position: sticky;
  top: 64px;
  z-index: var(--z-dropdown);
  border-bottom: 1px solid var(--color-border-subtle);
  padding: var(--space-4) 0 var(--space-3);
  backdrop-filter: blur(12px);
}

/* Member Filter Strip */
.projects-controls__member-strip {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-border-subtle);
  overflow-x: auto;
  scrollbar-width: none;
}
.projects-controls__member-strip::-webkit-scrollbar { display: none; }

.projects-controls__strip-label {
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  white-space: nowrap;
}

.projects-controls__member-chips {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.projects-controls__member-chip {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-text-secondary);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  padding: 6px var(--space-3);
  border-radius: var(--radius-full);
  white-space: nowrap;
  transition: all var(--transition-fast);
  cursor: pointer;
}
.projects-controls__member-chip:hover {
  color: var(--color-text);
  border-color: var(--color-text);
}
.projects-controls__member-chip--active {
  background: var(--color-text);
  color: var(--color-bg);
  border-color: var(--color-text);
  font-weight: 600;
}

/* Category & Right Controls Bar */
.projects-controls__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.projects-controls__categories {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}
.projects-controls__cat-btn {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-text-muted);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  transition: all var(--transition-fast);
}
.projects-controls__cat-btn:hover {
  color: var(--color-text);
  background: var(--color-bg-alt);
}
.projects-controls__cat-btn--active {
  color: var(--color-text);
  background: var(--color-bg-elevated);
  border-color: var(--color-border);
  font-weight: 600;
}

.projects-controls__right {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

/* Selects */
.projects-controls__select-wrap {
  position: relative;
}
.projects-controls__select {
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  color: var(--color-text);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0 var(--space-3);
  height: 36px;
  cursor: pointer;
  outline: none;
  transition: border-color var(--transition-fast);
}
.projects-controls__select:focus {
  border-color: var(--color-text);
}

/* Search */
.projects-controls__search {
  position: relative;
  display: flex;
  align-items: center;
}
.projects-controls__search-icon {
  position: absolute;
  left: var(--space-3);
  color: var(--color-text-muted);
  pointer-events: none;
}
.projects-controls__search-input {
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  color: var(--color-text);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-8) var(--space-2) var(--space-8);
  height: 36px;
  width: 200px;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  outline: none;
}
.projects-controls__search-input::placeholder { color: var(--color-text-muted); }
.projects-controls__search-input:focus {
  border-color: var(--color-text);
  box-shadow: 0 0 0 3px var(--color-highlight-subtle);
}
.projects-controls__clear {
  position: absolute;
  right: var(--space-2);
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  transition: color var(--transition-fast);
}
.projects-controls__clear:hover { color: var(--color-text); }

/* Summary */
.projects-controls__summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--space-3);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  flex-wrap: wrap;
  gap: var(--space-2);
}
.projects-controls__summary-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.projects-controls__reset {
  font-size: var(--text-xs);
  color: var(--color-highlight);
  font-weight: 600;
  text-decoration: underline;
  transition: opacity var(--transition-fast);
  cursor: pointer;
}
.projects-controls__reset--dim {
  color: var(--color-text-muted);
}
.projects-controls__sep {
  color: var(--color-text-muted);
}
.projects-controls__reset:hover { opacity: 0.75; }

/* ── Grid ── */
.projects-grid-section { padding: var(--space-10) 0 var(--space-24); }
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-8);
}

.empty-actions {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
  justify-content: center;
}

@media (max-width: 900px) {
  .projects-controls__bar { flex-direction: column; align-items: stretch; }
  .projects-controls__right { width: 100%; }
  .projects-controls__search { flex: 1; }
  .projects-controls__search-input { width: 100%; }
}
</style>
