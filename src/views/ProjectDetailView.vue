<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjects } from '@/composables/useProjects'
import { getMembersByProject } from '@/data/projects'
import { useToast } from '@/composables/useToast'
import Button from '@/components/common/Button.vue'
import Badge from '@/components/common/Badge.vue'
import Breadcrumbs from '@/components/common/Breadcrumbs.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { getProjectBySlug, deleteProject } = useProjects()

const project = computed(() => getProjectBySlug(route.params.slug))
const resolvedMembers = computed(() => getMembersByProject(project.value))
const activeGalleryIndex = ref(0)
const isGalleryOpen = ref(false)

onMounted(() => {
  if (!project.value) {
    router.replace('/projects')
  }
})

function handleDeleteProject() {
  if (!project.value) return
  const title = project.value.title
  if (confirm(`Apakah Anda yakin ingin menghapus proyek "${title}" dari portofolio?`)) {
    deleteProject(project.value.id)
    toast.info(`Proyek "${title}" berhasil dihapus.`)
    router.push('/projects')
  }
}

function getStatusVariant(status) {
  if (status === 'Completed') return 'success'
  if (status === 'In Progress') return 'warning'
  return 'default'
}

function openGallery(index) {
  activeGalleryIndex.value = index
  isGalleryOpen.value = true
}

function prevImage() {
  if (!project.value) return
  activeGalleryIndex.value = (activeGalleryIndex.value - 1 + project.value.gallery.length) % project.value.gallery.length
}

function nextImage() {
  if (!project.value) return
  activeGalleryIndex.value = (activeGalleryIndex.value + 1) % project.value.gallery.length
}
</script>

