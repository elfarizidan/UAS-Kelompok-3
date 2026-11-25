<script setup>
import { computed } from 'vue'
import { getTeam, getMembers, getProjects } from '@/services/api'
import { useAsync } from '@/composables/useAsync'
import SectionHeading from '@/components/SectionHeading.vue'
import BgWord from '@/components/BgWord.vue'
import AsyncState from '@/components/AsyncState.vue'
import AgentCard from '@/components/AgentCard.vue'
import ProjectCard from '@/components/ProjectCard.vue'

const team = useAsync(getTeam)
const members = useAsync(getMembers)
const projects = useAsync(getProjects)

const featured = computed(() => (projects.data.value || []).filter((p) => p.featured).slice(0, 3))
const teamName = computed(() => team.data.value?.name || 'Kelompok 3')
</script>

<template>
  <div>
    <!-- HERO -->
    <section class="hero">
      <div class="container hero__inner">
        <span class="hero__eyebrow">Portofolio Tim &middot; UI/UX Lanjut</span>
        <div class="hero__stack">
          <span class="hero__echo hero__echo--top" aria-hidden="true">{{ teamName }}</span>
          <h1 class="hero__title">{{ teamName }}</h1>
          <span class="hero__echo hero__echo--bottom" aria-hidden="true">{{ teamName }}</span>
        </div>
        <p class="hero__tagline">
          {{ team.data.value?.tagline || 'Memuat identitas tim...' }}
        </p>
        <div class="hero__actions">
          <span class="btn-frame"><RouterLink to="/proyek" class="btn btn--light">Lihat Proyek</RouterLink></span>
          <RouterLink to="/tim" class="hero__link">Kenali Tim</RouterLink>
        </div>
      </div>
      <div class="hero__strip">
        <div class="container hero__stats">
          <template v-if="team.data.value">
            <div v-for="stat in team.data.value.stats" :key="stat.label" class="stat">
              <span class="stat__value">{{ stat.value }}</span>
              <span class="stat__label">{{ stat.label }}</span>
            </div>
          </template>
          <span v-else-if="team.error.value" class="stat__label">Data tim gagal dimuat</span>
        </div>
      </div>
    </section>

    <!-- SUMMARY -->
    <section class="section section--light section--framed">
      <BgWord text="Tentang" />
      <div class="container">
        <AsyncState :loading="team.loading.value" :error="team.error.value" :skeletons="2" @retry="team.reload">
          <div v-if="team.data.value" class="summary">
            <div class="summary__text">
              <span class="eyebrow">Ringkasan</span>
              <h2 class="summary__title">Presisi desain,<br />kerja sama tim</h2>
              <p class="lead">{{ team.data.value.summary }}</p>
              <RouterLink to="/tim" class="btn">Profil Tim</RouterLink>
            </div>
            <div class="summary__panel">
              <span class="summary__label">Misi</span>
              <p class="summary__mission">{{ team.data.value.mission }}</p>
            </div>
          </div>
        </AsyncState>
      </div>
    </section>

    <!-- VALUES -->
    <section class="section section--dark">
      <div class="container">
        <SectionHeading eyebrow="Nilai &amp; Fokus" title="Cara Kami Bermain" subtitle="Prinsip yang kami pegang di setiap proyek." />
        <AsyncState :loading="team.loading.value" :error="team.error.value" :skeletons="4" @retry="team.reload">
          <ul v-if="team.data.value" class="values">
            <li v-for="value in team.data.value.values" :key="value.code" class="value">
              <span class="value__code">{{ value.code }}</span>
              <h3 class="value__title">{{ value.title }}</h3>
              <p class="value__desc">{{ value.description }}</p>
            </li>
          </ul>
        </AsyncState>
      </div>
    </section>

    <!-- AGENTS -->
    <section class="section section--dark agents-section">
      <div class="container">
        <SectionHeading eyebrow="Roster" title="Temui Agen Kami" subtitle="Lima anggota dengan peran berbeda yang saling melengkapi." />
        <AsyncState :loading="members.loading.value" :error="members.error.value" :skeletons="5" @retry="members.reload">
          <div class="agents">
            <AgentCard v-for="(m, i) in members.data.value" :key="m.id" :member="m" :index="i" />
          </div>
        </AsyncState>
      </div>
    </section>

    <!-- FEATURED PROJECTS -->
    <section class="section section--light section--framed">
      <BgWord text="Proyek" position="bottom" />
      <div class="container">
        <SectionHeading eyebrow="Highlight" title="Proyek Pilihan" subtitle="Beberapa karya terbaik yang kami kerjakan bersama." />
        <AsyncState :loading="projects.loading.value" :error="projects.error.value" @retry="projects.reload">
          <div class="projects">
            <ProjectCard v-for="(p, i) in featured" :key="p.id" :project="p" :index="i" />
          </div>
          <p v-if="!featured.length" class="empty">Belum ada proyek yang ditandai featured.</p>
        </AsyncState>
        <div class="center">
          <RouterLink to="/proyek" class="btn">Semua Proyek</RouterLink>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section section--red cta">
      <div class="container cta__inner">
        <div>
          <span class="eyebrow">Siap Kolaborasi?</span>
          <h2 class="cta__title">Punya ide proyek?</h2>
        </div>
        <RouterLink to="/kontak" class="btn btn--dark">Hubungi Kami</RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ---------- Hero ---------- */
