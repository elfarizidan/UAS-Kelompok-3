<script setup>
import { ref, computed } from 'vue'
import ProfileCard from '@/components/portfolio/ProfileCard.vue'
import { teamInfo } from '@/data/team'
import { useTeam } from '@/composables/useTeam'

const { teamMembers } = useTeam()

const activeTab = ref('all') // 'all' | by skill filter
const selectedMember = ref(null)

const skillFilters = computed(() => {
  const skills = new Set()
  teamMembers.value.forEach((m) => (m.skills || []).forEach((s) => skills.add(s)))
  return ['All', ...Array.from(skills).slice(0, 6)]
})

const filteredMembers = computed(() => {
  if (activeTab.value === 'All' || activeTab.value === 'all') return teamMembers.value
  return teamMembers.value.filter((m) => (m.skills || []).includes(activeTab.value))
})

function selectFilter(tab) {
  activeTab.value = tab
}
</script>

<template>
  <main class="about">
    <!-- ── Page Header ── -->
    <section class="about-hero">
      <div class="container">
        <div class="about-hero__inner">
          <div class="about-hero__label">
            <span class="about-hero__label-line" />
            <span>About the team</span>
          </div>
          <h1 class="about-hero__title">
            The people<br>behind the code.
          </h1>
          <p class="about-hero__desc">
            {{ teamInfo.description }}
          </p>
        </div>

        <!-- Team summary strip -->
        <div class="about-hero__strip">
          <div class="about-hero__strip-item">
            <span class="about-hero__strip-num">{{ teamInfo.memberCount }}</span>
            <span class="about-hero__strip-label">Members</span>
          </div>
          <div class="about-hero__strip-divider" />
          <div class="about-hero__strip-item">
            <span class="about-hero__strip-num">{{ teamInfo.projectCount }}+</span>
            <span class="about-hero__strip-label">Projects</span>
          </div>
          <div class="about-hero__strip-divider" />
          <div class="about-hero__strip-item">
            <span class="about-hero__strip-num">12+</span>
            <span class="about-hero__strip-label">Technologies</span>
          </div>
          <div class="about-hero__strip-divider" />
          <div class="about-hero__strip-item">
            <span class="about-hero__strip-label">{{ teamInfo.course }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Team Grid ── -->
    <section class="team-section">
      <div class="container">
        <!-- Filter tabs -->
        <div class="team-section__filters" role="tablist" aria-label="Filter by skill">
          <button
            v-for="tab in skillFilters"
            :key="tab"
            class="team-section__filter-btn"
            :class="{ 'team-section__filter-btn--active': activeTab === tab || (tab === 'All' && activeTab === 'all') }"
            role="tab"
            :aria-selected="activeTab === tab || (tab === 'All' && activeTab === 'all')"
            @click="selectFilter(tab)"
          >
            {{ tab }}
          </button>
        </div>

        <!-- Member grid -->
        <Transition name="fade" mode="out-in">
          <div class="team-section__grid" :key="activeTab" role="tabpanel">
            <ProfileCard
              v-for="(member, i) in filteredMembers"
              :key="member.id"
              :member="member"
              layout="vertical"
              :style="{ '--delay': `${i * 60}ms` }"
              class="team-card-anim"
            />
          </div>
        </Transition>

        <!-- Empty -->
        <div v-if="filteredMembers.length === 0" class="team-section__empty">
          <p>No members match this skill filter.</p>
          <button class="team-section__reset" @click="activeTab = 'all'">Reset filter</button>
        </div>
      </div>
    </section>

    <!-- ── Team Story ── -->
    <section class="team-story">
      <div class="container">
        <div class="team-story__inner">
          <div class="team-story__left">
            <p class="section-eyebrow">Our Approach</p>
            <h2 class="team-story__title">How we work<br>together</h2>
          </div>
          <div class="team-story__right">
            <div class="team-story__block">
              <span class="team-story__block-num">01</span>
              <div>
                <h3>Cross-functional collaboration</h3>
                <p>Setiap anggota berkontribusi di luar batas perannya. Developer memahami desain, desainer memahami keterbatasan teknis.</p>
              </div>
            </div>
            <div class="team-story__block">
              <span class="team-story__block-num">02</span>
              <div>
                <h3>Documentation first</h3>
                <p>Kami mendokumentasikan keputusan arsitektur, alur pengguna, dan spesifikasi API sebelum menulis kode pertama.</p>
              </div>
            </div>
            <div class="team-story__block">
              <span class="team-story__block-num">03</span>
              <div>
                <h3>Test before ship</h3>
                <p>Setiap fitur disertai skenario pengujian. Kami tidak mengklaim berhasil sebelum benar-benar menjalankan testnya.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* ── About Hero ── */
.about-hero {
  padding: calc(64px + var(--space-20)) 0 var(--space-16);
  border-bottom: 1px solid var(--color-border-subtle);
}
.about-hero__inner {
  max-width: 760px;
  margin-bottom: var(--space-16);
}
.about-hero__label {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: var(--space-8);
}
.about-hero__label-line {
  display: block;
  width: 32px;
  height: 1px;
  background: var(--color-text-muted);
}
.about-hero__title {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.0;
  margin-bottom: var(--space-6);
}
.about-hero__desc {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  line-height: 1.65;
  max-width: 580px;
}

/* Strip */
.about-hero__strip {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  flex-wrap: wrap;
}
.about-hero__strip-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
.about-hero__strip-num {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 800;
  color: var(--color-text);
  line-height: 1;
}
.about-hero__strip-label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.about-hero__strip-divider {
  width: 1px;
  height: 40px;
  background: var(--color-border);
}

/* ── Team Section ── */
.team-section { padding: var(--space-20) 0; }

.team-section__filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-12);
  border-bottom: 1px solid var(--color-border-subtle);
  padding-bottom: var(--space-6);
}
.team-section__filter-btn {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-muted);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}
.team-section__filter-btn:hover {
  color: var(--color-text);
  background: var(--color-bg-alt);
}
.team-section__filter-btn--active {
  color: var(--color-text);
  border-color: var(--color-border);
  background: var(--color-bg-elevated);
}

.team-section__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-6);
}
.team-card-anim {
  animation: card-in var(--transition-xslow) var(--delay, 0ms) both;
}
@keyframes card-in {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.team-section__empty {
  text-align: center;
  padding: var(--space-16);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}
.team-section__reset {
  margin-top: var(--space-4);
  font-size: var(--text-sm);
  color: var(--color-highlight);
  text-decoration: underline;
}

/* ── Team Story ── */
.team-story {
  background: var(--color-bg-alt);
  border-top: 1px solid var(--color-border-subtle);
  padding: var(--space-24) 0;
}
.team-story__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-16);
  align-items: start;
}
.section-eyebrow {
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-highlight);
  margin-bottom: var(--space-4);
}
.team-story__title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3.5vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin: 0;
}
.team-story__right {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}
.team-story__block {
  display: flex;
  gap: var(--space-5);
  padding-bottom: var(--space-8);
  border-bottom: 1px solid var(--color-border-subtle);
}
.team-story__block:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.team-story__block-num {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-highlight);
  letter-spacing: 0.08em;
  flex-shrink: 0;
  margin-top: 4px;
}
.team-story__block h3 {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--space-2);
}
.team-story__block p {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.65;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .team-story__inner { grid-template-columns: 1fr; gap: var(--space-10); }
  .team-section__grid { grid-template-columns: 1fr; }
  .about-hero__strip { gap: var(--space-5); }
}
</style>