<template>
  <main v-if="project" class="project-detail">
    <!-- ── Breadcrumbs ── -->
    <div class="container project-detail__breadcrumbs">
      <Breadcrumbs
        :items="[
          { label: 'Home', to: '/' },
          { label: 'Projects', to: '/projects' },
          { label: project.title, to: `/projects/${project.slug}` },
        ]"
      />
    </div>

    <!-- ── Hero ── -->
    <section class="pd-hero">
      <div class="pd-hero__cover">
        <img :src="project.thumbnail" :alt="project.title" class="pd-hero__cover-img" />
        <div class="pd-hero__cover-overlay" />
      </div>
      <div class="container pd-hero__content">
        <div class="pd-hero__meta">
          <Badge :variant="project.type === 'Personal' ? 'accent' : 'default'" size="md">
            {{ project.type === 'Personal' ? 'Personal Project' : 'Team Project' }}
          </Badge>
          <Badge :variant="getStatusVariant(project.status)" size="md">{{ project.status }}</Badge>
          <span class="pd-hero__year">{{ project.year }}</span>
          <span class="pd-hero__cat">{{ project.category }}</span>
        </div>
        <h1 class="pd-hero__title">{{ project.title }}</h1>
        <p class="pd-hero__desc">{{ project.description }}</p>
        <div class="pd-hero__tags">
          <Badge v-for="tag in project.tags" :key="tag" variant="default" size="sm">{{ tag }}</Badge>
        </div>
      </div>
    </section>

    <!-- ── Main Content ── -->
    <div class="container pd-layout">
      <!-- Left column: main content -->
      <article class="pd-main">
        <!-- Overview -->
        <section class="pd-section">
          <h2 class="pd-section__title">Project Overview</h2>
          <p class="pd-section__body">{{ project.overview }}</p>
        </section>

        <!-- Background -->
        <section class="pd-section">
          <h2 class="pd-section__title">Background</h2>
          <p class="pd-section__body">{{ project.background }}</p>
        </section>

        <!-- Problem Statement -->
        <section v-if="project.problemStatement" class="pd-section pd-section--problem">
          <div class="pd-section__problem-icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div>
            <h2 class="pd-section__title pd-section__title--problem">Problem Statement</h2>
            <p class="pd-section__body pd-section__body--problem">{{ project.problemStatement }}</p>
          </div>
        </section>

        <!-- Objectives -->
        <section class="pd-section">
          <h2 class="pd-section__title">Objectives</h2>
          <ul class="pd-list">
            <li v-for="obj in project.objectives" :key="obj" class="pd-list__item">
              <span class="pd-list__bullet" aria-hidden="true">→</span>
              <span>{{ obj }}</span>
            </li>
          </ul>
        </section>

        <!-- Solution -->
        <section class="pd-section">
          <h2 class="pd-section__title">Solution</h2>
          <p class="pd-section__body">{{ project.solution }}</p>
        </section>

        <!-- Key Features -->
        <section class="pd-section">
          <h2 class="pd-section__title">Key Features</h2>
          <div class="pd-features">
            <div
              v-for="(feat, i) in project.keyFeatures"
              :key="i"
              class="pd-feature"
            >
              <span class="pd-feature__num">{{ String(i + 1).padStart(2, '0') }}</span>
              <p>{{ feat }}</p>
            </div>
          </div>
        </section>

        <!-- Development Process -->
        <section v-if="project.developmentProcess?.length" class="pd-section">
          <h2 class="pd-section__title">Development Process</h2>
          <div class="pd-timeline">
            <div
              v-for="(proc, i) in project.developmentProcess"
              :key="i"
              class="pd-timeline__item"
            >
              <div class="pd-timeline__bullet">{{ i + 1 }}</div>
              <div class="pd-timeline__content">
                <h3 class="pd-timeline__phase">{{ proc.phase }}</h3>
                <p class="pd-timeline__desc">{{ proc.desc }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Project Gallery -->
        <section v-if="project.gallery?.length" class="pd-section">
          <h2 class="pd-section__title">Project Gallery</h2>
          <div class="pd-gallery">
            <div
              v-for="(img, i) in project.gallery"
              :key="i"
              class="pd-gallery__item"
              :class="{ 'pd-gallery__item--main': i === 0 }"
              @click="openGallery(i)"
            >
              <img :src="img" :alt="`${project.title} screenshot ${i + 1}`" loading="lazy" />
              <div class="pd-gallery__overlay" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
            </div>
          </div>
        </section>

        <!-- Member Contributions (Interconnected to Member Profile) -->
        <section class="pd-section">
          <div class="pd-section__header-row">
            <div>
              <h2 class="pd-section__title">Member Contributions</h2>
              <p class="pd-section__sub">
                Anggota yang berkontribusi dalam perancangan dan implementasi proyek ini:
              </p>
            </div>
          </div>

          <div class="pd-contributors-list">
            <router-link
              v-for="contrib in resolvedMembers"
              :key="contrib.memberId"
              :to="`/members/${contrib.memberId}`"
              class="pd-contrib-card"
            >
              <img
                :src="contrib.member.avatar"
                :alt="contrib.member.name"
                class="pd-contrib-card__avatar"
              />
              <div class="pd-contrib-card__info">
                <div class="pd-contrib-card__name-row">
                  <h3 class="pd-contrib-card__name">{{ contrib.member.name }}</h3>
                  <span class="pd-contrib-card__link-arrow">Lihat Profil Anggota →</span>
                </div>
                <p class="pd-contrib-card__role">{{ contrib.role }}</p>
              </div>
            </router-link>
          </div>
        </section>

        <!-- Results & Impact -->
        <section class="pd-section pd-section--results">
          <h2 class="pd-section__title">Results & Impact</h2>
          <p class="pd-section__body">{{ project.results }}</p>
        </section>
      </article>

      <!-- Right column: sidebar -->
      <aside class="pd-sidebar">
        <!-- Tech stack -->
        <div class="pd-sidebar__block">
          <h3 class="pd-sidebar__label">Technology Stack</h3>
          <div class="pd-tech-stack">
            <span v-for="tech in project.tech" :key="tech" class="pd-tech-item">{{ tech }}</span>
          </div>
        </div>

        <!-- Project info -->
        <div class="pd-sidebar__block">
          <h3 class="pd-sidebar__label">Project Info</h3>
          <dl class="pd-info-list">
            <div class="pd-info-item">
              <dt>Ownership</dt>
              <dd>
                <Badge :variant="project.type === 'Personal' ? 'accent' : 'default'" size="sm">
                  {{ project.type === 'Personal' ? 'Personal' : 'Team Collaboration' }}
                </Badge>
              </dd>
            </div>
            <div class="pd-info-item">
              <dt>Category</dt>
              <dd>{{ project.category }}</dd>
            </div>
            <div class="pd-info-item">
              <dt>Year</dt>
              <dd>{{ project.year }}</dd>
            </div>
            <div class="pd-info-item">
              <dt>Status</dt>
              <dd>
                <Badge :variant="getStatusVariant(project.status)" size="sm">{{ project.status }}</Badge>
              </dd>
            </div>
            <div class="pd-info-item">
              <dt>Contributors</dt>
              <dd>{{ project.contributors.length }} anggota</dd>
            </div>
          </dl>
        </div>

        <!-- Links -->
        <div class="pd-sidebar__block">
          <h3 class="pd-sidebar__label">Repository & Live Link</h3>
          <div class="pd-sidebar__links">
            <a
              v-if="project.repoUrl"
              :href="project.repoUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="pd-sidebar__link"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
              View Repository
            </a>
            <span v-else class="pd-sidebar__no-link">Private repository</span>

            <a
              v-if="project.demoUrl"
              :href="project.demoUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="pd-sidebar__link pd-sidebar__link--demo"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Live Demo / Case Study
            </a>
          </div>
        </div>

        <!-- Back & Management buttons -->
        <div class="pd-sidebar__actions">
          <Button as="router-link" to="/projects" variant="secondary" size="md" full-width>
            ← Kembali ke Semua Proyek
          </Button>

          <Button
            v-if="project.isCustom"
            variant="ghost"
            size="sm"
            full-width
            class="pd-sidebar__delete-btn"
            @click="handleDeleteProject"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            Hapus Proyek Ini
          </Button>
        </div>
      </aside>
    </div>

    <!-- ── Gallery Lightbox ── -->
    <Transition name="fade">
      <div
        v-if="isGalleryOpen"
        class="lightbox"
        role="dialog"
        aria-label="Image viewer"
        @click.self="isGalleryOpen = false"
      >
        <button class="lightbox__close" aria-label="Close" @click="isGalleryOpen = false">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
        <button class="lightbox__nav lightbox__nav--prev" aria-label="Previous image" @click="prevImage">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <img
          :src="project.gallery[activeGalleryIndex]"
          :alt="`${project.title} screenshot ${activeGalleryIndex + 1}`"
          class="lightbox__img"
        />
        <button class="lightbox__nav lightbox__nav--next" aria-label="Next image" @click="nextImage">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
        <div class="lightbox__counter">{{ activeGalleryIndex + 1 }} / {{ project.gallery.length }}</div>
      </div>
    </Transition>
  </main>
</template>

<style scoped>
.project-detail__breadcrumbs {
  padding-top: calc(64px + var(--space-6));
  padding-bottom: var(--space-4);
}

/* ── Hero ── */
.pd-hero {
  position: relative;
  margin-bottom: var(--space-16);
}
.pd-hero__cover {
  position: relative;
  height: 440px;
  overflow: hidden;
}
.pd-hero__cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.pd-hero__cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, var(--color-bg) 100%);
}
.pd-hero__content {
  position: relative;
  z-index: 1;
  margin-top: calc(-1 * var(--space-20));
  padding-bottom: var(--space-8);
}
.pd-hero__meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
}
.pd-hero__year,
.pd-hero__cat {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  font-weight: 500;
}
.pd-hero__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: var(--space-4);
}
.pd-hero__desc {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  line-height: 1.65;
  max-width: 680px;
  margin-bottom: var(--space-4);
}
.pd-hero__tags { display: flex; flex-wrap: wrap; gap: var(--space-2); }

