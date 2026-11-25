<script setup>
import VisualPlaceholder from './VisualPlaceholder.vue'

defineProps({
  project: { type: Object, required: true },
  index: { type: Number, default: 0 },
})
</script>

<template>
  <article class="card">
    <RouterLink :to="`/proyek/${project.id}`" class="card__link">
      <div class="card__media">
        <VisualPlaceholder :label="project.gallery?.[0] || project.title" :index="index" />
        <span class="card__cat chip chip--red">{{ project.category }}</span>
      </div>
      <div class="card__body">
        <span class="card__year">{{ project.year }}</span>
        <h3 class="card__title">{{ project.title }}</h3>
        <p class="card__summary">{{ project.summary }}</p>
        <ul class="chips" aria-label="Teknologi">
          <li v-for="tech in project.technologies" :key="tech" class="chip">{{ tech }}</li>
        </ul>
        <span class="card__more">Lihat Detail</span>
      </div>
    </RouterLink>
  </article>
</template>

<style scoped>
.card {
  position: relative;
  background: var(--white);
  color: var(--navy);
  box-shadow: 8px 8px 0 var(--red);
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - var(--cut)), calc(100% - var(--cut)) 100%, 0 100%);
  transition: transform 0.25s var(--ease), box-shadow 0.25s var(--ease);
}

.card:hover {
  transform: translate(-3px, -3px);
}

.card__link {
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
  color: inherit;
}

.card__media {
  position: relative;
  border-bottom: 4px solid var(--red);
}

.card__cat {
  position: absolute;
  top: 12px;
  left: 12px;
}

.card__body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 22px 26px;
  flex: 1;
}

.card__year {
  font-family: var(--font-cond);
  font-weight: 700;
  letter-spacing: 0.16em;
  font-size: 0.8rem;
  color: var(--red);
}

.card__title {
  font-size: 1.7rem;
}

.card__summary {
  font-size: 0.95rem;
  color: var(--muted-light);
}

.card__more {
  margin-top: auto;
  padding-top: 8px;
  font-family: var(--font-cond);
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-size: 0.85rem;
  color: var(--red);
}

.card__more::after {
  content: ' /';
}

.card__link:hover .card__title {
  color: var(--red);
}
</style>
