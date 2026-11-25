<script setup>
import { getProject } from '@/services/api'
import { useAsync } from '@/composables/useAsync'
import AsyncState from '@/components/AsyncState.vue'
import BgWord from '@/components/BgWord.vue'
import VisualPlaceholder from '@/components/VisualPlaceholder.vue'

const props = defineProps({
  id: { type: String, required: true },
})

const project = useAsync(() => getProject(props.id), () => props.id)
</script>

<template>
  <div>
    <section class="section section--dark detail-head">
      <div class="container">
        <RouterLink to="/proyek" class="back">Kembali ke Proyek</RouterLink>
        <AsyncState :loading="project.loading.value" :error="project.error.value" :skeletons="1" @retry="project.reload">
          <div v-if="project.data.value" class="head">
            <div class="head__meta">
              <span class="chip chip--red">{{ project.data.value.category }}</span>
              <span class="head__year">{{ project.data.value.year }}</span>
            </div>
            <h1 class="head__title">{{ project.data.value.title }}</h1>
            <p class="lead">{{ project.data.value.summary }}</p>
          </div>
        </AsyncState>
      </div>
    </section>

    <template v-if="project.data.value">
      <!-- Background & goals -->
      <section class="section section--light section--framed">
        <BgWord text="Brief" />
        <div class="container two-col">
          <div class="block">
            <span class="block__no">01</span>
            <h2 class="block__title">Latar Belakang</h2>
            <p>{{ project.data.value.background }}</p>
          </div>
          <div class="block">
            <span class="block__no">02</span>
            <h2 class="block__title">Tujuan</h2>
            <ul class="list">
              <li v-for="goal in project.data.value.goals" :key="goal">{{ goal }}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Features & tech -->
      <section class="section section--dark">
        <div class="container two-col">
          <div class="block">
            <span class="block__no">03</span>
            <h2 class="block__title">Fitur</h2>
            <ul class="features">
              <li v-for="(f, i) in project.data.value.features" :key="f" class="feature">
                <span class="feature__no">{{ String(i + 1).padStart(2, '0') }}</span>
                <span>{{ f }}</span>
              </li>
            </ul>
          </div>
          <div class="block">
            <span class="block__no">04</span>
            <h2 class="block__title">Teknologi</h2>
            <ul class="tech">
              <li v-for="tech in project.data.value.technologies" :key="tech">{{ tech }}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Gallery -->
      <section class="section section--light section--framed">
        <div class="container">
          <div class="block">
            <span class="block__no">05</span>
            <h2 class="block__title">Dokumentasi Visual</h2>
          </div>
          <div class="gallery">
            <VisualPlaceholder
              v-for="(shot, i) in project.data.value.gallery"
              :key="shot"
              :label="shot"
              :index="i"
              class="gallery__item"
            />
          </div>
        </div>
      </section>

      <!-- Contributions -->
      <section class="section section--red">
        <div class="container">
          <div class="block">
            <span class="block__no block__no--dark">06</span>
            <h2 class="block__title">Kontribusi Anggota</h2>
          </div>
          <ul class="contrib">
            <li v-for="c in project.data.value.contributions" :key="c.member" class="contrib__row">
              <span class="contrib__name">{{ c.member }}</span>
              <span class="contrib__task">{{ c.task }}</span>
            </li>
          </ul>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.detail-head {
  padding-top: 48px;
}

.back {
  display: inline-block;
  margin-bottom: 32px;
  font-family: var(--font-cond);
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-size: 0.85rem;
  text-decoration: none;
  color: var(--muted);
}

.back::before {
  content: '/ ';
  color: var(--red);
}

.back:hover {
  color: var(--white);
}

.head {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.head__meta {
  display: flex;
  align-items: center;
  gap: 14px;
}

.head__year {
  font-family: var(--font-cond);
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--muted);
}

.head__title {
  font-size: clamp(3rem, 9vw, 7rem);
  color: var(--white);
}

.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(32px, 6vw, 80px);
}

.block {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.block__no {
  font-family: var(--font-display);
  font-size: 1.1rem;
  letter-spacing: 0.2em;
  color: var(--red);
}

.block__no--dark {
  color: var(--navy);
}

.block__title {
  font-size: clamp(2rem, 4vw, 3rem);
  margin-bottom: 8px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.list li {
  position: relative;
  padding-left: 24px;
}

.list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 10px;
  height: 10px;
  background: var(--red);
  transform: rotate(45deg);
}

.features {
  display: flex;
  flex-direction: column;
}

.feature {
  display: flex;
  gap: 18px;
  align-items: baseline;
  padding: 14px 0;
  border-bottom: 1px solid rgba(236, 232, 225, 0.12);
}

.feature__no {
  font-family: var(--font-display);
  color: var(--red);
}

.tech {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.tech li {
  padding: 16px 18px;
  background: var(--navy-2);
  border-left: 4px solid var(--red);
  font-family: var(--font-cond);
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.gallery {
  margin-top: 24px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-auto-rows: auto;
  gap: 20px;
}

.gallery__item:first-child {
  grid-row: span 2;
  aspect-ratio: auto;
  height: 100%;
}

.contrib {
  margin-top: 16px;
  border-top: 2px solid var(--navy);
}

.contrib__row {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 20px;
  padding: 18px 0;
  border-bottom: 1px solid rgba(15, 25, 35, 0.3);
  align-items: baseline;
}

.contrib__name {
  font-family: var(--font-display);
  font-size: 1.7rem;
  text-transform: uppercase;
}

.contrib__task {
  font-size: 1.05rem;
}

@media (max-width: 860px) {
  .two-col {
    grid-template-columns: 1fr;
  }
  .gallery {
    grid-template-columns: 1fr;
  }
  .gallery__item:first-child {
    grid-row: auto;
    aspect-ratio: 16 / 10;
  }
  .contrib__row {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}
</style>
