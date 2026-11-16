<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/common/Button.vue'
import ProjectCard from '@/components/portfolio/ProjectCard.vue'
import { useProjects } from '@/composables/useProjects'
import { useTeam } from '@/composables/useTeam'
import { teamInfo } from '@/data/team'

const router = useRouter()
const { projects } = useProjects()
const { teamMembers } = useTeam()
const featuredProjects = computed(() => projects.value.slice(0, 3))

function goToProject(project) {
  router.push(`/projects/${project.slug}`)
}

const stats = computed(() => [
  { label: 'Projects', value: `${projects.value.length}+` },
  { label: 'Team Members', value: `${teamMembers.value.length}` },
  { label: 'Technologies', value: '12+' },
  { label: 'Semester', value: '7' },
])

const disciplines = ['Frontend Development', 'Backend Engineering', 'Mobile Development', 'UI/UX Design', 'Quality Assurance']
</script>

<template>
  <main class="home">
    <!-- ── Hero ── -->
    <section class="hero">
      <div class="container hero__inner">
        <div class="hero__content">
          <div class="hero__eyebrow">
            <span class="hero__eyebrow-line" />
            <span>{{ teamInfo.semester }}</span>
            <span class="hero__eyebrow-dot" />
            <span>{{ teamInfo.university }}</span>
          </div>

          <h1 class="hero__heading">
            <span class="hero__heading-line">We build</span>
            <span class="hero__heading-line hero__heading-line--accent">digital products</span>
            <span class="hero__heading-line">that work.</span>
          </h1>

          <p class="hero__description">{{ teamInfo.description }}</p>

          <div class="hero__disciplines">
            <span v-for="d in disciplines" :key="d" class="hero__discipline">{{ d }}</span>
          </div>

          <div class="hero__cta">
            <Button as="router-link" to="/projects" size="lg">View Our Work →</Button>
            <Button as="router-link" to="/about" variant="ghost" size="lg">Meet the Team</Button>
          </div>
        </div>

        <!-- Right column: index -->
        <aside class="hero__aside">
          <div class="hero__stats">
            <div v-for="stat in stats" :key="stat.label" class="hero__stat">
              <span class="hero__stat-value">{{ stat.value }}</span>
              <span class="hero__stat-label">{{ stat.label }}</span>
            </div>
          </div>
          <div class="hero__aside-bottom">
            <p class="hero__aside-team">{{ teamInfo.name }}</p>
            <p class="hero__aside-course">{{ teamInfo.course }}</p>
          </div>
        </aside>
      </div>

      <!-- Scroll indicator -->
      <div class="hero__scroll" aria-hidden="true">
        <span class="hero__scroll-line" />
        <span class="hero__scroll-label">Scroll</span>
      </div>
    </section>

    <!-- ── Discipline Bar ── -->
    <div class="discipline-bar" aria-hidden="true">
      <div class="discipline-bar__track">
        <span v-for="n in 3" :key="n">
          <span v-for="d in disciplines" :key="`${n}-${d}`" class="discipline-bar__item">{{ d }}</span>
        </span>
      </div>
    </div>

    <!-- ── Featured Projects ── -->
    <section class="featured" id="projects">
      <div class="container">
        <div class="featured__header">
          <div class="featured__header-left">
            <p class="section-eyebrow">Selected Work</p>
            <h2 class="featured__title">What we've<br>been building</h2>
          </div>
          <div class="featured__header-right">
            <p class="featured__desc">
              A selection of projects that represent our collective skills — from full-stack web applications and mobile apps to design systems and research.
            </p>
            <Button as="router-link" to="/projects" variant="outline" size="md">
              All Projects →
            </Button>
          </div>
        </div>

        <!-- Project grid -->
        <div v-if="featuredProjects.length > 0" class="featured__grid">
          <!-- Large featured project -->
          <div class="featured__main" @click="goToProject(featuredProjects[0])">
            <div class="featured__main-thumb">
              <img :src="featuredProjects[0].thumbnail" :alt="featuredProjects[0].title" loading="lazy" />
              <div class="featured__main-overlay">
                <span class="featured__main-num">01</span>
                <div class="featured__main-info">
                  <div class="featured__main-tags">
                    <span v-for="tag in featuredProjects[0].tags" :key="tag" class="featured__tag">{{ tag }}</span>
                  </div>
                  <h3 class="featured__main-title">{{ featuredProjects[0].title }}</h3>
                  <p class="featured__main-desc">{{ featuredProjects[0].shortDesc }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Secondary projects -->
          <div class="featured__secondary">
            <div
              v-for="(proj, i) in featuredProjects.slice(1, 3)"
              :key="proj.id"
              class="featured__secondary-item"
              @click="goToProject(proj)"
            >
              <div class="featured__secondary-thumb">
                <img :src="proj.thumbnail" :alt="proj.title" loading="lazy" />
              </div>
              <div class="featured__secondary-info">
                <span class="featured__secondary-num">0{{ i + 2 }}</span>
                <h3 class="featured__secondary-title">{{ proj.title }}</h3>
                <p class="featured__secondary-desc">{{ proj.shortDesc }}</p>
                <div class="featured__secondary-tech">
                  <span v-for="t in (proj.tech || []).slice(0, 3)" :key="t">{{ t }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state: no projects -->
        <div v-else class="featured__empty">
          <p>Belum ada proyek yang terdaftar. <router-link to="/manage-projects">Tambah proyek baru →</router-link></p>
        </div>
      </div>
    </section>

    <!-- ── About Banner ── -->
    <section class="about-banner">
      <div class="container about-banner__inner">
        <div class="about-banner__left">
          <h2 class="about-banner__title">
            Five developers.<br>One shared goal.
          </h2>
          <p class="about-banner__sub">
            We cover the full spectrum — from pixel-perfect interfaces to database schemas and API design. Each member brings a distinct specialization that makes the team complete.
          </p>
          <Button as="router-link" to="/about" size="md">Meet the team →</Button>
        </div>
        <div class="about-banner__right">
          <div
            v-for="(member, i) in teamMembers"
            :key="member.id"
            class="about-banner__member"
            :style="{ '--i': i }"
          >
            <img
              :src="member.avatar"
              :alt="member.name"
              class="about-banner__avatar"
              loading="lazy"
              width="48"
              height="48"
            />
            <div>
              <p class="about-banner__member-name">{{ member.name }}</p>
              <p class="about-banner__member-role">{{ member.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CTA ── -->
    <section class="cta-section">
      <div class="container cta-section__inner">
        <h2 class="cta-section__title">{{ teamInfo.tagline }}</h2>
        <p class="cta-section__sub">
          Curious about our work or want to reach out? We're open to discussion.
        </p>
        <div class="cta-section__actions">
          <Button as="router-link" to="/contact" size="lg">Get in Touch</Button>
          <Button as="router-link" to="/api-explorer" variant="outline" size="lg">Explore GitHub API →</Button>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.featured__empty {
  text-align: center;
  padding: var(--space-16) 0;
  color: var(--color-fg-muted);
  font-size: var(--text-sm);
}
.featured__empty a {
  color: var(--color-accent);
  text-decoration: underline;
}
/* ── Hero ── */
.hero {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  padding-top: 64px;
  position: relative;
  border-bottom: 1px solid var(--color-border-subtle);
}

.hero__inner {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: var(--space-16);
  align-items: center;
  padding-top: var(--space-20);
  padding-bottom: var(--space-20);
}

.hero__eyebrow {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: var(--space-8);
}
.hero__eyebrow-line {
  display: block;
  width: 32px;
  height: 1px;
  background: var(--color-text-muted);
}
.hero__eyebrow-dot {
  width: 3px;
  height: 3px;
  background: var(--color-text-muted);
  border-radius: 50%;
}

.hero__heading {
  font-family: var(--font-display);
  font-size: clamp(3rem, 7vw, 6rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.0;
  margin-bottom: var(--space-8);
}
.hero__heading-line { display: block; }
.hero__heading-line--accent { color: var(--color-highlight); }

.hero__description {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  max-width: 520px;
  line-height: 1.65;
  margin-bottom: var(--space-6);
}

.hero__disciplines {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-10);
}
.hero__discipline {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-text-muted);
  padding: var(--space-1) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
}

.hero__cta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

/* Hero aside */
.hero__aside {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  border-left: 1px solid var(--color-border-subtle);
  padding-left: var(--space-12);
}
.hero__stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
}
.hero__stat {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
.hero__stat-value {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: 800;
  color: var(--color-text);
  line-height: 1;
  letter-spacing: -0.04em;
}
.hero__stat-label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.hero__aside-bottom {
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-border-subtle);
}
.hero__aside-team {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--text-sm);
  color: var(--color-text);
  margin-bottom: var(--space-1);
}
.hero__aside-course {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

/* Scroll indicator */
.hero__scroll {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  position: absolute;
  bottom: var(--space-8);
  left: 50%;
  transform: translateX(-50%);
  opacity: 0.4;
}
.hero__scroll-line {
  display: block;
  width: 1px;
  height: 32px;
  background: var(--color-text-muted);
  animation: scroll-line 1.8s ease-in-out infinite;
}
.hero__scroll-label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  writing-mode: vertical-rl;
}
@keyframes scroll-line {
  0%, 100% { opacity: 0.3; transform: scaleY(1); }
  50% { opacity: 1; transform: scaleY(1.3); }
}

/* ── Discipline bar ── */
.discipline-bar {
  background: var(--color-bg-alt);
  border-top: 1px solid var(--color-border-subtle);
  border-bottom: 1px solid var(--color-border-subtle);
  padding: var(--space-3) 0;
  overflow: hidden;
}
.discipline-bar__track {
  display: flex;
  gap: var(--space-8);
  animation: marquee 20s linear infinite;
  width: max-content;
}
.discipline-bar__item {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-text-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
  padding: 0 var(--space-4);
}
.discipline-bar__item::before {
  content: '—';
  margin-right: var(--space-4);
  color: var(--color-highlight);
  opacity: 0.6;
}
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }

