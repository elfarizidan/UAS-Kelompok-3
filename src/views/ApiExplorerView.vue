<script setup>
import { ref, watch } from 'vue'
import { useGithubApi } from '@/composables/useGithubApi'
import { useTeam } from '@/composables/useTeam'
import GitLiveCard from '@/components/portfolio/GitLiveCard.vue'
import Button from '@/components/common/Button.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Badge from '@/components/common/Badge.vue'

const { teamMembers } = useTeam()
const { loading, error, fetchUserProfile, fetchUserRepos } = useGithubApi()

const searchUsername = ref('')
const profileData = ref(null)
const reposData = ref([])
const hasSearched = ref(false)

const selectedMember = ref(null)
const memberProfiles = ref({})
const memberLoading = ref({})

async function search() {
  const username = searchUsername.value.trim()
  if (!username) return
  hasSearched.value = true
  profileData.value = null
  reposData.value = []

  const { fetchUserProfile: fp, fetchUserRepos: fr } = useGithubApi()
  const [profile, repos] = await Promise.all([
    fp(username),
    fr(username, { per_page: 6 }),
  ])
  profileData.value = profile
  reposData.value = repos ?? []
}

async function loadMemberProfile(member) {
  if (memberProfiles.value[member.id]) {
    selectedMember.value = member
    return
  }
  selectedMember.value = member
  memberLoading.value[member.id] = true

  const { fetchUserProfile: fp, fetchUserRepos: fr, error: e } = useGithubApi()
  const [profile, repos] = await Promise.all([
    fp(member.githubUsername),
    fr(member.githubUsername, { per_page: 4 }),
  ])
  memberProfiles.value[member.id] = { profile, repos: repos ?? [], error: e.value }
  memberLoading.value[member.id] = false
}

// API documentation metadata
const endpoints = [
  {
    method: 'GET',
    path: '/users/{username}',
    desc: 'Mendapatkan profil publik pengguna GitHub.',
    used: 'Profil anggota tim, photo, bio, dan statistik.',
  },
  {
    method: 'GET',
    path: '/users/{username}/repos',
    desc: 'Mendapatkan daftar repository publik pengguna.',
    used: 'Menampilkan recent repositories per anggota.',
  },
]
</script>

