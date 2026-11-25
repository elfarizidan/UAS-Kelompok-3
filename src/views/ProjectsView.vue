<script setup>
import { computed, ref } from 'vue'
import { getProjects } from '@/services/api'
import { useAsync } from '@/composables/useAsync'
import SectionHeading from '@/components/SectionHeading.vue'
import BgWord from '@/components/BgWord.vue'
import AsyncState from '@/components/AsyncState.vue'
import ProjectCard from '@/components/ProjectCard.vue'

const projects = useAsync(getProjects)
const active = ref('Semua')

const categories = computed(() => {
  const set = new Set((projects.data.value || []).map((p) => p.category))
  return ['Semua', ...set]
})

const filtered = computed(() => {
  const list = projects.data.value || []
  return active.value === 'Semua' ? list : list.filter((p) => p.category === active.value)
})
</script>

<template>
  <div>
    <section class="section section--dark page-head">
      <BgWord text="Arsenal" />
      <div class="container">
        <SectionHeading
          eyebrow="Project Showcase"
          title="Daftar Proyek"
          subtitle="Kumpulan proyek tim: dari riset UX, desain antarmuka, hingga aplikasi yang berjalan."
        />
        <div v-if="projects.data.value" class="filters" role="group" aria-label="Filter kategori">
          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            class="filter"
            :class="{ 'is-active': active === cat }"
            :aria-pressed="active === cat"
            @click="active = cat"
          >
            {{ cat }}
          </button>
        </div>
      </div>
    </section>

    <section class="section section--light section--framed">
      <div class="container">
        <AsyncState :loading="projects.loading.value" :error="projects.error.value" :skeletons="6" @retry="projects.reload">
          <p class="count">{{ filtered.length }} proyek</p>
          <div class="grid-projects">
            <ProjectCard v-for="(p, i) in filtered" :key="p.id" :project="p" :index="i" />
          </div>
        </AsyncState>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-head {
  padding-bottom: 48px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.filter {
  padding: 10px 18px;
  border: 1px solid rgba(236, 232, 225, 0.3);
  background: transparent;
  color: var(--cream);
  font-family: var(--font-cond);
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s var(--ease), border-color 0.2s var(--ease);
}

.filter:hover {
  border-color: var(--red);
}

.filter.is-active {
  background: var(--red);
  border-color: var(--red);
  color: var(--white);
}

.count {
  margin-bottom: 20px;
  font-family: var(--font-cond);
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-size: 0.85rem;
  color: var(--muted-light);
}

.grid-projects {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 32px;
}
</style>
