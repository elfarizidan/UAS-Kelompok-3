<script setup>
import { ref, reactive, computed, watch } from 'vue'
import Modal from '@/components/common/Modal.vue'
import Button from '@/components/common/Button.vue'
import { useTeam } from '@/composables/useTeam'
import { useProjects } from '@/composables/useProjects'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  modelValue: Boolean,
  // Jika editMember diisi → mode Edit, kosong → mode Tambah
  editMember: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue', 'created', 'updated'])

const { addMember, updateMember, getInitials } = useTeam()
const { syncMemberGithubProjects } = useProjects()
const toast = useToast()

const isEditMode = computed(() => !!props.editMember)

// ── Form State ──────────────────────────────────────────────
const form = reactive({
  name: '',
  nim: '',
  role: '',
  bio: '',
  skills: '',
  avatar: '',
  github: '',
  linkedin: '',
  email: '',
  githubUsername: '',
  initials: '',
  color: '#1a1714',
})

// Avatar upload state
const avatarMode = ref('upload') // 'upload' | 'url'
const avatarFileInputRef = ref(null)
const isDeviceAvatar = ref(false)
const avatarPreviewError = ref(false)

// GitHub auto-sync state
const isFetchingGithub = ref(false)
const githubError = ref(null)
const githubStats = ref(null) // { total, personal, team, repos, avatar_url, bio, name }
const autoSyncProjects = ref(true)

const isSaving = ref(false)
const errors = reactive({})

// Auto-generate initials when name changes
watch(() => form.name, (val) => {
  if (!form.initials || form.initials === getInitials(props.editMember?.name || '')) {
    form.initials = getInitials(val)
  }
})

// Auto-parse and fetch GitHub data when github URL changes
let githubDebounce = null
watch(() => form.github, (val) => {
  if (githubDebounce) clearTimeout(githubDebounce)

  if (!val || !val.trim()) {
    githubStats.value = null
    githubError.value = null
    form.githubUsername = ''
    return
  }

  githubDebounce = setTimeout(() => {
    handleGithubInput(val)
  }, 500)
})

function extractGithubUsername(urlOrUser) {
  if (!urlOrUser) return ''
  const trimmed = urlOrUser.trim()
  // Matches https://github.com/username or github.com/username or @username or username
  const cleaned = trimmed.replace(/^https?:\/\/(www\.)?github\.com\//i, '').replace(/^@/, '').replace(/\/.*$/, '')
  return cleaned
}

async function handleGithubInput(val) {
  const username = extractGithubUsername(val)
  if (!username) return

  form.githubUsername = username
  await fetchGithubData(username)
}

async function fetchGithubData(username) {
  isFetchingGithub.value = true
  githubError.value = null

  try {
    // 1. Fetch user profile
    const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`)
    if (!userRes.ok) {
      if (userRes.status === 404) throw new Error(`User GitHub "@${username}" tidak ditemukan.`)
      if (userRes.status === 403) throw new Error('Batas API GitHub tercapai, coba beberapa saat lagi.')
      throw new Error(`GitHub HTTP ${userRes.status}`)
    }
    const userData = await userRes.json()

    // 2. Fetch user's public repositories
    const reposRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100`)
    let repos = []
    if (reposRes.ok) {
      repos = await reposRes.json()
    }

    const personal = repos.filter((r) => !r.fork).length
    const team = repos.filter((r) => r.fork).length
    const total = repos.length

    githubStats.value = {
      username,
      total,
      personal,
      team,
      repos,
      avatarUrl: userData.avatar_url,
      bio: userData.bio,
      name: userData.name,
    }

    // Auto-fill avatar if user hasn't explicitly uploaded one
    if (!isDeviceAvatar.value && (!form.avatar || form.avatar.includes('dicebear.com'))) {
      if (userData.avatar_url) {
        form.avatar = userData.avatar_url
      }
    }

    // Auto-fill name if empty
    if (!form.name.trim() && userData.name) {
      form.name = userData.name
    }

    // Auto-fill bio if empty
    if (!form.bio.trim() && userData.bio) {
      form.bio = userData.bio
    }
  } catch (err) {
    console.warn('Gagal mengambil data GitHub:', err)
    githubError.value = err.message
  } finally {
    isFetchingGithub.value = false
  }
}

// ── Device File Upload & Canvas Resizer ──────────────────────
function triggerDeviceUpload() {
  avatarFileInputRef.value?.click()
}

