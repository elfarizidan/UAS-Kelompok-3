<script setup>
// Edits team identity, values, and stats. Mutates the draft object passed in.
const props = defineProps({
  team: { type: Object, required: true },
})

const identityFields = [
  { key: 'name', label: 'Nama Tim' },
  { key: 'codename', label: 'Codename' },
  { key: 'tagline', label: 'Tagline', full: true },
  { key: 'summary', label: 'Ringkasan', full: true, textarea: true },
  { key: 'mission', label: 'Misi', full: true, textarea: true },
]

const contactFields = [
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'location', label: 'Lokasi' },
  { key: 'github', label: 'GitHub URL', type: 'url' },
  { key: 'linkedin', label: 'LinkedIn URL', type: 'url' },
]

function addValue() {
  props.team.values ||= []
  const code = String(props.team.values.length + 1).padStart(2, '0')
  props.team.values.push({ code, title: '', description: '' })
}

function addStat() {
  props.team.stats ||= []
  props.team.stats.push({ label: '', value: '' })
}

function remove(list, index) {
  list.splice(index, 1)
}
</script>

<template>
  <div>
    <section class="ed-section">
      <h3 class="ed-section__title">Identitas</h3>
      <div class="ed-grid">
        <label v-for="f in identityFields" :key="f.key" class="ed-field" :class="{ 'ed-full': f.full }">
          <span class="ed-label">{{ f.label }}</span>
          <textarea v-if="f.textarea" v-model="team[f.key]" class="ed-textarea" rows="3" />
          <input v-else v-model="team[f.key]" class="ed-input" type="text" />
        </label>
      </div>
    </section>

    <section class="ed-section">
      <h3 class="ed-section__title">Kontak Tim</h3>
      <div class="ed-grid">
        <label v-for="f in contactFields" :key="f.key" class="ed-field">
          <span class="ed-label">{{ f.label }}</span>
          <input v-model="team[f.key]" class="ed-input" :type="f.type || 'text'" />
        </label>
      </div>
    </section>

    <section class="ed-section">
      <div class="ed-section__head">
        <h3 class="ed-section__title">Nilai &amp; Fokus</h3>
        <button type="button" class="ed-btn" @click="addValue">+ Tambah</button>
      </div>
      <div class="ed-rows">
        <div v-for="(v, i) in team.values" :key="i" class="ed-row values-row">
          <label class="ed-field">
            <span class="ed-label">Kode</span>
            <input v-model="v.code" class="ed-input" type="text" />
          </label>
          <label class="ed-field">
            <span class="ed-label">Judul</span>
            <input v-model="v.title" class="ed-input" type="text" />
          </label>
          <button type="button" class="ed-btn ed-btn--danger ed-btn--icon row-del" :aria-label="`Hapus nilai ${v.title}`" @click="remove(team.values, i)">&times;</button>
          <label class="ed-field ed-full">
            <span class="ed-label">Deskripsi</span>
            <textarea v-model="v.description" class="ed-textarea" rows="2" />
          </label>
        </div>
      </div>
    </section>

    <section class="ed-section">
      <div class="ed-section__head">
        <h3 class="ed-section__title">Statistik Beranda</h3>
        <button type="button" class="ed-btn" @click="addStat">+ Tambah</button>
      </div>
      <div class="ed-rows">
        <div v-for="(s, i) in team.stats" :key="i" class="ed-row stats-row">
          <label class="ed-field">
            <span class="ed-label">Angka</span>
            <input v-model="s.value" class="ed-input" type="text" />
          </label>
          <label class="ed-field">
            <span class="ed-label">Label</span>
            <input v-model="s.label" class="ed-input" type="text" />
          </label>
          <button type="button" class="ed-btn ed-btn--danger ed-btn--icon row-del" :aria-label="`Hapus statistik ${s.label}`" @click="remove(team.stats, i)">&times;</button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.values-row {
  grid-template-columns: 90px 1fr auto;
}

.stats-row {
  grid-template-columns: 120px 1fr auto;
}

.row-del {
  margin-top: 22px;
}
</style>
