<script setup>
import { ref, reactive, computed, watch } from 'vue'
import Modal from '@/components/common/Modal.vue'
import Button from '@/components/common/Button.vue'
import { useTeam } from '@/composables/useTeam'
import { projectCategories } from '@/data/projects'
import { useProjects } from '@/composables/useProjects'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  modelValue: Boolean,
  preselectedMemberId: { type: [Number, String], default: null },
  // Jika editProject diisi, modal berjalan dalam mode EDIT
  editProject: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue', 'created', 'updated'])

const { teamMembers } = useTeam()
const { addProject, updateProject } = useProjects()
const toast = useToast()

const categories = projectCategories.filter((c) => c !== 'All')

// ── Mode ──────────────────────────────────────────────
const isEditMode = computed(() => !!props.editProject)
const modalTitle = computed(() =>
  isEditMode.value ? `Edit Proyek: ${props.editProject?.title}` : 'Tambah Proyek Portofolio Baru'
)

// ── Gallery / upload ──────────────────────────────────
const galleryImages = ref([])
const fileInputRef = ref(null)
const isDragging = ref(false)

function onFileSelect(event) {
  const files = Array.from(event.target.files || [])
  files.forEach((file) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      galleryImages.value.push({ src: e.target.result, label: file.name })
      if (!form.thumbnail) {
        form.thumbnail = e.target.result
      }
    }
    reader.readAsDataURL(file)
  })
  if (event.target) event.target.value = ''
}

function triggerFileInput() {
  fileInputRef.value?.click()
}

function onDrop(e) {
  isDragging.value = false
  const files = Array.from(e.dataTransfer?.files || [])
  files.forEach((file) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      galleryImages.value.push({ src: ev.target.result, label: file.name })
      if (!form.thumbnail) {
        form.thumbnail = ev.target.result
      }
    }
    reader.readAsDataURL(file)
  })
}

function removeGalleryImage(index) {
  if (form.thumbnail === galleryImages.value[index]?.src) {
    form.thumbnail = ''
  }
  galleryImages.value.splice(index, 1)
}

function setAsThumbnail(src) {
  form.thumbnail = src
}

// ── Form State ────────────────────────────────────────
const form = reactive({
  title: '',
  category: 'Web App',
  type: 'Personal',
  year: new Date().getFullYear().toString(),
  status: 'Completed',
  shortDesc: '',
  overview: '',
  background: '',
  problemStatement: '',
  solution: '',
  results: '',
  techString: '',
  thumbnail: '',
  repoUrl: '',
  demoUrl: '',
  contributors: [{ memberId: 1, role: 'Lead Developer' }],
  objectives: [
    'Digitalisasi alur operasional dan integrasi sistem terpadu',
    'Menyediakan antarmuka pengguna yang responsif, cepat, dan mudah diakses',
  ],
  keyFeatures: [
    'Dashboard analitik data dan pemantauan realtime',
    'Manajemen pengguna dengan kontrol hak akses terproteksi',
  ],
  developmentProcess: [
    { phase: '01. Analisis Kebutuhan', desc: 'Identifikasi kebutuhan pengguna, alur proses bisnis, dan use case diagram.' },
    { phase: '02. Perancangan UI/UX & Basis Data', desc: 'Pembuatan wireframe, desain sistem, dan perancangan skema database relasional.' },
    { phase: '03. Implementasi Kode & Integrasi', desc: 'Pengembangan komponen frontend, logic backend, dan konektivitas API.' },
    { phase: '04. Pengujian & Evaluasi Kinerja', desc: 'Uji fungsionalitas fitur, verifikasi responsivitas, dan evaluasi hasil akhir.' },
  ],
})

const errors = reactive({ title: '', shortDesc: '', contributors: '' })
const isSubmitting = ref(false)
const imageTab = ref('gallery')

const thumbnailPreview = computed(() => form.thumbnail || '')

// ── Watchers ──────────────────────────────────────────

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    if (isEditMode.value && props.editProject) {
      populateFormForEdit(props.editProject)
    } else {
      resetForm()
    }
  },
  { immediate: false }
)

watch(
  () => props.editProject,
  (proj) => {
    if (props.modelValue && proj) {
      populateFormForEdit(proj)
    }
  }
)

watch(
  () => props.preselectedMemberId,
  (newId) => {
    if (!isEditMode.value && newId && form.contributors.length > 0) {
      form.contributors[0].memberId = Number(newId)
    }
  },
  { immediate: true }
)

// ── Helpers ───────────────────────────────────────────