/* ── Featured ── */
.featured { padding: var(--space-32) 0; }

.featured__header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-12);
  align-items: flex-end;
  margin-bottom: var(--space-16);
}
.section-eyebrow {
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-highlight);
  margin-bottom: var(--space-4);
}
.featured__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin: 0;
}
.featured__header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-6);
}
.featured__desc {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: 1.65;
  margin: 0;
}

/* Featured project layout */
.featured__grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: var(--space-6);
  min-height: 520px;
}

.featured__main {
  cursor: pointer;
  border-radius: var(--radius-lg);
  overflow: hidden;
  position: relative;
}
.featured__main-thumb {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 420px;
}
.featured__main-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}
.featured__main:hover img { transform: scale(1.03); }
.featured__main-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.1) 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--space-6);
  transition: background var(--transition-base);
}
.featured__main-num {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: 700;
  color: rgba(255,255,255,0.5);
  letter-spacing: 0.08em;
}
.featured__main-info { color: white; }
.featured__main-tags {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}
.featured__tag {
  font-size: 10px;
  font-weight: 600;
  color: rgba(255,255,255,0.7);
  border: 1px solid rgba(255,255,255,0.25);
  padding: 2px var(--space-2);
  border-radius: var(--radius-full);
  letter-spacing: 0.05em;
}
.featured__main-title {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: var(--space-2);
}
.featured__main-desc {
  font-size: var(--text-sm);
  color: rgba(255,255,255,0.75);
  line-height: 1.5;
}

