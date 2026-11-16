<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { teamInfo } from '@/data/team'
import { useTeam } from '@/composables/useTeam'
import { useProjects } from '@/composables/useProjects'
import { useToast } from '@/composables/useToast'
import ProjectCard from '@/components/portfolio/ProjectCard.vue'
import AddProjectModal from '@/components/portfolio/AddProjectModal.vue'
import Breadcrumbs from '@/components/common/Breadcrumbs.vue'
import Button from '@/components/common/Button.vue'
import Badge from '@/components/common/Badge.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { teamMembers } = useTeam()
const { getProjectsByMember, syncMemberGithubProjects } = useProjects()

const isAddModalOpen = ref(false)

const member = computed(() => {
  const id = Number(route.params.id)
  return teamMembers.value.find((m) => m.id === id) || null
})

const memberProjects = computed(() => {
  if (!member.value) return []
  return getProjectsByMember(member.value.id)
})

const personalProjects = computed(() => {
  return memberProjects.value.filter((p) => p.type === 'Personal')
})

const teamProjects = computed(() => {
  return memberProjects.value.filter((p) => p.type === 'Team')
})

function getMemberRoleInProject(project) {
  const contrib = project.contributors.find((c) => c.memberId === member.value?.id)
  return contrib ? contrib.role : ''
}

function goToProject(project) {
  router.push(`/projects/${project.slug}`)
}

