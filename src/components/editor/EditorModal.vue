<script setup>
// Floating window for editing team, members, and projects. Saves straight to MockAPI.
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import '@/assets/editor.css'
import { createProject, deleteProject, getProjects, getTeam, updateProject, updateTeam } from '@/services/api'
import { useAsync } from '@/composables/useAsync'
import TeamForm from './TeamForm.vue'
import MembersForm from './MembersForm.vue'
import ProjectForm from './ProjectForm.vue'

const emit = defineEmits(['close'])

const tabs = [
  { id: 'team', label: 'Tim' },
  { id: 'members', label: 'Anggota' },
  { id: 'projects', label: 'Proyek' },
]
const tab = ref('team')

const clone = (value) => JSON.parse(JSON.stringify(value))
const status = ref({ type: '', text: '' })
const saving = ref(false)

function flash(type, text) {
  status.value = { type, text }
}

// ---------- Team + members ----------
const teamLoading = ref(true)
const teamError = ref(null)
const teamDraft = ref(null)
const teamOriginal = ref('')

async function loadTeam() {
  teamLoading.value = true
  teamError.value = null
  try {
    const team = await getTeam()
    teamDraft.value = clone(team)
    teamOriginal.value = JSON.stringify(team)
  } catch (err) {
    teamError.value = err.message
  } finally {
    teamLoading.value = false
  }
}

const teamDirty = computed(() => teamDraft.value !== null && JSON.stringify(teamDraft.value) !== teamOriginal.value)
const memberNames = computed(() => (teamDraft.value?.members || []).map((m) => m.name).filter(Boolean))

function validateTeam(team) {
  if (!team.name?.trim()) return 'Nama tim wajib diisi.'
  const names = (team.members || []).map((m) => m.name?.trim())
  if (names.some((n) => !n)) return 'Setiap anggota wajib punya nama.'
  if (new Set(names).size !== names.length) return 'Nama anggota tidak boleh sama (dipakai di kontribusi proyek).'
  return null
}

async function saveTeam() {
  const problem = validateTeam(teamDraft.value)
  if (problem) return flash('error', problem)
  saving.value = true
  try {
    const saved = await updateTeam(teamDraft.value)
    teamDraft.value = clone(saved)
    teamOriginal.value = JSON.stringify(saved)
    flash('ok', 'Data tim tersimpan.')
  } catch (err) {
    flash('error', err.message)
  } finally {
    saving.value = false
  }
}

// ---------- Projects ----------
const projects = useAsync(getProjects)
const selectedId = ref(null) // project id, 'new', or null
const projectDraft = ref(null)
const projectOriginal = ref('')

const projectDirty = computed(() => projectDraft.value !== null && JSON.stringify(projectDraft.value) !== projectOriginal.value)

function blankProject() {
  return {
    title: '',
    summary: '',
    category: '',
    year: String(new Date().getFullYear()),
    featured: false,
    technologies: [],
    background: '',
    goals: [],
    features: [],
    gallery: [],
    contributions: [],
  }
}

function openProject(id) {
  if (id === selectedId.value) return
  if (projectDirty.value && !window.confirm('Perubahan proyek belum disimpan. Buang perubahan?')) return
  selectedId.value = id
  const source = id === 'new' ? blankProject() : (projects.data.value || []).find((p) => p.id === id)
  projectDraft.value = source ? clone(source) : null
  projectOriginal.value = id === 'new' ? '' : JSON.stringify(source)
  status.value = { type: '', text: '' }
}

// Select the first project once the list loads.
watch(
  () => projects.data.value,
  (list) => {
    if (selectedId.value === null && list?.length) openProject(list[0].id)
  },
)

async function saveProject() {
  if (!projectDraft.value.title?.trim()) return flash('error', 'Judul proyek wajib diisi.')
  saving.value = true
  try {
    const isNew = selectedId.value === 'new'
    const saved = isNew ? await createProject(projectDraft.value) : await updateProject(projectDraft.value)
    selectedId.value = saved.id
    projectDraft.value = clone(saved)
    projectOriginal.value = JSON.stringify(saved)
    flash('ok', isNew ? 'Proyek baru ditambahkan.' : 'Proyek tersimpan.')
  } catch (err) {
    flash('error', err.message)
  } finally {
    saving.value = false
  }
}