/* Secondary projects */
.featured__secondary {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.featured__secondary-item {
  cursor: pointer;
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: var(--space-4);
  padding: var(--space-4);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  background: var(--color-bg-elevated);
  flex: 1;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast);
}
.featured__secondary-item:hover {
  border-color: var(--color-border);
  box-shadow: var(--shadow-md);
  transform: translateX(4px);
}
.featured__secondary-thumb {
  border-radius: var(--radius-md);
  overflow: hidden;
  aspect-ratio: 1;
}
.featured__secondary-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-base);
}
.featured__secondary-item:hover .featured__secondary-thumb img { transform: scale(1.05); }
.featured__secondary-info { display: flex; flex-direction: column; gap: var(--space-2); }
.featured__secondary-num {
  font-size: 10px;
  font-weight: 700;
  color: var(--color-text-muted);
  letter-spacing: 0.08em;
}
.featured__secondary-title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.2;
  margin: 0;
}
.featured__secondary-desc {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.featured__secondary-tech {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  margin-top: auto;
}
.featured__secondary-tech span {
  font-size: 10px;
  color: var(--color-text-muted);
  font-weight: 500;
}
.featured__secondary-tech span::after { content: '·'; margin-left: var(--space-1); }
.featured__secondary-tech span:last-child::after { content: ''; }

/* ── About Banner ── */
.about-banner {
  background: var(--color-bg-alt);
  border-top: 1px solid var(--color-border-subtle);
  border-bottom: 1px solid var(--color-border-subtle);
  padding: var(--space-24) 0;
}
.about-banner__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-16);
  align-items: center;
}
.about-banner__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: var(--space-6);
}
.about-banner__sub {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: 1.65;
  margin-bottom: var(--space-8);
}
.about-banner__right {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.about-banner__member {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-subtle);
  background: var(--color-bg-elevated);
  animation: slide-in var(--transition-xslow) calc(var(--i, 0) * 80ms) both;
  transition: transform var(--transition-fast);
}
.about-banner__member:hover { transform: translateX(4px); }
.about-banner__avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  border: 1px solid var(--color-border);
  flex-shrink: 0;
}
.about-banner__member-name {
  font-weight: 600;
  font-size: var(--text-sm);
  color: var(--color-text);
  margin: 0 0 2px;
}
.about-banner__member-role {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin: 0;
}

@keyframes slide-in {
  from { opacity: 0; transform: translateX(16px); }
  to { opacity: 1; transform: translateX(0); }
}

/* ── CTA ── */
.cta-section {
  padding: var(--space-32) 0;
}
.cta-section__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-6);
}
.cta-section__title {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.0;
}
.cta-section__sub {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  max-width: 480px;
}
.cta-section__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .hero__inner { grid-template-columns: 1fr; gap: var(--space-12); }
  .hero__aside {
    border-left: none;
    border-top: 1px solid var(--color-border-subtle);
    padding-left: 0;
    padding-top: var(--space-8);
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .hero__stats { grid-template-columns: repeat(4, 1fr); }
  .hero__aside-bottom { border-top: none; padding-top: 0; }
  .featured__grid { grid-template-columns: 1fr; }
  .featured__secondary { flex-direction: row; }
  .about-banner__inner { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .featured__header { grid-template-columns: 1fr; }
  .hero__stats { grid-template-columns: repeat(2, 1fr); }
  .featured__secondary { flex-direction: column; }
  .hero__aside {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-6);
  }
}

@media (max-width: 480px) {
  .hero__cta { flex-direction: column; }
  .cta-section__actions { flex-direction: column; align-items: stretch; }
}
</style>