<template>
  <main class="api-explorer">
    <!-- ── Header ── -->
    <section class="api-hero">
      <div class="container">
        <div class="api-hero__label">
          <span class="api-hero__label-line" />
          <span>GitHub API Integration</span>
        </div>
        <h1 class="api-hero__title">Live GitHub<br>Data Explorer</h1>
        <p class="api-hero__desc">
          Halaman ini mendemonstrasikan integrasi nyata dengan <strong>GitHub REST API v3</strong>.
          Data diambil langsung dari GitHub — bukan array lokal — dengan loading, error, dan empty state yang terkelola.
        </p>

        <!-- API endpoints doc -->
        <div class="api-endpoints">
          <p class="api-endpoints__label">Endpoints yang digunakan</p>
          <div class="api-endpoints__list">
            <div v-for="ep in endpoints" :key="ep.path" class="api-endpoint">
              <div class="api-endpoint__meta">
                <Badge variant="success" size="sm">{{ ep.method }}</Badge>
                <code class="api-endpoint__path">{{ ep.path }}</code>
              </div>
              <p class="api-endpoint__desc">{{ ep.desc }}</p>
              <p class="api-endpoint__used"><strong>Digunakan untuk:</strong> {{ ep.used }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Team Member Profiles ── -->
    <section class="api-team">
      <div class="container">
        <h2 class="api-section-title">Profil GitHub Anggota Tim</h2>
        <p class="api-section-desc">
          Klik anggota tim untuk memuat data GitHub-nya secara langsung dari API.
        </p>

        <!-- Member selector -->
        <div class="api-team__members">
          <button
            v-for="member in teamMembers"
            :key="member.id"
            class="api-team__member-btn"
            :class="{ 'api-team__member-btn--active': selectedMember?.id === member.id }"
            @click="loadMemberProfile(member)"
          >
            <img :src="member.avatar" :alt="member.name" class="api-team__member-avatar" />
            <div>
              <span class="api-team__member-name">{{ member.name }}</span>
              <span class="api-team__member-username">@{{ member.githubUsername }}</span>
            </div>
            <span v-if="memberLoading[member.id]" class="api-team__member-loading">
              <LoadingSpinner size="sm" />
            </span>
          </button>
        </div>

        <!-- Profile result -->
        <Transition name="fade" mode="out-in">
          <div v-if="selectedMember" :key="selectedMember.id" class="api-team__result">
            <div v-if="memberLoading[selectedMember.id]" class="api-team__loading-state">
              <LoadingSpinner size="lg" label="Memuat profil GitHub…" />
              <p>Memuat data dari GitHub API…</p>
            </div>
            <GitLiveCard
              v-else-if="memberProfiles[selectedMember.id]"
              :profile="memberProfiles[selectedMember.id].profile"
              :repos="memberProfiles[selectedMember.id].repos"
              :error="memberProfiles[selectedMember.id].error"
            />
          </div>
          <div v-else class="api-team__placeholder" key="placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true" style="color: var(--color-text-muted); opacity: 0.4;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <p>Pilih anggota tim di atas untuk memuat profil GitHub-nya.</p>
          </div>
        </Transition>
      </div>
    </section>

    <!-- ── Custom Search ── -->
    <section class="api-search">
      <div class="container">
        <h2 class="api-section-title">Cari Pengguna GitHub</h2>
        <p class="api-section-desc">
          Cari profil dan repository GitHub pengguna mana pun secara langsung.
        </p>

        <form class="api-search__form" @submit.prevent="search" aria-label="GitHub username search">
          <div class="api-search__input-wrap">
            <span class="api-search__prefix">github.com/</span>
            <input
              v-model="searchUsername"
              type="text"
              class="api-search__input"
              placeholder="username"
              :disabled="loading"
              aria-label="GitHub username"
              autocomplete="off"
              spellcheck="false"
            />
          </div>
          <Button
            type="submit"
            size="md"
            :loading="loading"
            :disabled="!searchUsername.trim() || loading"
          >
            {{ loading ? 'Memuat…' : 'Fetch Profile' }}
          </Button>
        </form>

        <!-- Results -->
        <Transition name="fade" mode="out-in">
          <!-- Loading -->
          <div v-if="loading" key="loading" class="api-search__state">
            <LoadingSpinner size="lg" label="Fetching GitHub data…" />
            <p>Mengambil data dari GitHub API…</p>
          </div>

          <!-- Error -->
          <div v-else-if="error && hasSearched" key="error" class="api-search__state api-search__state--error">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <p>{{ error }}</p>
            <Button variant="outline" size="sm" @click="hasSearched = false; searchUsername = ''">
              Coba lagi
            </Button>
          </div>

          <!-- Empty -->
          <div v-else-if="hasSearched && !profileData && !loading" key="empty" class="api-search__state">
            <p>Pengguna tidak ditemukan atau terjadi kesalahan.</p>
          </div>

          <!-- Result -->
          <div v-else-if="profileData" key="result" class="api-search__result">
            <GitLiveCard
              :profile="profileData"
              :repos="reposData"
            />
          </div>
        </Transition>
      </div>
    </section>

    <!-- ── API Rate Limit Info ── -->
    <div class="container api-ratelimit">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
      <p>
        GitHub API memiliki batas 60 request/jam untuk pengguna tidak terautentikasi.
        Jika terkena rate limit, coba lagi setelah beberapa menit.
      </p>
    </div>
  </main>
</template>

<style scoped>
/* ── Hero ── */
.api-hero {
  padding: calc(64px + var(--space-16)) 0 var(--space-16);
  border-bottom: 1px solid var(--color-border-subtle);
}
.api-hero__label {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: var(--space-6);
}
.api-hero__label-line {
  display: block;
  width: 32px;
  height: 1px;
  background: var(--color-text-muted);
}
.api-hero__title {
  font-family: var(--font-display);
  font-size: clamp(2.25rem, 5vw, 4rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.0;
  margin-bottom: var(--space-5);
}
.api-hero__desc {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: 1.65;
  max-width: 580px;
  margin-bottom: var(--space-10);
}

/* Endpoints */
.api-endpoints { }
.api-endpoints__label {
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: var(--space-4);
}
.api-endpoints__list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--space-4);
}
.api-endpoint {
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-elevated);
}
.api-endpoint__meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}
.api-endpoint__path {
  font-family: ui-monospace, monospace;
  font-size: var(--text-sm);
  color: var(--color-text);
  background: var(--color-bg-alt);
  padding: 2px var(--space-2);
  border-radius: var(--radius-sm);
}
.api-endpoint__desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-2);
}
.api-endpoint__used {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin: 0;
}