function populateFormForEdit(proj) {
  form.title = proj.title || ''
  form.category = proj.category || 'Web App'
  form.type = proj.type || 'Personal'
  form.year = String(proj.year || new Date().getFullYear())
  form.status = proj.status || 'Completed'
  form.shortDesc = proj.shortDesc || proj.description || ''
  form.overview = proj.overview || proj.description || proj.shortDesc || ''
  form.background = proj.background || ''
  form.problemStatement = proj.problemStatement || ''
  form.solution = proj.solution || ''
  form.results = proj.results || ''
  form.techString = Array.isArray(proj.tech) ? proj.tech.join(', ') : (proj.tech || '')
  form.thumbnail = proj.thumbnail || ''
  form.repoUrl = proj.repoUrl || ''
  form.demoUrl = proj.demoUrl || ''
  form.contributors = proj.contributors && proj.contributors.length > 0
    ? proj.contributors.map((c) => ({ memberId: c.memberId, role: c.role }))
    : [{ memberId: 1, role: 'Lead Developer' }]
  form.objectives = Array.isArray(proj.objectives) && proj.objectives.length > 0
    ? [...proj.objectives]
    : ['Membangun solusi digital yang andal dan mudah digunakan']
  form.keyFeatures = Array.isArray(proj.keyFeatures) && proj.keyFeatures.length > 0
    ? [...proj.keyFeatures]
    : ['Fitur utama terintegrasi']
  form.developmentProcess = Array.isArray(proj.developmentProcess) && proj.developmentProcess.length > 0
    ? proj.developmentProcess.map((p) => ({ phase: p.phase, desc: p.desc }))
    : [
        { phase: '01. Analisis Kebutuhan', desc: 'Identifikasi alur sistem dan riset pengguna.' },
        { phase: '02. Implementasi Sistem', desc: 'Pengembangan kode dan integrasi fitur utama.' },
        { phase: '03. Pengujian & Evaluasi', desc: 'Pengujian fungsi dan verifikasi kinerja.' },
      ]
  galleryImages.value = []
  imageTab.value = form.thumbnail ? 'url' : 'gallery'
  errors.title = ''
  errors.shortDesc = ''
  errors.contributors = ''
}

function resetForm() {
  form.title = ''
  form.shortDesc = ''
  form.overview = ''
  form.background = ''
  form.problemStatement = ''
  form.solution = ''
  form.results = ''
  form.techString = ''
  form.repoUrl = ''
  form.demoUrl = ''
  form.thumbnail = ''
  form.contributors = [{ memberId: props.preselectedMemberId ? Number(props.preselectedMemberId) : 1, role: 'Lead Developer' }]
  form.category = 'Web App'
  form.type = 'Personal'
  form.year = new Date().getFullYear().toString()
  form.status = 'Completed'
  form.objectives = [
    'Digitalisasi alur operasional dan integrasi sistem terpadu',
    'Menyediakan antarmuka pengguna yang responsif, cepat, dan mudah diakses',
  ]
  form.keyFeatures = [
    'Dashboard analitik data dan pemantauan realtime',
    'Manajemen pengguna dengan kontrol hak akses terproteksi',
  ]
  form.developmentProcess = [
    { phase: '01. Analisis Kebutuhan', desc: 'Identifikasi kebutuhan pengguna, alur proses bisnis, dan use case diagram.' },
    { phase: '02. Perancangan UI/UX & Basis Data', desc: 'Pembuatan wireframe, desain sistem, dan perancangan skema database relasional.' },
    { phase: '03. Implementasi Kode & Integrasi', desc: 'Pengembangan komponen frontend, logic backend, dan konektivitas API.' },
    { phase: '04. Pengujian & Evaluasi Kinerja', desc: 'Uji fungsionalitas fitur, verifikasi responsivitas, dan evaluasi hasil akhir.' },
  ]
  galleryImages.value = []
  imageTab.value = 'gallery'
  errors.title = ''
  errors.shortDesc = ''
  errors.contributors = ''
}

// ── Dynamic List Actions ──────────────────────────────
function addContributor() {
  const currentIds = form.contributors.map((c) => c.memberId)
  const nextMember = teamMembers.value.find((m) => !currentIds.includes(m.id))
  form.contributors.push({ memberId: nextMember ? nextMember.id : 1, role: 'Contributor' })
  form.type = 'Team'
}

function removeContributor(index) {
  if (form.contributors.length > 1) {
    form.contributors.splice(index, 1)
    if (form.contributors.length === 1) form.type = 'Personal'
  }
}

function addObjective() {
  form.objectives.push('')
}

function removeObjective(index) {
  if (form.objectives.length > 1) {
    form.objectives.splice(index, 1)
  }
}

function addKeyFeature() {
  form.keyFeatures.push('')
}

function removeKeyFeature(index) {
  if (form.keyFeatures.length > 1) {
    form.keyFeatures.splice(index, 1)
  }
}

function addDevPhase() {
  const nextNum = String(form.developmentProcess.length + 1).padStart(2, '0')
  form.developmentProcess.push({
    phase: `${nextNum}. Tahapan Baru`,
    desc: '',
  })
}

function removeDevPhase(index) {
  if (form.developmentProcess.length > 1) {
    form.developmentProcess.splice(index, 1)
  }
}

