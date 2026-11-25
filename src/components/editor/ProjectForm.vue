<script setup>
// Edits one project draft. Mutates the object passed in.
import ListField from './ListField.vue'

const props = defineProps({
  project: { type: Object, required: true },
  memberNames: { type: Array, default: () => [] },
})

function addContribution() {
  props.project.contributions ||= []
  props.project.contributions.push({ member: props.memberNames[0] || '', task: '' })
}

function removeContribution(index) {
  props.project.contributions.splice(index, 1)
}
</script>

<template>
  <div>
    <section class="ed-section">
      <h3 class="ed-section__title">Info Kartu</h3>
      <div class="ed-grid ed-grid--3">
        <label class="ed-field ed-full">
          <span class="ed-label">Judul *</span>
          <input v-model="project.title" class="ed-input" type="text" required />
        </label>
        <label class="ed-field">
          <span class="ed-label">Kategori</span>
          <input v-model="project.category" class="ed-input" type="text" />
        </label>
        <label class="ed-field">
          <span class="ed-label">Tahun</span>
          <input v-model="project.year" class="ed-input" type="text" inputmode="numeric" />
        </label>
        <label class="ed-check featured">
          <input v-model="project.featured" type="checkbox" />
          Tampil di beranda
        </label>
        <label class="ed-field ed-full">
          <span class="ed-label">Ringkasan</span>
          <textarea v-model="project.summary" class="ed-textarea" rows="2" />
        </label>
        <div class="ed-full">
          <ListField v-model="project.technologies" label="Teknologi" separator="comma" :rows="2" />
        </div>
      </div>
    </section>

    <section class="ed-section">
      <h3 class="ed-section__title">Detail</h3>
      <div class="ed-grid">
        <label class="ed-field ed-full">
          <span class="ed-label">Latar Belakang</span>
          <textarea v-model="project.background" class="ed-textarea" rows="3" />
        </label>
        <ListField v-model="project.goals" label="Tujuan" />
        <ListField v-model="project.features" label="Fitur" />
        <div class="ed-full">
          <ListField v-model="project.gallery" label="Dokumentasi Visual (path gambar, contoh: /images/projects/kopi-1.jpg)" :rows="3" />
        </div>
      </div>
    </section>

    <section class="ed-section">
      <div class="ed-section__head">
        <h3 class="ed-section__title">Kontribusi Anggota</h3>
        <button type="button" class="ed-btn" @click="addContribution">+ Tambah</button>
      </div>
      <div class="ed-rows">
        <div v-for="(c, i) in project.contributions" :key="i" class="ed-row contrib-row">
          <label class="ed-field">
            <span class="ed-label">Anggota</span>
            <select v-model="c.member" class="ed-select">
              <option v-if="c.member && !memberNames.includes(c.member)" :value="c.member">{{ c.member }} (tidak ada di tim)</option>
              <option v-for="name in memberNames" :key="name" :value="name">{{ name }}</option>
            </select>
          </label>
          <label class="ed-field">
            <span class="ed-label">Tugas</span>
            <input v-model="c.task" class="ed-input" type="text" />
          </label>
          <button type="button" class="ed-btn ed-btn--danger ed-btn--icon row-del" :aria-label="`Hapus kontribusi ${c.member}`" @click="removeContribution(i)">&times;</button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.featured {
  align-self: end;
  padding-bottom: 10px;
}

.contrib-row {
  grid-template-columns: 180px 1fr auto;
}

.row-del {
  margin-top: 22px;
}

@media (max-width: 720px) {
  .contrib-row {
    grid-template-columns: 1fr auto;
  }
  .contrib-row .ed-field:first-child {
    grid-column: 1 / -1;
  }
}
</style>
