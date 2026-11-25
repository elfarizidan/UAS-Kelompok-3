<script setup>
// Edits team.members inside the team draft.
import { computed, ref } from 'vue'
import ListField from './ListField.vue'

const props = defineProps({
  team: { type: Object, required: true },
})

const selected = ref(props.team.members?.[0]?.id ?? null)
const member = computed(() => (props.team.members || []).find((m) => m.id === selected.value))

const fields = [
  { key: 'name', label: 'Nama' },
  { key: 'role', label: 'Peran' },
  { key: 'agentClass', label: 'Kelas (label kecil)' },
  { key: 'avatar', label: 'Foto', hint: 'Contoh: /images/members/zidan.jpg. Kosongkan untuk inisial.' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'github', label: 'GitHub URL', type: 'url' },
  { key: 'linkedin', label: 'LinkedIn URL', type: 'url' },
]

function addMember() {
  props.team.members ||= []
  const nextId = String(Math.max(0, ...props.team.members.map((m) => Number(m.id) || 0)) + 1)
  props.team.members.push({
    id: nextId,
    name: 'Anggota Baru',
    role: '',
    agentClass: '',
    bio: '',
    skills: [],
    avatar: '',
    email: '',
    github: '',
    linkedin: '',
  })
  selected.value = nextId
}

function removeMember() {
  if (!member.value) return
  if (!window.confirm(`Hapus anggota "${member.value.name}" dari draft? Perubahan baru tersimpan setelah klik Simpan.`)) return
  const list = props.team.members
  const index = list.findIndex((m) => m.id === selected.value)
  list.splice(index, 1)
  selected.value = list[Math.max(0, index - 1)]?.id ?? null
}
</script>

<template>
  <div class="ed-split">
    <div>
      <div class="ed-list" role="listbox" aria-label="Daftar anggota">
        <button
          v-for="m in team.members"
          :key="m.id"
          type="button"
          class="ed-list__item"
          :class="{ 'is-active': m.id === selected }"
          role="option"
          :aria-selected="m.id === selected"
          @click="selected = m.id"
        >
          {{ m.name || '(tanpa nama)' }}
        </button>
      </div>
      <button type="button" class="ed-btn ed-list__add" @click="addMember">+ Anggota</button>
    </div>

    <div v-if="member">
      <section class="ed-section">
        <div class="ed-section__head">
          <h3 class="ed-section__title">{{ member.name || 'Anggota' }}</h3>
          <button type="button" class="ed-btn ed-btn--danger" @click="removeMember">Hapus Anggota</button>
        </div>
        <div class="ed-grid">
          <label v-for="f in fields" :key="f.key" class="ed-field">
            <span class="ed-label">{{ f.label }}</span>
            <input v-model="member[f.key]" class="ed-input" :type="f.type || 'text'" />
            <span v-if="f.hint" class="ed-hint">{{ f.hint }}</span>
          </label>
          <label class="ed-field ed-full">
            <span class="ed-label">Bio Singkat</span>
            <textarea v-model="member.bio" class="ed-textarea" rows="3" />
          </label>
          <div class="ed-full">
            <ListField v-model="member.skills" label="Keahlian" separator="comma" :rows="2" />
          </div>
        </div>
      </section>
    </div>
    <p v-else class="ed-empty">Belum ada anggota. Klik + Anggota.</p>
  </div>
</template>