function loadDefaultDevProcess() {
  form.developmentProcess = [
    { phase: '01. Analisis Kebutuhan Sistem', desc: 'Identifikasi alur bisnis, analisis kebutuhan pengguna, dan use case diagram.' },
    { phase: '02. Perancangan Arsitektur & UI/UX', desc: 'Pembuatan wireframe Figma, prototipe interaktif, dan pemodelan database ERD.' },
    { phase: '03. Implementasi Kode & Fitur', desc: 'Pengembangan komponen antarmuka, routing, state management, dan integrasi backend API.' },
    { phase: '04. Pengujian Sistem & Deployment', desc: 'User acceptance testing, pengujian fungsionalitas, optimasi performa, dan publikasi.' },
  ]
  toast.info('Template tahapan pengembangan berhasil dimuat.')
}

// ── Validation ────────────────────────────────────────
function validate() {
  let valid = true
  errors.title = ''
  errors.shortDesc = ''
  errors.contributors = ''

  if (!form.title.trim()) {
    errors.title = 'Judul proyek wajib diisi.'
    valid = false
  } else if (form.title.trim().length < 3) {
    errors.title = 'Judul minimal 3 karakter.'
    valid = false
  }

  if (!form.shortDesc.trim()) {
    errors.shortDesc = 'Deskripsi singkat proyek wajib diisi.'
    valid = false
  } else if (form.shortDesc.trim().length < 10) {
    errors.shortDesc = 'Deskripsi minimal 10 karakter.'
    valid = false
  }

  if (form.contributors.some((c) => !c.role.trim())) {
    errors.contributors = 'Seluruh peran kontributor wajib diisi.'
    valid = false
  }

  return valid
}

