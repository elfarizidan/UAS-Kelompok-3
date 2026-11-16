<script setup>
import { computed } from 'vue'
import { useProjects } from '@/composables/useProjects'
import Button from '@/components/common/Button.vue'

const props = defineProps({
  member: { type: Object, required: true },
  layout: {
    type: String,
    default: 'vertical',
    validator: (v) => ['vertical', 'horizontal'].includes(v),
  },
})

const { getProjectsByMember } = useProjects()
const memberProjects = computed(() => getProjectsByMember(props.member.id))
</script>

<template>
  <article class="profile-card" :class="`profile-card--${layout}`">
    <!-- Avatar -->
    <div class="profile-card__avatar-wrap">
      <router-link :to="`/members/${member.id}`">
        <img
          :src="member.avatar"
          :alt="member.name"
          class="profile-card__avatar"
          loading="lazy"
          width="72"
          height="72"
        />
      </router-link>
    </div>

    <!-- Info -->
    <div class="profile-card__info">
      <div class="profile-card__header">
        <div>
          <h3 class="profile-card__name">
            <router-link :to="`/members/${member.id}`" class="profile-card__name-link">
              {{ member.name }}
            </router-link>
          </h3>
          <p class="profile-card__role">{{ member.role }}</p>
          <p class="profile-card__nim">NIM: {{ member.nim }}</p>
        </div>
      </div>

      <p class="profile-card__bio">{{ member.bio }}</p>

      <!-- Skills -->
      <div class="profile-card__skills">
        <span v-for="skill in member.skills.slice(0, 4)" :key="skill" class="profile-card__skill">
          {{ skill }}
        </span>
        <span v-if="member.skills.length > 4" class="profile-card__skill-more">
          +{{ member.skills.length - 4 }}
        </span>
      </div>

      <!-- Projects Track Indicator -->
      <div class="profile-card__projects-bar">
        <span class="profile-card__projects-count">
          <strong>{{ memberProjects.length }}</strong> Proyek Terlibat
        </span>
        <router-link :to="`/members/${member.id}`" class="profile-card__portfolio-btn">
          Lihat Portofolio →
        </router-link>
      </div>

      <!-- Links -->
      <div class="profile-card__links">
        <a
          v-if="member.github"
          :href="member.github"
          target="_blank"
          rel="noopener noreferrer"
          class="profile-card__link"
          :aria-label="`GitHub ${member.name}`"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
          <span>GitHub</span>
        </a>
        <a
          v-if="member.linkedin"
          :href="member.linkedin"
          target="_blank"
          rel="noopener noreferrer"
          class="profile-card__link"
          :aria-label="`LinkedIn ${member.name}`"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          <span>LinkedIn</span>
        </a>
        <router-link
          :to="`/projects?member=${member.id}`"
          class="profile-card__link profile-card__link--accent"
          title="Filter proyek berdasarkan anggota ini"
        >
          <span>Filter Proyek</span>
        </router-link>
      </div>
    </div>
  </article>
</template>

<style scoped>
.profile-card {
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  background: var(--color-bg-elevated);
  overflow: hidden;
  transition: transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base);
}
.profile-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-border);
}

/* Vertical layout */
.profile-card--vertical {
  display: flex;
  flex-direction: column;
}
.profile-card--vertical .profile-card__avatar-wrap {
  padding: var(--space-6) var(--space-6) 0;
}
.profile-card--vertical .profile-card__avatar {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-md);
  object-fit: cover;
  border: 2px solid var(--color-border);
  transition: transform var(--transition-fast);
}
.profile-card--vertical .profile-card__avatar:hover {
  transform: scale(1.05);
}
.profile-card--vertical .profile-card__info {
  padding: var(--space-5) var(--space-6) var(--space-6);
}

/* Horizontal layout */
.profile-card--horizontal {
  display: grid;
  grid-template-columns: 100px 1fr;
}
.profile-card--horizontal .profile-card__avatar-wrap {
  padding: var(--space-6);
  display: flex;
  align-items: flex-start;
}
.profile-card--horizontal .profile-card__avatar {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-md);
  object-fit: cover;
  border: 2px solid var(--color-border);
}
.profile-card--horizontal .profile-card__info {
  padding: var(--space-6) var(--space-6) var(--space-6) 0;
}

/* Info */
.profile-card__info { display: flex; flex-direction: column; gap: var(--space-3); }

.profile-card__name {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 2px;
  line-height: 1.2;
}
.profile-card__name-link {
  color: inherit;
  text-decoration: none;
  transition: color var(--transition-fast);
}
.profile-card__name-link:hover {
  color: var(--color-highlight);
}

.profile-card__role {
  font-size: var(--text-sm);
  color: var(--color-highlight);
  font-weight: 500;
  margin: 0;
}
.profile-card__nim {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin: 2px 0 0;
  letter-spacing: 0.03em;
}

.profile-card__bio {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Skills */
.profile-card__skills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}
.profile-card__skill {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-muted);
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border-subtle);
  padding: 2px var(--space-2);
  border-radius: var(--radius-sm);
}
.profile-card__skill-more {
  font-size: 11px;
  color: var(--color-text-muted);
  padding: 2px var(--space-1);
}

/* Projects Bar */
.profile-card__projects-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-3);
  background: var(--color-bg-alt);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  margin-top: 2px;
}
.profile-card__projects-count {
  color: var(--color-text-secondary);
}
.profile-card__portfolio-btn {
  color: var(--color-highlight);
  font-weight: 600;
  text-decoration: none;
  transition: opacity var(--transition-fast);
}
.profile-card__portfolio-btn:hover {
  opacity: 0.8;
}

/* Links */
.profile-card__links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: auto;
  padding-top: var(--space-2);
}
.profile-card__link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-secondary);
  padding: var(--space-1) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}
.profile-card__link:hover {
  color: var(--color-text);
  border-color: var(--color-text);
  background: var(--color-bg-alt);
}
.profile-card__link--accent {
  background: var(--color-highlight-subtle);
  color: var(--color-highlight);
  border-color: color-mix(in srgb, var(--color-highlight) 30%, transparent);
}
</style>