function onAvatarFileSelect(e) {
  const file = e.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    toast.error('Harap pilih file gambar (JPG, PNG, atau WebP).')
    return
  }

  const reader = new FileReader()
  reader.onload = (event) => {
    const rawDataUrl = event.target.result
    // Compress image to max 320x320 using canvas to keep localStorage light (~30KB)
    compressImage(rawDataUrl, 320, 320, 0.88, (compressed) => {
      form.avatar = compressed
      isDeviceAvatar.value = true
      avatarPreviewError.value = false
      toast.success('Foto profil berhasil diunggah dari perangkat!')
    })
  }
  reader.readAsDataURL(file)
}

function compressImage(src, maxWidth, maxHeight, quality, callback) {
  const img = new Image()
  img.onload = () => {
    let width = img.width
    let height = img.height

    if (width > height) {
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width)
        width = maxWidth
      }
    } else {
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height)
        height = maxHeight
      }
    }

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, width, height)

    const compressed = canvas.toDataURL('image/jpeg', quality)
    callback(compressed)
  }
  img.onerror = () => {
    callback(src) // fallback to original dataURL
  }
  img.src = src
}

function removeAvatar() {
  form.avatar = ''
  isDeviceAvatar.value = false
  if (avatarFileInputRef.value) avatarFileInputRef.value.value = ''
}

function useGithubAvatar() {
  if (githubStats.value?.avatarUrl) {
    form.avatar = githubStats.value.avatarUrl
    isDeviceAvatar.value = false
    toast.info('Foto profil GitHub diterapkan.')
  }
}

// Populate form when editMember changes
watch(() => props.editMember, (member) => {
  if (member) {
    form.name = member.name || ''
    form.nim = member.nim || ''
    form.role = member.role || ''
    form.bio = member.bio || ''
    form.skills = Array.isArray(member.skills) ? member.skills.join(', ') : (member.skills || '')
    form.avatar = member.avatar || ''
    form.github = member.github || ''
    form.linkedin = member.linkedin || ''
    form.email = member.email || ''
    form.githubUsername = member.githubUsername || ''
    form.initials = member.initials || getInitials(member.name)
    form.color = member.color || '#1a1714'
    isDeviceAvatar.value = (member.avatar || '').startsWith('data:image/')
    avatarPreviewError.value = false

    if (member.github) {
      handleGithubInput(member.github)
    }
  }
}, { immediate: true })

// Reset form when modal closes
watch(() => props.modelValue, (val) => {
  if (!val && !props.editMember) {
    resetForm()
  }
  if (val) {
    Object.keys(errors).forEach((k) => delete errors[k])
  }
})

function resetForm() {
  form.name = ''
  form.nim = ''
  form.role = ''
  form.bio = ''
  form.skills = ''
  form.avatar = ''
  form.github = ''
  form.linkedin = ''
  form.email = ''
  form.githubUsername = ''
  form.initials = ''
  form.color = '#1a1714'
  avatarPreviewError.value = false
  isDeviceAvatar.value = false
  githubStats.value = null
  githubError.value = null
  Object.keys(errors).forEach((k) => delete errors[k])
}

function close() {
  emit('update:modelValue', false)
}