/* ── Layout ── */
.pd-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: var(--space-16);
  align-items: start;
  padding-bottom: var(--space-24);
}

/* ── Main sections ── */
.pd-section {
  margin-bottom: var(--space-12);
  padding-bottom: var(--space-12);
  border-bottom: 1px solid var(--color-border-subtle);
}
.pd-section:last-child { border-bottom: none; }
.pd-section__header-row {
  margin-bottom: var(--space-6);
}
.pd-section__sub {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-top: var(--space-1);
}

.pd-section__title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--space-4);
}
.pd-section__body {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: 1.75;
}

/* Problem Statement Highlight Box */
.pd-section--problem {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  background: color-mix(in srgb, var(--color-warning) 8%, var(--color-bg-elevated));
  border: 1px solid color-mix(in srgb, var(--color-warning) 30%, transparent);
}
.pd-section__problem-icon {
  color: var(--color-warning);
  flex-shrink: 0;
  margin-top: 4px;
}
.pd-section__title--problem {
  font-size: var(--text-lg);
  color: var(--color-warning);
  margin-bottom: var(--space-2);
}
.pd-section__body--problem {
  font-size: var(--text-sm);
  color: var(--color-text);
  line-height: 1.6;
}

/* Objectives list */
.pd-list { list-style: none; display: flex; flex-direction: column; gap: var(--space-3); }
.pd-list__item { display: flex; gap: var(--space-3); font-size: var(--text-base); color: var(--color-text-secondary); }
.pd-list__bullet { color: var(--color-highlight); font-weight: 700; flex-shrink: 0; }

/* Features */
.pd-features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}
.pd-feature {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-5);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-md);
  background: var(--color-bg-elevated);
}
.pd-feature__num {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-highlight);
  letter-spacing: 0.08em;
}
.pd-feature p {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
}