async function syncGithubSilently() {
  if (!member.value?.github && !member.value?.githubUsername) return

  const username =
    member.value.githubUsername ||
    member.value.github.replace(/^https?:\/\/(www\.)?github\.com\//i, '').replace(/\/.*$/, '')
  if (!username) return

  try {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100`)
    if (res.ok) {
      const repos = await res.json()
      if (Array.isArray(repos) && repos.length > 0) {
        syncMemberGithubProjects(member.value.id, repos)
      }
    }
  } catch (err) {
    console.debug('Background GitHub sync:', err)
  }
}

// Otomatis sinkronkan repositori GitHub di latar belakang
onMounted(() => {
  if (member.value?.github) {
    syncGithubSilently()
  }
})
</script>

<template>
  <main v-if="member" class="member-detail">
    <!-- Breadcrumbs -->
    <div class="container member-detail__breadcrumbs">
      <Breadcrumbs
        :items="[
          { label: 'Home', to: '/' },
          { label: 'Team', to: '/about' },
          { label: member.name, to: `/members/${member.id}` },
        ]"
      />
    </div>

    <!-- Member Header Section -->
    <section class="member-hero">
      <div class="container">
        <div class="member-hero__grid">
          <!-- Avatar & Visuals -->
          <div class="member-hero__avatar-col">
            <div class="member-hero__avatar-frame">
              <img
                :src="member.avatar"
                :alt="member.name"
                class="member-hero__avatar-img"
              />
            </div>
            <div class="member-hero__quick-meta">
              <div class="member-hero__meta-box">
                <span class="member-hero__meta-value">{{ memberProjects.length }}</span>
                <span class="member-hero__meta-label">Total Proyek</span>
              </div>
              <div class="member-hero__meta-box">
                <span class="member-hero__meta-value">{{ personalProjects.length }}</span>
                <span class="member-hero__meta-label">Personal</span>
              </div>
              <div class="member-hero__meta-box">
                <span class="member-hero__meta-value">{{ teamProjects.length }}</span>
                <span class="member-hero__meta-label">Team Project</span>
              </div>
            </div>
          </div>

          <!-- Info & Bio -->
          <div class="member-hero__info-col">
            <div class="member-hero__eyebrow">
              <span class="member-hero__eyebrow-line" />
              <span>Personal Portfolio · {{ teamInfo.name }}</span>
            </div>

            <h1 class="member-hero__name">{{ member.name }}</h1>
            <p class="member-hero__role">{{ member.role }}</p>
            <p class="member-hero__nim">NIM: {{ member.nim }}</p>

            <p class="member-hero__bio">{{ member.bio }}</p>

            <!-- Skills -->
            <div class="member-hero__skills-block">
              <span class="member-hero__skills-label">Keahlian Teknis & Tools:</span>
              <div class="member-hero__skills">
                <Badge
                  v-for="skill in member.skills"
                  :key="skill"
                  variant="default"
                  size="md"
                >
                  {{ skill }}
                </Badge>
              </div>
            </div>

            <!-- Social Links -->
            <div class="member-hero__socials">
              <a
                v-if="member.github"
                :href="member.github"
                target="_blank"
                rel="noopener noreferrer"
                class="member-hero__social-link"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
                <span>GitHub (@{{ member.githubUsername }})</span>
              </a>
              <a
                v-if="member.linkedin"
                :href="member.linkedin"
                target="_blank"
                rel="noopener noreferrer"
                class="member-hero__social-link"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                <span>LinkedIn</span>
              </a>
              <a
                v-if="member.email"
                :href="`mailto:${member.email}`"
                class="member-hero__social-link"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <span>{{ member.email }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Member Projects Section -->
    <section class="member-projects">
      <div class="container">
        <div class="member-projects__header">
          <div>
            <p class="section-eyebrow">Track Record & Works</p>
            <h2 class="member-projects__title">
              Proyek yang Dikerjakan oleh {{ member.name }}
            </h2>
          </div>
          <div class="member-projects__actions">
            <Button variant="primary" size="sm" @click="isAddModalOpen = true">
              + Tambah Proyek untuk {{ member.name.split(' ')[0] }}
            </Button>
            <Button as="router-link" to="/projects" variant="outline" size="sm">
              Lihat Seluruh Proyek Tim →
            </Button>
          </div>
        </div>

        <!-- Project Grid -->
        <div v-if="memberProjects.length" class="member-projects__grid">
          <div
            v-for="(proj, i) in memberProjects"
            :key="proj.id"
            class="member-project-card"
          >
            <div class="member-project-card__role-tag">
              <span class="member-project-card__role-prefix">Kontribusi:</span>
              <strong class="member-project-card__role-text">{{ getMemberRoleInProject(proj) }}</strong>
            </div>

            <ProjectCard
              :project="proj"
              :index="i"
              @click="goToProject(proj)"
            />
          </div>
        </div>

        <div v-else class="member-projects__empty">
          <p class="member-projects__empty-text">Belum ada proyek terdaftar untuk {{ member.name }}.</p>
          <Button variant="primary" size="sm" @click="isAddModalOpen = true">
            + Tambahkan Proyek Pertama
          </Button>
        </div>
      </div>
    </section>

    <!-- Modal Tambah Proyek Mandiri Per Anggota -->
    <AddProjectModal
      v-model="isAddModalOpen"
      :preselected-member-id="member.id"
    />
  </main>

  <main v-else class="container member-not-found">
    <p>Data anggota tidak ditemukan.</p>
    <Button as="router-link" to="/about" size="md">Kembali ke Tim</Button>
  </main>
</template>

<style scoped>
.member-detail__breadcrumbs {
  padding-top: calc(64px + var(--space-6));
  padding-bottom: var(--space-4);
}

/* ── Hero ── */
.member-hero {
  padding: var(--space-8) 0 var(--space-16);
  border-bottom: 1px solid var(--color-border-subtle);
}

.member-hero__grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: var(--space-16);
  align-items: start;
}

.member-hero__avatar-col {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.member-hero__avatar-frame {
  aspect-ratio: 1;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 2px solid var(--color-border);
  background: var(--color-bg-alt);
}
.member-hero__avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-hero__quick-meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-2);
}
.member-hero__meta-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--space-3) var(--space-2);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-md);
  background: var(--color-bg-elevated);
}
.member-hero__meta-value {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 800;
  color: var(--color-text);
  line-height: 1;
}
.member-hero__meta-label {
  font-size: 11px;
  color: var(--color-text-muted);
  margin-top: 4px;
}

/* Info Col */
.member-hero__eyebrow {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: var(--space-4);
}
.member-hero__eyebrow-line {
  display: block;
  width: 24px;
  height: 1px;
  background: var(--color-text-muted);
}

.member-hero__name {
  font-family: var(--font-display);
  font-size: clamp(2.25rem, 5vw, 3.5rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: var(--space-2);
}

.member-hero__role {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-highlight);
  margin-bottom: var(--space-1);
}

.member-hero__nim {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  letter-spacing: 0.04em;
  margin-bottom: var(--space-6);
}

.member-hero__bio {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: 1.7;
  max-width: 680px;
  margin-bottom: var(--space-8);
}

.member-hero__skills-block {
  margin-bottom: var(--space-8);
}
.member-hero__skills-label {
  display: block;
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  margin-bottom: var(--space-3);
}
.member-hero__skills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.member-hero__socials {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}
.member-hero__social-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
  background: var(--color-bg-elevated);
}
.member-hero__social-link:hover {
  color: var(--color-text);
  border-color: var(--color-text);
  background: var(--color-bg-alt);
}

/* ── Projects Section ── */
.member-projects {
  padding: var(--space-16) 0 var(--space-24);
}

.member-projects__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: var(--space-10);
  flex-wrap: wrap;
  gap: var(--space-4);
}

.member-projects__actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.section-eyebrow {
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-highlight);
  margin-bottom: var(--space-2);
}

.member-projects__title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0;
}

.member-projects__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-8);
}

.member-project-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.member-project-card__role-tag {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-xs);
  background: var(--color-highlight-subtle);
  border: 1px solid color-mix(in srgb, var(--color-highlight) 20%, transparent);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-sm);
}
.member-project-card__role-prefix {
  color: var(--color-text-muted);
}
.member-project-card__role-text {
  color: var(--color-highlight);
}

.member-projects__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  text-align: center;
  padding: var(--space-16);
  color: var(--color-text-muted);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-lg);
}

.member-projects__empty-text {
  font-size: var(--text-base);
  margin: 0;
}

.member-not-found {
  padding: var(--space-24) 0;
  text-align: center;
}

@media (max-width: 840px) {
  .member-hero__grid {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }
  .member-hero__avatar-col {
    max-width: 240px;
  }
}
</style>