async function removeProject() {
  if (selectedId.value === 'new') {
    projectDraft.value = null
    projectOriginal.value = ''
    selectedId.value = null
    const first = projects.data.value?.[0]
    if (first) openProject(first.id)
    return
  }
  const title = projectDraft.value?.title
  if (!window.confirm(`Hapus proyek "${title}" dari MockAPI? Tindakan ini tidak bisa dibatalkan.`)) return
  saving.value = true
  try {
    await deleteProject(selectedId.value)
    const remaining = (projects.data.value || []).filter((p) => p.id !== selectedId.value)
    projectDraft.value = null
    projectOriginal.value = ''
    selectedId.value = null
    if (remaining[0]) openProject(remaining[0].id)
    flash('ok', `Proyek "${title}" dihapus.`)
  } catch (err) {
    flash('error', err.message)
  } finally {
    saving.value = false
  }
}

// ---------- Window behaviour ----------
const dialog = ref(null)

function close() {
  if ((teamDirty.value || projectDirty.value) && !window.confirm('Ada perubahan yang belum disimpan. Tutup tanpa menyimpan?')) return
  emit('close')
}

function onKey(event) {
  if (event.key === 'Escape') close()
}

watch(tab, () => (status.value = { type: '', text: '' }))

onMounted(async () => {
  document.body.style.overflow = 'hidden'
  document.addEventListener('keydown', onKey)
  loadTeam()
  await nextTick()
  dialog.value?.focus()
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <Teleport to="body">
    <div class="overlay" @mousedown.self="close">
      <div ref="dialog" class="modal" role="dialog" aria-modal="true" aria-labelledby="editor-title" tabindex="-1">
        <header class="modal__head">
          <div>
            <span class="eyebrow">Panel Data</span>
            <h2 id="editor-title" class="modal__title">Edit Data Portofolio</h2>
          </div>
          <button type="button" class="modal__close" aria-label="Tutup" @click="close">&times;</button>
        </header>

        <nav class="modal__tabs" role="tablist">
          <button
            v-for="t in tabs"
            :key="t.id"
            type="button"
            role="tab"
            class="modal__tab"
            :class="{ 'is-active': tab === t.id }"
            :aria-selected="tab === t.id"
            @click="tab = t.id"
          >
            {{ t.label }}
            <span v-if="(t.id !== 'projects' && teamDirty) || (t.id === 'projects' && projectDirty)" class="dot" aria-label="belum disimpan" />
          </button>
        </nav>

        <div class="modal__body">
          <!-- Team + members -->
          <template v-if="tab === 'team' || tab === 'members'">
            <p v-if="teamLoading" class="ed-empty">Memuat data tim...</p>
            <div v-else-if="teamError" class="ed-empty">
              <p>{{ teamError }}</p>
              <button type="button" class="ed-btn" @click="loadTeam">Coba Lagi</button>
            </div>
            <TeamForm v-else-if="tab === 'team'" :team="teamDraft" />
            <MembersForm v-else :team="teamDraft" />
          </template>

          <!-- Projects -->
          <template v-else>
            <p v-if="projects.loading.value" class="ed-empty">Memuat proyek...</p>
            <div v-else-if="projects.error.value" class="ed-empty">
              <p>{{ projects.error.value }}</p>
              <button type="button" class="ed-btn" @click="projects.reload">Coba Lagi</button>
            </div>
            <div v-else class="ed-split">
              <div>
                <div class="ed-list" role="listbox" aria-label="Daftar proyek">
                  <button
                    v-for="p in projects.data.value"
                    :key="p.id"
                    type="button"
                    class="ed-list__item"
                    :class="{ 'is-active': p.id === selectedId }"
                    role="option"
                    :aria-selected="p.id === selectedId"
                    @click="openProject(p.id)"
                  >
                    {{ p.title || '(tanpa judul)' }}
                  </button>
                  <button
                    v-if="selectedId === 'new'"
                    type="button"
                    class="ed-list__item is-active"
                    role="option"
                    aria-selected="true"
                  >
                    {{ projectDraft?.title || 'Proyek Baru' }}
                  </button>
                </div>
                <button type="button" class="ed-btn ed-list__add" :disabled="selectedId === 'new'" @click="openProject('new')">+ Proyek</button>
              </div>
              <ProjectForm v-if="projectDraft" :key="selectedId" :project="projectDraft" :member-names="memberNames" />
              <p v-else class="ed-empty">Belum ada proyek. Klik + Proyek.</p>
            </div>
          </template>
        </div>

        <footer class="modal__foot">
          <p class="modal__status" :class="`is-${status.type}`" role="status" aria-live="polite">{{ status.text }}</p>
          <div class="modal__actions">
            <button type="button" class="ed-btn" @click="close">Tutup</button>
            <template v-if="tab === 'projects'">
              <button v-if="projectDraft" type="button" class="ed-btn ed-btn--danger" :disabled="saving" @click="removeProject">
                {{ selectedId === 'new' ? 'Batal' : 'Hapus Proyek' }}
              </button>
              <button type="button" class="btn" :disabled="saving || !projectDraft || (!projectDirty && selectedId !== 'new')" @click="saveProject">
                {{ saving ? 'Menyimpan...' : 'Simpan Proyek' }}
              </button>
            </template>
            <button v-else type="button" class="btn" :disabled="saving || !teamDirty" @click="saveTeam">
              {{ saving ? 'Menyimpan...' : 'Simpan Data Tim' }}
            </button>
          </div>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(8, 13, 18, 0.75);
  backdrop-filter: blur(4px);
  animation: fade 0.2s var(--ease);
}

.modal {
  width: min(980px, 100%);
  max-height: calc(100vh - 48px);
  max-height: calc(100dvh - 48px);
  display: flex;
  flex-direction: column;
  background: var(--navy-2);
  color: var(--cream);
  border-top: 4px solid var(--red);
  box-shadow: 16px 16px 0 rgba(255, 70, 85, 0.35);
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 22px), calc(100% - 22px) 100%, 0 100%);
  animation: rise 0.25s var(--ease);
}