/* ── Sections ── */
.api-team,
.api-search {
  padding: var(--space-16) 0;
  border-bottom: 1px solid var(--color-border-subtle);
}
.api-section-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--space-3);
}
.api-section-desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-8);
}

/* Team members */
.api-team__members {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-bottom: var(--space-8);
}
.api-team__member-btn {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-elevated);
  transition: all var(--transition-fast);
  position: relative;
}
.api-team__member-btn:hover {
  border-color: var(--color-text);
  background: var(--color-bg-alt);
}
.api-team__member-btn--active {
  border-color: var(--color-highlight);
  background: var(--color-highlight-subtle);
}
.api-team__member-avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  flex-shrink: 0;
}
.api-team__member-name {
  display: block;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text);
}
.api-team__member-username {
  display: block;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}
.api-team__member-loading {
  margin-left: auto;
}

.api-team__result { max-width: 480px; }

.api-team__loading-state,
.api-team__placeholder {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-4);
  padding: var(--space-10);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-lg);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  max-width: 480px;
}
.api-team__placeholder { align-items: center; }

/* Search form */
.api-search__form {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  max-width: 520px;
  margin-bottom: var(--space-10);
}
.api-search__input-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-elevated);
  overflow: hidden;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}
.api-search__input-wrap:focus-within {
  border-color: var(--color-text);
  box-shadow: 0 0 0 3px var(--color-highlight-subtle);
}
.api-search__prefix {
  padding: 0 var(--space-3);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  background: var(--color-bg-alt);
  height: 44px;
  display: flex;
  align-items: center;
  border-right: 1px solid var(--color-border);
  white-space: nowrap;
}
.api-search__input {
  flex: 1;
  font-family: ui-monospace, monospace;
  font-size: var(--text-sm);
  color: var(--color-text);
  background: transparent;
  border: none;
  outline: none;
  padding: 0 var(--space-4);
  height: 44px;
}
.api-search__input::placeholder { color: var(--color-text-muted); font-family: ui-monospace, monospace; }

/* States */
.api-search__state {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-4);
  padding: var(--space-10);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-lg);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  max-width: 480px;
}
.api-search__state--error { color: var(--color-error); border-color: var(--color-error); }
.api-search__result { max-width: 480px; }

/* Rate limit info */
.api-ratelimit {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-5);
  margin: var(--space-8) auto var(--space-16);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-md);
  background: var(--color-bg-alt);
  color: var(--color-text-muted);
}
.api-ratelimit p {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  line-height: 1.6;
  margin: 0;
}
.api-ratelimit svg { flex-shrink: 0; margin-top: 1px; }

/* Responsive */
@media (max-width: 640px) {
  .api-search__form { flex-direction: column; align-items: stretch; }
  .api-team__members { flex-direction: column; }
}
</style>