.hero {
  position: relative;
  min-height: calc(100vh - 68px);
  min-height: calc(100svh - 68px);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  color: var(--white);
  background:
    linear-gradient(180deg, rgba(15, 25, 35, 0) 55%, rgba(15, 25, 35, 0.35) 100%),
    repeating-linear-gradient(115deg, rgba(255, 255, 255, 0.04) 0 2px, transparent 2px 40px),
    linear-gradient(165deg, #ff5a68 0%, var(--red) 40%, var(--red-dark) 100%);
}

.hero__inner {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding-top: 64px;
  padding-bottom: 64px;
}

/* Title with outlined echoes stacked above and below */
.hero__stack {
  --title-size: clamp(3.2rem, 15vw, 13rem);
  position: relative;
  display: grid;
  justify-items: center;
  margin: 0.55em 0;
  font-size: var(--title-size);
}

.hero__echo {
  position: absolute;
  left: 50%;
  font-family: var(--font-display);
  font-size: 1em;
  line-height: 0.85;
  text-transform: uppercase;
  white-space: nowrap;
  color: transparent;
  -webkit-text-stroke: 2px rgba(255, 255, 255, 0.28);
  pointer-events: none;
  user-select: none;
}

.hero__echo--top {
  top: 0;
  transform: translate(-50%, -72%);
}

.hero__echo--bottom {
  bottom: 0;
  transform: translate(-50%, 72%);
  -webkit-text-stroke-color: rgba(15, 25, 35, 0.3);
}

.hero__eyebrow {
  position: relative;
  z-index: 1;
  font-family: var(--font-cond);
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  font-size: 0.9rem;
  padding: 6px 14px;
  background: var(--navy);
}

.hero__title {
  position: relative;
  font-size: 1em;
  line-height: 0.85;
  white-space: nowrap;
  text-shadow: 0 8px 40px rgba(15, 25, 35, 0.35);
}

.hero__tagline {
  margin-top: 20px;
  max-width: 44ch;
  font-size: clamp(1rem, 1.6vw, 1.2rem);
  font-weight: 500;
}

.hero__actions {
  margin-top: 36px;
  display: flex;
  align-items: center;
  gap: 28px;
  flex-wrap: wrap;
  justify-content: center;
}

.hero__link {
  font-family: var(--font-cond);
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  text-decoration: none;
  border-bottom: 2px solid var(--white);
  padding-bottom: 2px;
}

.hero__link:hover {
  color: var(--navy);
  border-color: var(--navy);
}

.hero__strip {
  position: relative;
  z-index: 1;
  background: var(--red-dark);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.hero__stats {
  min-height: 92px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 24px;
  flex-wrap: wrap;
  padding-top: 16px;
  padding-bottom: 16px;
}

.stat {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.stat__value {
  font-family: var(--font-display);
  font-size: 2.6rem;
  line-height: 1;
}

.stat__label {
  font-family: var(--font-cond);
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-size: 0.85rem;
}

/* ---------- Summary ---------- */
.summary {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: clamp(32px, 6vw, 80px);
  align-items: center;
}

.summary__text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
}

.summary__title {
  font-size: clamp(2.4rem, 5vw, 3.8rem);
}

.summary__panel {
  position: relative;
  padding: 40px 36px;
  background: var(--navy);
  color: var(--cream);
  box-shadow: 14px 14px 0 var(--red);
  clip-path: polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%);
}

.summary__label {
  font-family: var(--font-display);
  font-size: 1.1rem;
  letter-spacing: 0.2em;
  color: var(--red);
}

.summary__mission {
  margin-top: 14px;
  font-family: var(--font-cond);
  font-weight: 600;
  font-size: clamp(1.3rem, 2.2vw, 1.7rem);
  line-height: 1.25;
}

/* ---------- Values ---------- */
.values {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2px;
  background: rgba(236, 232, 225, 0.1);
}

.value {
  padding: 32px 24px 36px;
  background: var(--navy);
  transition: background 0.25s var(--ease);
}

.value:hover {
  background: var(--navy-2);
}

.value__code {
  font-family: var(--font-display);
  font-size: 3rem;
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 1px var(--red);
}

.value__title {
  margin-top: 18px;
  font-size: 1.6rem;
  color: var(--white);
}

.value__desc {
  margin-top: 10px;
  font-size: 0.95rem;
  color: var(--muted);
}

/* ---------- Agents ---------- */
.agents-section {
  padding-top: 0;
  background: linear-gradient(180deg, var(--navy) 0%, #2b1820 100%);
}

.agents {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0;
}

.agents > :nth-child(even) {
  margin-top: 48px;
}

/* ---------- Projects ---------- */
.projects {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.empty {
  text-align: center;
  opacity: 0.7;
}

.center {
  margin-top: 56px;
  display: flex;
  justify-content: center;
}

/* ---------- CTA ---------- */
.cta {
  padding: 72px 0;
}

.cta__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.cta__title {
  margin-top: 8px;
  font-size: clamp(2.4rem, 6vw, 4.5rem);
}

@media (max-width: 960px) {
  .summary {
    grid-template-columns: 1fr;
  }
  .values {
    grid-template-columns: repeat(2, 1fr);
  }
  .agents {
    grid-template-columns: repeat(3, 1fr);
    row-gap: 24px;
  }
  .projects {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .values {
    grid-template-columns: 1fr;
  }
  .agents {
    grid-template-columns: repeat(2, 1fr);
  }
  .agents > :nth-child(even) {
    margin-top: 24px;
  }
  .projects {
    grid-template-columns: 1fr;
  }
}
</style>
