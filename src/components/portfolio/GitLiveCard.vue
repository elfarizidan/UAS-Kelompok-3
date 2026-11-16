<script setup>
defineProps({
  profile: { type: Object, default: null },
  repos: { type: Array, default: () => [] },
  loading: Boolean,
  error: { type: String, default: null },
})
</script>

<template>
  <div class="git-card">
    <!-- Loading -->
    <div v-if="loading" class="git-card__state">
      <div class="git-card__skeleton git-card__skeleton--avatar" />
      <div class="git-card__skeleton-info">
        <div class="git-card__skeleton git-card__skeleton--name" />
        <div class="git-card__skeleton git-card__skeleton--text" />
        <div class="git-card__skeleton git-card__skeleton--text git-card__skeleton--short" />
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="git-card__state git-card__state--error">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      <p>{{ error }}</p>
    </div>

    <!-- Profile data -->
    <template v-else-if="profile">
      <div class="git-card__profile">
        <img
          :src="profile.avatar_url"
          :alt="profile.login"
          class="git-card__avatar"
          width="56"
          height="56"
        />
        <div>
          <p class="git-card__name">{{ profile.name || profile.login }}</p>
          <a :href="profile.html_url" target="_blank" rel="noopener noreferrer" class="git-card__username">
            @{{ profile.login }}
          </a>
          <p v-if="profile.bio" class="git-card__bio">{{ profile.bio }}</p>
        </div>
      </div>

      <!-- Stats -->
      <div class="git-card__stats">
        <div class="git-card__stat">
          <span class="git-card__stat-value">{{ profile.public_repos }}</span>
          <span class="git-card__stat-label">Repos</span>
        </div>
        <div class="git-card__stat">
          <span class="git-card__stat-value">{{ profile.followers }}</span>
          <span class="git-card__stat-label">Followers</span>
        </div>
        <div class="git-card__stat">
          <span class="git-card__stat-value">{{ profile.following }}</span>
          <span class="git-card__stat-label">Following</span>
        </div>
      </div>

      <!-- Repos -->
      <div v-if="repos.length" class="git-card__repos">
        <p class="git-card__repos-label">Recent Repositories</p>
        <ul role="list">
          <li v-for="repo in repos.slice(0, 4)" :key="repo.id" class="git-card__repo">
            <a :href="repo.html_url" target="_blank" rel="noopener noreferrer" class="git-card__repo-name">
              {{ repo.name }}
            </a>
            <p v-if="repo.description" class="git-card__repo-desc">{{ repo.description }}</p>
            <div class="git-card__repo-meta">
              <span v-if="repo.language" class="git-card__repo-lang">{{ repo.language }}</span>
              <span class="git-card__repo-stars">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                {{ repo.stargazers_count }}
              </span>
            </div>
          </li>
        </ul>
      </div>
    </template>

    <!-- Empty -->
    <div v-else class="git-card__state">
      <p class="git-card__empty">Masukkan username GitHub untuk memuat profil.</p>
    </div>
  </div>
</template>

<style scoped>
.git-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-elevated);
  overflow: hidden;
}

.git-card__state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-8);
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}
.git-card__state--error { color: var(--color-error); }
.git-card__empty { color: var(--color-text-muted); font-size: var(--text-sm); }

/* Skeleton */
.git-card__skeleton {
  background: var(--color-bg-alt);
  border-radius: var(--radius-sm);
  animation: pulse 1.4s ease infinite;
}
.git-card__state { flex-direction: row; align-items: flex-start; }
.git-card__skeleton-info { flex: 1; display: flex; flex-direction: column; gap: var(--space-2); }
.git-card__skeleton--avatar { width: 56px; height: 56px; border-radius: var(--radius-md); flex-shrink: 0; }
.git-card__skeleton--name { height: 20px; width: 60%; }
.git-card__skeleton--text { height: 14px; width: 100%; }
.git-card__skeleton--short { width: 40%; }

@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

/* Profile */
.git-card__profile {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-5);
  border-bottom: 1px solid var(--color-border-subtle);
}
.git-card__avatar {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid var(--color-border);
}
.git-card__name { font-weight: 600; font-size: var(--text-base); color: var(--color-text); margin: 0 0 2px; }
.git-card__username {
  font-size: var(--text-xs);
  color: var(--color-highlight);
  display: block;
  margin-bottom: var(--space-2);
}
.git-card__bio { font-size: var(--text-xs); color: var(--color-text-secondary); margin: 0; }

/* Stats */
.git-card__stats {
  display: flex;
  border-bottom: 1px solid var(--color-border-subtle);
}
.git-card__stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-4);
  border-right: 1px solid var(--color-border-subtle);
}
.git-card__stat:last-child { border-right: none; }
.git-card__stat-value { font-family: var(--font-display); font-size: var(--text-xl); font-weight: 700; color: var(--color-text); }
.git-card__stat-label { font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 2px; }

/* Repos */
.git-card__repos { padding: var(--space-5); }
.git-card__repos-label {
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: var(--space-4);
}
.git-card__repos ul { list-style: none; display: flex; flex-direction: column; gap: var(--space-3); }
.git-card__repo {
  padding: var(--space-3);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-md);
  background: var(--color-bg);
  transition: border-color var(--transition-fast);
}
.git-card__repo:hover { border-color: var(--color-border); }
.git-card__repo-name {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-highlight);
  display: block;
  margin-bottom: 4px;
}
.git-card__repo-desc {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin: 0 0 var(--space-2);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.git-card__repo-meta { display: flex; align-items: center; gap: var(--space-3); }
.git-card__repo-lang { font-size: 11px; color: var(--color-text-muted); font-weight: 500; }
.git-card__repo-stars {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: var(--color-text-muted);
}
</style>