function buildPayload() {
  const galleryFromUpload = galleryImages.value.map((g) => g.src)
  const thumb = form.thumbnail.trim()
  let allGallery
  if (galleryFromUpload.length > 0) {
    allGallery = thumb && !galleryFromUpload.includes(thumb)
      ? [thumb, ...galleryFromUpload]
      : galleryFromUpload.length > 0 ? galleryFromUpload : (thumb ? [thumb] : [])
  } else {
    allGallery = thumb ? [thumb] : []
  }

  const cleanedObjectives = form.objectives.map((o) => o.trim()).filter(Boolean)
  const cleanedKeyFeatures = form.keyFeatures.map((f) => f.trim()).filter(Boolean)
  const cleanedDevProcess = form.developmentProcess
    .map((p) => ({ phase: p.phase.trim(), desc: p.desc.trim() }))
    .filter((p) => p.phase || p.desc)

  return {
    title: form.title,
    category: form.category,
    type: form.type,
    year: form.year,
    status: form.status,
    shortDesc: form.shortDesc,
    description: form.shortDesc,
    overview: form.overview.trim() || form.shortDesc.trim(),
    background: form.background.trim() || 'Proyek dikembangkan untuk menjawab kebutuhan digitalisasi dan efisiensi sistem.',
    problemStatement: form.problemStatement.trim() || '',
    solution: form.solution.trim() || '',
    results: form.results.trim() || 'Proyek berhasil diimplementasikan dan siap didemonstrasikan.',
    objectives: cleanedObjectives.length > 0 ? cleanedObjectives : ['Membangun solusi digital yang andal dan mudah digunakan'],
    keyFeatures: cleanedKeyFeatures.length > 0 ? cleanedKeyFeatures : ['Fitur utama terintegrasi'],
    developmentProcess: cleanedDevProcess.length > 0 ? cleanedDevProcess : [
      { phase: '01. Analisis Kebutuhan', desc: 'Identifikasi alur sistem dan riset kebutuhan.' },
      { phase: '02. Implementasi Sistem', desc: 'Pengembangan kode dan integrasi fitur utama.' },
      { phase: '03. Pengujian & Evaluasi', desc: 'Pengujian fungsi dan verifikasi kinerja.' },
    ],
    tech: form.techString
      ? form.techString.split(',').map((s) => s.trim()).filter(Boolean)
      : [form.category],
    thumbnail: thumb || (allGallery[0] || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80'),
    gallery: allGallery.length > 0 ? allGallery : ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80'],
    contributors: form.contributors.map((c) => ({
      memberId: Number(c.memberId),
      role: c.role.trim(),
    })),
    repoUrl: form.repoUrl.trim() || null,
    demoUrl: form.demoUrl.trim() || null,
  }
}

function handleSubmit() {
  if (!validate()) {
    toast.error('Mohon lengkapi seluruh kolom yang bertanda bintang (*).')
    return
  }

  isSubmitting.value = true
  try {
    const payload = buildPayload()

    if (isEditMode.value && props.editProject) {
      const updated = updateProject(props.editProject.id, payload)
      toast.success(`Proyek "${updated.title}" berhasil diperbarui!`)
      emit('updated', updated)
    } else {
      const created = addProject(payload)
      toast.success(`Proyek "${created.title}" berhasil ditambahkan!`)
      emit('created', created)
    }

    emit('update:modelValue', false)
    resetForm()
  } catch (err) {
    toast.error('Gagal menyimpan proyek: ' + err.message)
  } finally {
    isSubmitting.value = false
  }
}

function handleClose() {
  emit('update:modelValue', false)
}
</script>

<template>
  <Modal
    :model-value="modelValue"
    :title="modalTitle"
    size="xl"
    @update:model-value="handleClose"
  >
    <form class="apf" @submit.prevent="handleSubmit">

      <!-- Info banner -->
      <div class="apf__banner" :class="isEditMode ? 'apf__banner--edit' : ''">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span v-if="isEditMode">
          Mode <strong>Edit Proyek</strong> — seluruh field dokumentasi (Development Process, Key Features, Objectives, dll.) dapat diperbarui langsung ke portofolio.
        </span>
        <span v-else>
          Seluruh informasi proyek (Overview, Background, Objectives, Features, hingga Development Process) tersimpan <strong>persisten di peramban</strong> (bukan dummy) dan tampil lengkap di halaman Detail Proyek &amp; Profil Anggota.
        </span>
      </div>

      <!-- ══════════════════════════════════════════════════ -->
      <!-- SECTION 1: Pemilik & Kontributor                  -->
      <!-- ══════════════════════════════════════════════════ -->
      <div class="apf__section">
        <div class="apf__section__head">
          <div>
            <span class="apf__section__tag">01</span>
            <span class="apf__section__title">Pemilik &amp; Kontributor Tim <span class="req">*</span></span>
          </div>
          <button type="button" class="apf__link-btn" @click="addContributor">+ Tambah Anggota</button>
        </div>

        <div class="apf__contrib-list">
          <div v-for="(contrib, i) in form.contributors" :key="i" class="apf__contrib-row">
            <select v-model="contrib.memberId" class="apf__select apf__contrib-row__member">
              <option v-for="m in teamMembers" :key="m.id" :value="m.id">
                {{ m.name }}
              </option>
            </select>
            <input
              v-model="contrib.role"
              type="text"
              class="apf__input apf__contrib-row__role"
              placeholder="Peran (mis: Lead Developer &amp; System Analyst)"
            />
            <button
              v-if="form.contributors.length > 1"
              type="button"
              class="apf__contrib-row__remove"
              title="Hapus kontributor"
              @click="removeContributor(i)"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
        <p v-if="errors.contributors" class="apf__error">{{ errors.contributors }}</p>
      </div>

      <!-- ══════════════════════════════════════════════════ -->
      <!-- SECTION 2: Metadata Dasar Proyek                  -->
      <!-- ══════════════════════════════════════════════════ -->
      <div class="apf__section">
        <div class="apf__section__head">
          <div>
            <span class="apf__section__tag">02</span>
            <span class="apf__section__title">Informasi Dasar Proyek</span>
          </div>
        </div>

        <div class="apf__grid">
          <!-- Judul -->
          <div class="apf__field apf__field--full">
            <label class="apf__label">Judul Proyek <span class="req">*</span></label>
            <input
              v-model="form.title"
              type="text"
              class="apf__input"
              :class="{ 'apf__input--error': errors.title }"
              placeholder="Contoh: SehatYuk — Web-Based Health Platform"
            />
            <p v-if="errors.title" class="apf__error">{{ errors.title }}</p>
          </div>

          <!-- Kategori -->
          <div class="apf__field">
            <label class="apf__label">Kategori</label>
            <select v-model="form.category" class="apf__select">
              <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>

          <!-- Tipe -->
          <div class="apf__field">
            <label class="apf__label">Tipe Kepemilikan</label>
            <select v-model="form.type" class="apf__select">
              <option value="Personal">Personal (Karya Mandiri)</option>
              <option value="Team">Team (Kolaborasi Tim)</option>
            </select>
          </div>

          <!-- Tahun -->
          <div class="apf__field">
            <label class="apf__label">Tahun Proyek</label>
            <input v-model="form.year" type="text" class="apf__input" placeholder="2025" />
          </div>

          <!-- Status -->
          <div class="apf__field">
            <label class="apf__label">Status</label>
            <select v-model="form.status" class="apf__select">
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>

          <!-- Deskripsi Singkat -->
          <div class="apf__field apf__field--full">
            <label class="apf__label">Deskripsi Singkat (Card Summary) <span class="req">*</span></label>
            <textarea
              v-model="form.shortDesc"
              class="apf__textarea"
              :class="{ 'apf__textarea--error': errors.shortDesc }"
              rows="2"
              placeholder="Ringkasan 1-2 kalimat yang tampil di kartu katalog portofolio..."
            />
            <p v-if="errors.shortDesc" class="apf__error">{{ errors.shortDesc }}</p>
          </div>

          <!-- Tech -->
          <div class="apf__field apf__field--full">
            <label class="apf__label">Teknologi &amp; Tools (pisahkan dengan koma)</label>
            <input
              v-model="form.techString"
              type="text"
              class="apf__input"
              placeholder="Contoh: Laravel, Vue.js, MySQL, Bootstrap, REST API"
            />
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════ -->
      <!-- SECTION 3: Visual & Galeri Proyek                 -->
      <!-- ══════════════════════════════════════════════════ -->
      <div class="apf__section">
        <div class="apf__section__head">
          <div>
            <span class="apf__section__tag">03</span>
            <span class="apf__section__title">Thumbnail &amp; Galeri Visual</span>
          </div>
        </div>

        <!-- Preview -->
        <div class="apf__thumb-preview" :class="{ 'apf__thumb-preview--empty': !thumbnailPreview }">
          <img v-if="thumbnailPreview" :src="thumbnailPreview" alt="Thumbnail Preview" class="apf__thumb-preview__img" />
          <div v-else class="apf__thumb-preview__placeholder">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.3">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
            <span>Belum ada thumbnail aktif</span>
          </div>
          <span v-if="thumbnailPreview" class="apf__thumb-preview__badge">Thumbnail Aktif</span>
        </div>

        <!-- Tabs: hanya Upload & URL -->
        <div class="apf__img-tabs">
          <button
            type="button"
            class="apf__img-tab"
            :class="{ 'apf__img-tab--active': imageTab === 'gallery' }"
            @click="imageTab = 'gallery'"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload dari Galeri Komputer
            <span v-if="galleryImages.length > 0" class="apf__img-tab__badge">{{ galleryImages.length }}</span>
          </button>
          <button
            type="button"
            class="apf__img-tab"
            :class="{ 'apf__img-tab--active': imageTab === 'url' }"
            @click="imageTab = 'url'"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            Tempel URL Gambar
          </button>
        </div>

        <!-- Tab: Upload from Gallery -->
        <div v-if="imageTab === 'gallery'" class="apf__upload-zone">
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            multiple
            class="apf__upload-zone__hidden-input"
            @change="onFileSelect"
          />

          <div
            class="apf__dropzone"
            :class="{ 'apf__dropzone--active': isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false"
            @drop.prevent="onDrop"
            @click="triggerFileInput"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <p class="apf__dropzone__text">
              <strong>Klik untuk memilih gambar dari galeri</strong> atau seret &amp; lepas di sini
            </p>
            <p class="apf__dropzone__hint">JPG, PNG, WEBP — Bisa pilih banyak gambar sekaligus untuk galeri proyek</p>
          </div>

          <div v-if="galleryImages.length > 0" class="apf__gallery-grid">
            <div
              v-for="(img, idx) in galleryImages"
              :key="idx"
              class="apf__gallery-item"
              :class="{ 'apf__gallery-item--selected': form.thumbnail === img.src }"
            >
              <img :src="img.src" :alt="img.label" class="apf__gallery-item__img" />
              <div class="apf__gallery-item__overlay">
                <button type="button" class="apf__gallery-item__set-btn" @click="setAsThumbnail(img.src)">
                  {{ form.thumbnail === img.src ? '✓ Thumbnail' : 'Jadikan Cover' }}
                </button>
                <button type="button" class="apf__gallery-item__del-btn" @click="removeGalleryImage(idx)">Hapus</button>
              </div>
              <span v-if="form.thumbnail === img.src" class="apf__gallery-item__badge">Thumbnail Utama</span>
            </div>
          </div>
          <p v-else class="apf__upload-hint">
            Belum ada gambar lokal yang diunggah. Gambar yang diunggah otomatis tersimpan di peramban ke galeri proyek.
          </p>
        </div>

        <!-- Tab: URL -->
        <div v-if="imageTab === 'url'">
          <input
            v-model="form.thumbnail"
            type="url"
            class="apf__input"
            placeholder="https://images.unsplash.com/... atau URL gambar langsung"
          />
          <p class="apf__input-hint">Tempel tautan gambar langsung dari internet untuk dijadikan thumbnail.</p>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════ -->
      <!-- SECTION 4: Dokumentasi Lengkap & Studi Kasus      -->
      <!-- ══════════════════════════════════════════════════ -->
      <div class="apf__section">
        <div class="apf__section__head">
          <div>
            <span class="apf__section__tag">04</span>
            <span class="apf__section__title">Dokumentasi Narasi &amp; Studi Kasus</span>
          </div>
        </div>

        <div class="apf__grid">
          <!-- Project Overview -->
          <div class="apf__field apf__field--full">
            <label class="apf__label">
              Project Overview <span class="apf__opt">(Gambaran umum &amp; rangkuman proyek)</span>
            </label>
            <textarea
              v-model="form.overview"
              class="apf__textarea"
              rows="3"
              placeholder="Jelaskan secara komprehensif apa proyek ini, mengapa penting, dan apa capaian utamanya..."
            />
          </div>

          <!-- Background -->
          <div class="apf__field apf__field--full">
            <label class="apf__label">
              Background <span class="apf__opt">(Latar belakang &amp; konteks masalah)</span>
            </label>
            <textarea
              v-model="form.background"
              class="apf__textarea"
              rows="2"
              placeholder="Ceritakan latar belakang situasi nyata yang mendorong dimulainya proyek ini..."
            />
          </div>

          <!-- Problem Statement -->
          <div class="apf__field">
            <label class="apf__label">
              Problem Statement <span class="apf__opt">(Kendala / Masalah Spesifik)</span>
            </label>
            <textarea
              v-model="form.problemStatement"
              class="apf__textarea"
              rows="3"
              placeholder="Masalah utama atau kendala yang dihadapi pengguna sebelumnya..."
            />
          </div>

          <!-- Solution -->
          <div class="apf__field">
            <label class="apf__label">
              Solution <span class="apf__opt">(Solusi yang Diterapkan)</span>
            </label>
            <textarea
              v-model="form.solution"
              class="apf__textarea"
              rows="3"
              placeholder="Bagaimana arsitektur, teknologi, atau desain Anda mengatasi masalah di atas..."
            />
          </div>

          <!-- Results & Impact -->
          <div class="apf__field apf__field--full">
            <label class="apf__label">
              Results &amp; Impact <span class="apf__opt">(Hasil, Dampak &amp; Metrik Keberhasilan)</span>
            </label>
            <textarea
              v-model="form.results"
              class="apf__textarea"
              rows="2"
              placeholder="Misal: Memangkas waktu tunggu hingga 45 menit, melayani 500+ pengguna aktif, dsb..."
            />
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════ -->
      <!-- SECTION 5: Objectives & Key Features              -->
      <!-- ══════════════════════════════════════════════════ -->
      <div class="apf__section">
        <div class="apf__section__head">
          <div>
            <span class="apf__section__tag">05</span>
            <span class="apf__section__title">Tujuan (Objectives) &amp; Fitur Utama (Key Features)</span>
          </div>
        </div>

        <div class="apf__grid">
          <!-- Objectives -->
          <div class="apf__field">
            <div class="apf__subhead">
              <label class="apf__label">Objectives (Tujuan Proyek)</label>
              <button type="button" class="apf__link-btn" @click="addObjective">+ Tambah Tujuan</button>
            </div>
            <div class="apf__dynamic-list">
              <div v-for="(obj, i) in form.objectives" :key="i" class="apf__dynamic-row">
                <span class="apf__dynamic-bullet">→</span>
                <input
                  v-model="form.objectives[i]"
                  type="text"
                  class="apf__input"
                  :placeholder="`Tujuan ke-${i + 1}`"
                />
                <button
                  v-if="form.objectives.length > 1"
                  type="button"
                  class="apf__dynamic-row__remove"
                  title="Hapus poin"
                  @click="removeObjective(i)"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <!-- Key Features -->
          <div class="apf__field">
            <div class="apf__subhead">
              <label class="apf__label">Key Features (Fitur Kunci)</label>
              <button type="button" class="apf__link-btn" @click="addKeyFeature">+ Tambah Fitur</button>
            </div>
            <div class="apf__dynamic-list">
              <div v-for="(feat, i) in form.keyFeatures" :key="i" class="apf__dynamic-row">
                <span class="apf__dynamic-num">{{ String(i + 1).padStart(2, '0') }}</span>
                <input
                  v-model="form.keyFeatures[i]"
                  type="text"
                  class="apf__input"
                  :placeholder="`Fitur ke-${i + 1}`"
                />
                <button
                  v-if="form.keyFeatures.length > 1"
                  type="button"
                  class="apf__dynamic-row__remove"
                  title="Hapus fitur"
                  @click="removeKeyFeature(i)"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════ -->
      <!-- SECTION 6: Development Process                    -->
      <!-- ══════════════════════════════════════════════════ -->
      <div class="apf__section">
        <div class="apf__section__head">
          <div>
            <span class="apf__section__tag">06</span>
            <span class="apf__section__title">Development Process (Tahapan Pengembangan)</span>
          </div>
          <div class="apf__head-actions">
            <button type="button" class="apf__template-btn" @click="loadDefaultDevProcess">
              ↺ Muat Template Standar
            </button>
            <button type="button" class="apf__link-btn" @click="addDevPhase">
              + Tambah Tahapan
            </button>
          </div>
        </div>

        <p class="apf__section-desc">
          Tentukan langkah-langkah metodologi perancangan dan implementasi proyek (tampil sebagai timeline interaktif di halaman detail):
        </p>

        <div class="apf__timeline-builder">
          <div
            v-for="(step, i) in form.developmentProcess"
            :key="i"
            class="apf__timeline-card"
          >
            <div class="apf__timeline-card__badge">{{ i + 1 }}</div>
            <div class="apf__timeline-card__inputs">
              <input
                v-model="step.phase"
                type="text"
                class="apf__input apf__timeline-card__phase"
                placeholder="Nama Tahapan (mis: 01. Analisis Kebutuhan)"
              />
              <textarea
                v-model="step.desc"
                class="apf__textarea apf__timeline-card__desc"
                rows="2"
                placeholder="Deskripsi aktivitas yang dilakukan pada tahapan ini..."
              />
            </div>
            <button
              v-if="form.developmentProcess.length > 1"
              type="button"
              class="apf__contrib-row__remove apf__timeline-card__del"
              title="Hapus tahapan ini"
              @click="removeDevPhase(i)"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════ -->
      <!-- SECTION 7: Tautan Repositori & Demo Live           -->
      <!-- ══════════════════════════════════════════════════ -->
      <div class="apf__section">
        <div class="apf__section__head">
          <div>
            <span class="apf__section__tag">07</span>
            <span class="apf__section__title">Tautan Repositori &amp; Demo Live</span>
          </div>
        </div>

        <div class="apf__grid">
          <div class="apf__field">
            <label class="apf__label">URL GitHub / Repositori <span class="apf__opt">(opsional)</span></label>
            <input
              v-model="form.repoUrl"
              type="url"
              class="apf__input"
              placeholder="https://github.com/PanjulAja/..."
            />
          </div>
          <div class="apf__field">
            <label class="apf__label">URL Live Demo / Website <span class="apf__opt">(opsional)</span></label>
            <input
              v-model="form.demoUrl"
              type="url"
              class="apf__input"
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      <!-- ══ Actions ══ -->
      <div class="apf__actions">
        <Button variant="secondary" size="md" type="button" @click="handleClose">
          Batal
        </Button>
        <Button variant="primary" size="md" type="submit" :loading="isSubmitting">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {{ isEditMode ? 'Simpan Perubahan Proyek' : 'Simpan & Terbitkan Proyek' }}
        </Button>
      </div>

    </form>
  </Modal>
</template>

<style scoped>
.apf {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

/* Info Banner */
.apf__banner {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  background: var(--color-bg-alt);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--color-highlight);
  line-height: 1.5;
}
.apf__banner--edit {
  border-left-color: #3b82f6;
  background: color-mix(in srgb, #3b82f6 6%, transparent);
}

/* Sections */
.apf__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4) var(--space-5);
  background: var(--color-bg-alt);
}
.apf__section__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}
.apf__section__tag {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 800;
  color: var(--color-highlight);
  margin-right: var(--space-2);
  letter-spacing: 0.05em;
}
.apf__section__title {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-text);
}
.apf__section-desc {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin: 0;
  line-height: 1.4;
}