// Avatar preview
const avatarPreviewSrc = computed(() => {
  if (form.avatar?.trim()) return form.avatar.trim()
  const ini = form.initials || getInitials(form.name)
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(ini)}&backgroundColor=1a1714&fontFamily=Georgia&fontSize=42&fontWeight=700&textColor=ffffff`
})

function onAvatarError() {
  avatarPreviewError.value = true
}
function onAvatarLoad() {
  avatarPreviewError.value = false
}

// Validation
function validate() {
  Object.keys(errors).forEach((k) => delete errors[k])
  if (!form.name.trim()) errors.name = 'Nama wajib diisi'
  if (!form.role.trim()) errors.role = 'Role wajib diisi'
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Format email tidak valid'
  }
  return Object.keys(errors).length === 0
}

async function handleSubmit() {
  if (!validate()) return
  isSaving.value = true

  try {
    const payload = {
      name: form.name.trim(),
      nim: form.nim.trim(),
      role: form.role.trim(),
      bio: form.bio.trim(),
      skills: form.skills,
      avatar: form.avatar.trim(),
      github: form.github.trim(),
      linkedin: form.linkedin.trim(),
      email: form.email.trim(),
      githubUsername: form.githubUsername.trim() || extractGithubUsername(form.github),
      initials: form.initials.trim() || getInitials(form.name),
      color: form.color,
    }

    let savedMember = null
    if (isEditMode.value) {
      savedMember = updateMember(props.editMember.id, payload)
      if (savedMember) {
        toast.success(`Anggota "${savedMember.name}" berhasil diperbarui!`)
        emit('updated', savedMember)
      }
    } else {
      savedMember = addMember(payload)
      toast.success(`Anggota "${savedMember.name}" berhasil ditambahkan!`)
      emit('created', savedMember)
    }

    // ── Otomatis Sinkronisasi Proyek GitHub ke Portofolio Anggota ──
    if (savedMember && autoSyncProjects.value && githubStats.value?.repos?.length > 0) {
      const synced = syncMemberGithubProjects(savedMember.id, githubStats.value.repos)
      if (synced.length > 0) {
        toast.info(`Berhasil menyinkronkan ${synced.length} repositori GitHub ke portofolio!`)
      }
    }

    if (!isEditMode.value) resetForm()
    close()
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <Modal
    :model-value="modelValue"
    :title="isEditMode ? `Edit Anggota — ${editMember?.name}` : 'Tambah Anggota Tim Baru'"
    size="lg"
    @update:model-value="close"
  >
    <form class="mm" @submit.prevent="handleSubmit">

      <!-- Info Banner -->
      <div class="mm__info-banner">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>Data anggota tersimpan <strong>persisten di peramban</strong>. Masukkan link GitHub untuk otomatis menghitung dan mengimpor proyek.</span>
      </div>

      <!-- Avatar Preview Row -->
      <div class="mm__avatar-row">
        <div class="mm__avatar-preview">
          <img
            :src="avatarPreviewSrc"
            :alt="form.name || 'Preview'"
            class="mm__avatar-img"
            @error="onAvatarError"
            @load="onAvatarLoad"
          />
          <div v-if="avatarPreviewError" class="mm__avatar-fallback">
            <span>{{ form.initials || getInitials(form.name) }}</span>
          </div>
        </div>
        <div class="mm__avatar-meta">
          <p class="mm__avatar-name">{{ form.name || 'Nama Anggota' }}</p>
          <p class="mm__avatar-role">{{ form.role || 'Role / Jabatan' }}</p>
          <span v-if="isDeviceAvatar" class="mm__badge-device">✓ Foto dari Perangkat</span>
        </div>
      </div>

      <!-- Section: Avatar / Foto Profil Upload dari Device -->
      <div class="mm__section">
        <div class="mm__section-header">
          <h3 class="mm__section-title">Foto Profil / Avatar</h3>
          <!-- Mode switcher -->
          <div class="mm__tabs-avatar">
            <button
              type="button"
              class="mm__tab-btn"
              :class="{ 'mm__tab-btn--active': avatarMode === 'upload' }"
              @click="avatarMode = 'upload'"
            >
              Upload dari Perangkat
            </button>
            <button
              type="button"
              class="mm__tab-btn"
              :class="{ 'mm__tab-btn--active': avatarMode === 'url' }"
              @click="avatarMode = 'url'"
            >
              Tempel URL
            </button>
          </div>
        </div>

        <!-- Mode Upload dari Device -->
        <div v-if="avatarMode === 'upload'" class="mm__upload-box">
          <input
            ref="avatarFileInputRef"
            type="file"
            accept="image/*"
            class="mm__sr-only"
            @change="onAvatarFileSelect"
          />
          <div class="mm__upload-dropzone" @click="triggerDeviceUpload">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <div class="mm__upload-text">
              <strong class="mm__upload-strong">Pilih atau seret foto dari perangkat</strong>
              <span class="mm__upload-sub">Format JPG, PNG, atau WebP</span>
            </div>
          </div>

          <div class="mm__upload-actions">
            <button
              type="button"
              class="mm__btn-upload-action"
              @click="triggerDeviceUpload"
            >
              Pilih File Gambar
            </button>
            <button
              v-if="githubStats?.avatarUrl"
              type="button"
              class="mm__btn-upload-action mm__btn-upload-action--github"
              @click="useGithubAvatar"
            >
              Gunakan Foto GitHub
            </button>
            <button
              v-if="form.avatar"
              type="button"
              class="mm__btn-upload-action mm__btn-upload-action--delete"
              @click="removeAvatar"
            >
              Hapus Foto
            </button>
          </div>
        </div>

        <!-- Mode URL Gambar -->
        <div v-else class="mm__field">
          <label class="mm__label">URL Foto / Avatar Publik</label>
          <input
            v-model="form.avatar"
            type="url"
            class="mm__input"
            placeholder="https://avatars.githubusercontent.com/u/..."
          />
          <p class="mm__hint-text">Gunakan URL foto publik dari GitHub, LinkedIn, atau image hosting.</p>
        </div>

        <div class="mm__grid-2">
          <div class="mm__field">
            <label class="mm__label">Inisial <span class="mm__hint">(Otomatis/Manual)</span></label>
            <input v-model="form.initials" type="text" class="mm__input" maxlength="3" placeholder="ZY" />
          </div>
          <div class="mm__field">
            <label class="mm__label">Warna Avatar Inisial</label>
            <div class="mm__color-row">
              <input v-model="form.color" type="color" class="mm__color-picker" />
              <input v-model="form.color" type="text" class="mm__input" placeholder="#1a1714" maxlength="7" />
            </div>
          </div>
        </div>
      </div>

      <!-- Section: Identitas -->
      <div class="mm__section">
        <h3 class="mm__section-title">Identitas Anggota</h3>
        <div class="mm__grid-2">
          <div class="mm__field">
            <label class="mm__label">Nama Lengkap <span class="mm__required">*</span></label>
            <input v-model="form.name" type="text" class="mm__input" :class="{ 'mm__input--error': errors.name }" placeholder="Contoh: Zulfa Yafiansyah" />
            <span v-if="errors.name" class="mm__error">{{ errors.name }}</span>
          </div>
          <div class="mm__field">
            <label class="mm__label">NIM</label>
            <input v-model="form.nim" type="text" class="mm__input" placeholder="Contoh: 102042330003" />
          </div>
        </div>
        <div class="mm__field">
          <label class="mm__label">Role / Jabatan <span class="mm__required">*</span></label>
          <input v-model="form.role" type="text" class="mm__input" :class="{ 'mm__input--error': errors.role }" placeholder="Contoh: Fullstack Developer & System Analyst" />
          <span v-if="errors.role" class="mm__error">{{ errors.role }}</span>
        </div>
        <div class="mm__field">
          <label class="mm__label">Bio / Deskripsi Diri</label>
          <textarea v-model="form.bio" class="mm__textarea" rows="3" placeholder="Ceritakan pengalaman, fokus keahlian, atau ringkasan profil..." />
        </div>
        <div class="mm__field">
          <label class="mm__label">Keahlian Teknis <span class="mm__hint">(pisahkan dengan koma)</span></label>
          <input v-model="form.skills" type="text" class="mm__input" placeholder="Contoh: Laravel, Vue.js, Figma, MySQL, Tailwind CSS" />
          <!-- Skills Preview -->
          <div v-if="form.skills" class="mm__skills-preview">
            <span
              v-for="skill in form.skills.split(',').map(s => s.trim()).filter(Boolean)"
              :key="skill"
              class="mm__skill-tag"
            >{{ skill }}</span>
          </div>
        </div>
      </div>

      <!-- Section: Sosial & GitHub Auto-Sync -->
      <div class="mm__section">
        <h3 class="mm__section-title">Sosial &amp; Akun GitHub</h3>

        <div class="mm__field">
          <label class="mm__label">Tautan / Akun GitHub <span class="mm__required">*</span></label>
          <div class="mm__input-with-action">
            <input
              v-model="form.github"
              type="text"
              class="mm__input"
              placeholder="https://github.com/username atau @username"
            />
            <button
              type="button"
              class="mm__sync-btn"
              :disabled="!form.github || isFetchingGithub"
              @click="handleGithubInput(form.github)"
            >
              <span v-if="isFetchingGithub">Memeriksa...</span>
              <span v-else>Periksa</span>
            </button>
          </div>
        </div>

        <!-- Loading indicator -->
        <div v-if="isFetchingGithub" class="mm__gh-status mm__gh-status--loading">
          <svg class="mm__spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
          <span>Mengambil data profil dan repositori dari GitHub...</span>
        </div>

        <!-- GitHub Error -->
        <div v-if="githubError" class="mm__gh-status mm__gh-status--error">
          <span>{{ githubError }}</span>
        </div>

        <!-- GitHub Stats Box -->
        <div v-if="githubStats" class="mm__gh-card">
          <div class="mm__gh-card__header">
            <div class="mm__gh-card__user">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              <span>GitHub: <strong>@{{ githubStats.username }}</strong></span>
            </div>
            <span class="mm__gh-card__badge-live">Tersinkronisasi</span>
          </div>

          <!-- Stats 3 Columns -->
          <div class="mm__gh-metrics">
            <div class="mm__gh-metric">
              <span class="mm__gh-metric__val">{{ githubStats.total }}</span>
              <span class="mm__gh-metric__lbl">Total Proyek</span>
            </div>
            <div class="mm__gh-metric">
              <span class="mm__gh-metric__val">{{ githubStats.personal }}</span>
              <span class="mm__gh-metric__lbl">Personal</span>
            </div>
            <div class="mm__gh-metric">
              <span class="mm__gh-metric__val">{{ githubStats.team }}</span>
              <span class="mm__gh-metric__lbl">Team Project</span>
            </div>
          </div>

          <!-- Auto-Sync Checkbox -->
          <label class="mm__sync-check">
            <input v-model="autoSyncProjects" type="checkbox" />
            <span>Otomatis sinkronisasikan dan daftarkan repositori GitHub ini ke portofolio proyek anggota</span>
          </label>
        </div>

        <div class="mm__grid-2">
          <div class="mm__field">
            <label class="mm__label">LinkedIn URL</label>
            <input v-model="form.linkedin" type="url" class="mm__input" placeholder="https://linkedin.com/in/username" />
          </div>
          <div class="mm__field">
            <label class="mm__label">Email</label>
            <input v-model="form.email" type="email" class="mm__input" :class="{ 'mm__input--error': errors.email }" placeholder="nama@email.com" />
            <span v-if="errors.email" class="mm__error">{{ errors.email }}</span>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="mm__footer">
        <Button variant="ghost" as="button" type="button" @click="close">Batal</Button>
        <button type="submit" class="mm__save-btn" :disabled="isSaving">
          <span v-if="isSaving">Menyimpan...</span>
          <span v-else-if="isEditMode">Simpan Perubahan</span>
          <span v-else>Tambah Anggota</span>
        </button>
      </div>
    </form>
  </Modal>
</template>

<style scoped>
.mm {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

/* Info Banner */
.mm__info-banner {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: color-mix(in srgb, var(--color-highlight) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-highlight) 25%, transparent);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.5;
}
.mm__info-banner svg { flex-shrink: 0; color: var(--color-highlight); margin-top: 2px; }

/* Avatar Preview Row */
.mm__avatar-row {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-md);
}
.mm__avatar-preview {
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: var(--radius-md);
  overflow: hidden;
  flex-shrink: 0;
  background: var(--color-bg-elevated);
  border: 2px solid var(--color-border);
}
.mm__avatar-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.mm__avatar-fallback {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; font-weight: 800;
  background: var(--color-bg-elevated);
  color: var(--color-text);
}
.mm__avatar-meta { flex: 1; }
.mm__avatar-name { font-size: var(--text-base); font-weight: 700; color: var(--color-text); margin: 0 0 4px; }
.mm__avatar-role { font-size: var(--text-sm); color: var(--color-highlight); margin: 0; }
.mm__badge-device {
  display: inline-block;
  margin-top: 4px;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-highlight);
  background: var(--color-highlight-subtle);
  padding: 1px 8px;
  border-radius: var(--radius-sm);
  border: 1px solid color-mix(in srgb, var(--color-highlight) 25%, transparent);
}

/* Section */
.mm__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-5);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-md);
  background: var(--color-bg-alt);
}
.mm__section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.mm__section-title {
  font-size: var(--text-sm);
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin: 0;
}

/* Tabs Avatar */
.mm__tabs-avatar {
  display: flex;
  gap: 4px;
  background: var(--color-bg);
  border: 1px solid var(--color-border-subtle);
  padding: 2px;
  border-radius: var(--radius-sm);
}
.mm__tab-btn {
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 600;
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.mm__tab-btn--active {
  background: var(--color-bg-elevated);
  color: var(--color-text);
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}

/* Upload from Device Box */
.mm__upload-box {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.mm__sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0); border: 0;
}
.mm__upload-dropzone {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-5);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-elevated);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.mm__upload-dropzone:hover {
  border-color: var(--color-highlight);
  background: color-mix(in srgb, var(--color-highlight) 4%, transparent);
}
.mm__upload-dropzone svg {
  color: var(--color-highlight);
  flex-shrink: 0;
}
.mm__upload-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.mm__upload-strong {
  font-size: var(--text-sm);
  color: var(--color-text);
}
.mm__upload-sub {
  font-size: 11px;
  color: var(--color-text-muted);
}
.mm__upload-actions {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}
.mm__btn-upload-action {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-xs);
  font-weight: 600;
  background: var(--color-bg-elevated);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.mm__btn-upload-action:hover {
  background: var(--color-bg);
  border-color: var(--color-text);
}
.mm__btn-upload-action--github {
  background: var(--color-bg-alt);
  color: var(--color-text);
  border-color: var(--color-border);
}
.mm__btn-upload-action--github:hover {
  background: var(--color-bg);
  border-color: var(--color-text);
}
.mm__btn-upload-action--delete {
  background: var(--color-bg-alt);
  color: #ef4444;
  border-color: var(--color-border-subtle);
}
.mm__btn-upload-action--delete:hover {
  background: color-mix(in srgb, #ef4444 8%, transparent);
  border-color: #ef4444;
}

/* Grid */
.mm__grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}
@media (max-width: 540px) { .mm__grid-2 { grid-template-columns: 1fr; } }

/* Fields */
.mm__field { display: flex; flex-direction: column; gap: var(--space-1); }
.mm__label {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-secondary);
}
.mm__required { color: var(--color-highlight); }
.mm__hint { font-weight: 400; color: var(--color-text-muted); font-size: 11px; }
.mm__hint-text { font-size: var(--text-xs); color: var(--color-text-muted); margin: 2px 0 0; }

.mm__input, .mm__textarea {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-elevated);
  color: var(--color-text);
  font-size: var(--text-sm);
  font-family: inherit;
  transition: border-color var(--transition-fast);
  box-sizing: border-box;
}
.mm__input:focus, .mm__textarea:focus {
  outline: none;
  border-color: var(--color-highlight);
}
.mm__input--error { border-color: #ef4444; }
.mm__textarea { resize: vertical; min-height: 80px; }
.mm__error { font-size: var(--text-xs); color: #ef4444; }

/* Input with action */
.mm__input-with-action {
  display: flex;
  gap: var(--space-2);
}
.mm__sync-btn {
  padding: var(--space-2) var(--space-4);
  background: var(--color-text);
  color: var(--color-bg);
  border: none;
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity var(--transition-fast);
}
.mm__sync-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* GitHub Status */
.mm__gh-status {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
}
.mm__gh-status--loading {
  background: var(--color-bg-alt);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border-subtle);
}
.mm__gh-status--error {
  background: color-mix(in srgb, #ef4444 8%, transparent);
  color: #ef4444;
  border: 1px solid color-mix(in srgb, #ef4444 20%, transparent);
}
.mm__spin {
  animation: mmSpin 1s linear infinite;
}
@keyframes mmSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* GitHub Stats Card */
.mm__gh-card {
  padding: var(--space-4);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.mm__gh-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mm__gh-card__user {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-xs);
  color: var(--color-text);
}
.mm__gh-card__user strong { color: var(--color-text); }
.mm__gh-card__badge-live {
  font-size: 10px;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Metrics 3 Columns */
.mm__gh-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-2);
}
.mm__gh-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--space-2);
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-sm);
}
.mm__gh-metric__val {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 800;
  color: var(--color-text);
  line-height: 1;
}
.mm__gh-metric__lbl {
  font-size: 10px;
  color: var(--color-text-muted);
  margin-top: 3px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.mm__sync-check {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  font-size: 11px;
  color: var(--color-text-secondary);
  cursor: pointer;
  line-height: 1.4;
}

/* Skills Preview */
.mm__skills-preview {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  margin-top: var(--space-1);
}
.mm__skill-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--color-highlight) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-highlight) 25%, transparent);
  color: var(--color-highlight);
}

/* Color Row */
.mm__color-row { display: flex; align-items: center; gap: var(--space-2); }
.mm__color-picker {
  width: 40px;
  height: 36px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 2px;
  cursor: pointer;
  background: var(--color-bg-elevated);
  flex-shrink: 0;
}

/* Footer */
.mm__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border-subtle);
}
.mm__save-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-6);
  background: var(--color-text);
  color: var(--color-bg);
  border: none;
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  font-weight: 700;
  cursor: pointer;
  transition: opacity var(--transition-fast);
}
.mm__save-btn:hover:not(:disabled) { opacity: 0.85; }
.mm__save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