/* Timeline / Development Process */
.pd-timeline {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.pd-timeline__item {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-subtle);
  background: var(--color-bg-elevated);
}
.pd-timeline__bullet {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-text);
  color: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xs);
  font-weight: 700;
  flex-shrink: 0;
}
.pd-timeline__content { flex: 1; }
.pd-timeline__phase {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--space-1);
}
.pd-timeline__desc {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
}

/* Gallery */
.pd-gallery {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 200px 200px;
  gap: var(--space-3);
}
.pd-gallery__item {
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  background: var(--color-bg-alt);
}
.pd-gallery__item--main {
  grid-row: 1 / 3;
}
.pd-gallery__item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-base);
}
.pd-gallery__item:hover img { transform: scale(1.04); }
.pd-gallery__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-fast);
}
.pd-gallery__item:hover .pd-gallery__overlay { opacity: 1; }

/* Contributors list with links */
.pd-contributors-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.pd-contrib-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-elevated);
  text-decoration: none;
  transition: all var(--transition-fast);
}
.pd-contrib-card:hover {
  transform: translateY(-2px);
  border-color: var(--color-text);
  box-shadow: var(--shadow-sm);
}
.pd-contrib-card__avatar {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  object-fit: cover;
  border: 1px solid var(--color-border);
  flex-shrink: 0;
}
.pd-contrib-card__info { flex: 1; }
.pd-contrib-card__name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}
.pd-contrib-card__name {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}
.pd-contrib-card__link-arrow {
  font-size: var(--text-xs);
  color: var(--color-highlight);
  font-weight: 600;
}
.pd-contrib-card__role {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  margin: 2px 0 0;
}

/* Results highlight */
.pd-section--results {
  background: var(--color-highlight-subtle);
  border: 1px solid color-mix(in srgb, var(--color-highlight) 20%, transparent);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  margin-bottom: 0;
}
.pd-section--results .pd-section__title { color: var(--color-highlight); }

/* ── Sidebar ── */
.pd-sidebar {
  position: sticky;
  top: calc(64px + var(--space-6));
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
.pd-sidebar__block {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  background: var(--color-bg-elevated);
}
.pd-sidebar__label {
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: var(--space-4);
}

/* Tech stack */
.pd-tech-stack { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.pd-tech-item {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-text);
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-sm);
}

/* Info list */
.pd-info-list { display: flex; flex-direction: column; gap: var(--space-3); }
.pd-info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.pd-info-item dt {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-weight: 500;
}
.pd-info-item dd {
  font-size: var(--text-sm);
  color: var(--color-text);
  font-weight: 600;
}

/* Sidebar links */
.pd-sidebar__links { display: flex; flex-direction: column; gap: var(--space-2); }
.pd-sidebar__link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-text);
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  background: var(--color-bg-alt);
}
.pd-sidebar__link:hover {
  border-color: var(--color-text);
  background: var(--color-text);
  color: var(--color-bg);
}
.pd-sidebar__no-link { font-size: var(--text-xs); color: var(--color-text-muted); font-style: italic; }

/* Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  background: rgba(0,0,0,0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
}
.lightbox__img {
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: var(--radius-md);
}
.lightbox__close {
  position: absolute;
  top: var(--space-5);
  right: var(--space-5);
  color: white;
  opacity: 0.7;
  transition: opacity var(--transition-fast);
}
.lightbox__close:hover { opacity: 1; }
.lightbox__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  opacity: 0.7;
  padding: var(--space-4);
  transition: opacity var(--transition-fast);
}
.lightbox__nav:hover { opacity: 1; }
.lightbox__nav--prev { left: var(--space-4); }
.lightbox__nav--next { right: var(--space-4); }
.lightbox__counter {
  position: absolute;
  bottom: var(--space-5);
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255,255,255,0.6);
  font-size: var(--text-sm);
}

.pd-sidebar__actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.pd-sidebar__delete-btn {
  color: var(--color-danger, #ef4444) !important;
  border: 1px dashed color-mix(in srgb, var(--color-danger, #ef4444) 40%, transparent);
  gap: var(--space-2);
}
.pd-sidebar__delete-btn:hover {
  background: color-mix(in srgb, var(--color-danger, #ef4444) 10%, transparent) !important;
  border-color: var(--color-danger, #ef4444) !important;
}

@media (max-width: 1024px) {
  .pd-layout { grid-template-columns: 1fr; }
  .pd-sidebar { position: static; order: -1; }
  .pd-features { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .pd-hero__cover { height: 280px; }
  .pd-gallery { grid-template-columns: 1fr; grid-template-rows: auto; }
  .pd-gallery__item--main { grid-row: auto; }
}
</style>