.apf__head-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.apf__template-btn {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-secondary);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.apf__template-btn:hover {
  color: var(--color-text);
  border-color: var(--color-text-secondary);
}

.apf__subhead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-2);
}

/* Grid */
.apf__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}
.apf__field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
.apf__field--full { grid-column: 1 / -1; }

/* Labels */
.apf__label {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-text);
}
.req { color: var(--color-highlight); }
.apf__opt { color: var(--color-text-muted); font-weight: 400; font-size: 11px; }

/* Inputs */
.apf__input,
.apf__select,
.apf__textarea {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-text);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-3);
  outline: none;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  width: 100%;
}
.apf__input, .apf__select { height: 38px; }
.apf__textarea { resize: vertical; line-height: 1.5; }
.apf__input:focus, .apf__select:focus, .apf__textarea:focus {
  border-color: var(--color-text);
  box-shadow: 0 0 0 2px var(--color-highlight-subtle);
}
.apf__input--error, .apf__textarea--error { border-color: var(--color-error, #ef4444); }
.apf__error {
  font-size: 11px; color: var(--color-error, #ef4444); margin: 2px 0 0;
}
.apf__input-hint {
  font-size: 11px; color: var(--color-text-muted); margin-top: var(--space-1);
}

/* Link-style button */
.apf__link-btn {
  font-size: var(--text-xs); font-weight: 600;
  color: var(--color-highlight); background: none; border: none;
  cursor: pointer; text-decoration: underline; padding: 0;
}
.apf__link-btn:hover { opacity: 0.8; }

/* Contributors */
.apf__contrib-list { display: flex; flex-direction: column; gap: var(--space-2); }
.apf__contrib-row {
  display: grid;
  grid-template-columns: 1.3fr 1.5fr 32px;
  gap: var(--space-2); align-items: center;
}
.apf__contrib-row__remove {
  height: 36px; width: 32px; border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--color-error, #ef4444) 10%, transparent);
  color: var(--color-error, #ef4444);
  border: 1px solid color-mix(in srgb, var(--color-error, #ef4444) 25%, transparent);
  font-size: var(--text-xs); cursor: pointer;
  transition: all var(--transition-fast);
  display: flex; align-items: center; justify-content: center;
}
.apf__contrib-row__remove:hover { background: var(--color-error, #ef4444); color: white; }

/* ── Dynamic Lists (Objectives & Key Features) ── */
.apf__dynamic-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.apf__dynamic-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.apf__dynamic-bullet {
  font-size: var(--text-xs);
  color: var(--color-highlight);
  font-weight: 700;
}
.apf__dynamic-num {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 700;
  color: var(--color-text-muted);
  width: 18px;
}
.apf__dynamic-row__remove {
  height: 36px; width: 32px; flex-shrink: 0;
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
  font-size: 11px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all var(--transition-fast);
}
.apf__dynamic-row__remove:hover {
  color: #ef4444; border-color: #ef4444;
}

/* ── Development Process Timeline Builder ── */
.apf__timeline-builder {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-top: var(--space-2);
}
.apf__timeline-card {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
  padding: var(--space-3);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  position: relative;
}
.apf__timeline-card__badge {
  width: 24px; height: 24px; border-radius: 50%;
  background: var(--color-text); color: var(--color-bg);
  font-family: var(--font-display); font-size: 11px; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-top: 6px;
}
.apf__timeline-card__inputs {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.apf__timeline-card__phase {
  font-weight: 600;
}
.apf__timeline-card__del {
  margin-top: 2px;
}

/* ── Thumbnail Preview ── */
.apf__thumb-preview {
  position: relative;
  width: 100%; height: 160px;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--color-border);
}
.apf__thumb-preview--empty {
  background: var(--color-bg-elevated);
  display: flex; align-items: center; justify-content: center;
}
.apf__thumb-preview__placeholder {
  display: flex; flex-direction: column; align-items: center; gap: var(--space-2);
  color: var(--color-text-muted); font-size: var(--text-xs);
}
.apf__thumb-preview__img {
  width: 100%; height: 100%; object-fit: cover;
}
.apf__thumb-preview__badge {
  position: absolute; top: var(--space-2); left: var(--space-2);
  background: rgba(0,0,0,0.65); color: white;
  font-size: 10px; font-weight: 700; letter-spacing: 0.05em;
  padding: 3px 8px; border-radius: var(--radius-sm);
}

/* Tabs */
.apf__img-tabs {
  display: flex; gap: var(--space-1);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--space-3);
}
.apf__img-tab {
  display: inline-flex; align-items: center; gap: var(--space-1);
  padding: var(--space-2) var(--space-3); font-size: var(--text-xs); font-weight: 600;
  color: var(--color-text-muted); cursor: pointer; border-bottom: 2px solid transparent;
  transition: all var(--transition-fast); background: none;
  border-top: none; border-left: none; border-right: none;
  margin-bottom: -1px;
}
.apf__img-tab:hover { color: var(--color-text); }
.apf__img-tab--active { color: var(--color-text); border-bottom-color: var(--color-text); }
.apf__img-tab__badge {
  display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px; border-radius: 50%;
  background: var(--color-highlight); color: white; font-size: 10px; font-weight: 700;
}

/* Upload/Drop Zone */
.apf__upload-zone__hidden-input { display: none; }
.apf__dropzone {
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-6) var(--space-4);
  text-align: center;
  cursor: pointer;
  transition: border-color var(--transition-fast), background-color var(--transition-fast);
  color: var(--color-text-muted);
  display: flex; flex-direction: column; align-items: center; gap: var(--space-2);
}
.apf__dropzone:hover, .apf__dropzone--active {
  border-color: var(--color-highlight);
  background: var(--color-highlight-subtle);
}
.apf__dropzone__text { font-size: var(--text-sm); color: var(--color-text-secondary); margin: 0; }
.apf__dropzone__hint { font-size: 11px; margin: 0; }

/* Gallery grid */
.apf__gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: var(--space-2);
  margin-top: var(--space-3);
}
.apf__gallery-item {
  position: relative; border-radius: var(--radius-sm); overflow: hidden;
  border: 2px solid var(--color-border); aspect-ratio: 4/3;
  transition: border-color var(--transition-fast);
}
.apf__gallery-item--selected { border-color: var(--color-highlight); }
.apf__gallery-item__img {
  width: 100%; height: 100%; object-fit: cover; display: block;
}
.apf__gallery-item__overlay {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: var(--space-1); opacity: 0;
  transition: opacity var(--transition-fast);
}
.apf__gallery-item:hover .apf__gallery-item__overlay { opacity: 1; }
.apf__gallery-item__set-btn {
  font-size: 10px; font-weight: 700; padding: 3px 8px;
  border-radius: var(--radius-sm); background: var(--color-highlight); color: white;
  border: none; cursor: pointer;
}
.apf__gallery-item__del-btn {
  font-size: 10px; font-weight: 700; padding: 2px 7px;
  border-radius: var(--radius-sm); background: rgba(239,68,68,0.9); color: white;
  border: none; cursor: pointer;
}
.apf__gallery-item__badge {
  position: absolute; bottom: 3px; left: 3px;
  background: var(--color-highlight); color: white;
  font-size: 9px; font-weight: 700; letter-spacing: 0.03em;
  padding: 1px 5px; border-radius: var(--radius-sm);
}
.apf__upload-hint {
  font-size: 11px; color: var(--color-text-muted); text-align: center;
  padding: var(--space-3); margin-top: var(--space-2);
}

/* Actions */
.apf__actions {
  display: flex; justify-content: flex-end; gap: var(--space-3);
  padding-top: var(--space-4); border-top: 1px solid var(--color-border-subtle);
}

@media (max-width: 768px) {
  .apf__grid { grid-template-columns: 1fr; }
  .apf__contrib-row { grid-template-columns: 1fr; }
  .apf__head-actions { flex-direction: column; align-items: flex-end; gap: var(--space-1); }
}
</style>