.modal:focus {
  outline: none;
}

.modal__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 28px 14px;
}

.modal__title {
  margin-top: 6px;
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  color: var(--white);
}

.modal__close {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  background: transparent;
  border: 1px solid rgba(236, 232, 225, 0.3);
  color: var(--cream);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
}

.modal__close:hover {
  background: var(--red);
  border-color: var(--red);
  color: var(--white);
}

.modal__tabs {
  display: flex;
  gap: 4px;
  padding: 0 28px;
  border-bottom: 1px solid rgba(236, 232, 225, 0.12);
}

.modal__tab {
  position: relative;
  padding: 12px 18px;
  background: transparent;
  border: 0;
  border-bottom: 3px solid transparent;
  margin-bottom: -1px;
  color: var(--muted);
  font-family: var(--font-cond);
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  cursor: pointer;
}

.modal__tab:hover {
  color: var(--cream);
}

.modal__tab.is-active {
  color: var(--white);
  border-bottom-color: var(--red);
}

.dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  margin-left: 6px;
  vertical-align: middle;
  background: var(--red);
  border-radius: 50%;
}

.modal__body {
  flex: 1;
  overflow-y: auto;
  padding: 24px 28px;
  overscroll-behavior: contain;
}

.modal__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 16px 28px 22px;
  border-top: 1px solid rgba(236, 232, 225, 0.12);
  background: var(--navy);
}

.modal__status {
  font-size: 0.9rem;
  min-height: 1.4em;
}

.modal__status.is-ok {
  color: #6fd3a0;
}

.modal__status.is-error {
  color: var(--red);
}

.modal__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-left: auto;
}

.modal__actions .btn {
  padding: 10px 22px;
}

.modal__actions .btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

@keyframes fade {
  from {
    opacity: 0;
  }
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
}

@media (max-width: 600px) {
  .overlay {
    padding: 0;
  }
  .modal {
    max-height: 100dvh;
    height: 100dvh;
    clip-path: none;
    box-shadow: none;
  }
  .modal__head,
  .modal__body,
  .modal__foot {
    padding-left: 18px;
    padding-right: 18px;
  }
  .modal__tabs {
    padding: 0 18px;
  }
}
</style>
