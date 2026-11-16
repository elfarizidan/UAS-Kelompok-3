<script setup>
import { computed } from 'vue'
import Badge from '@/components/common/Badge.vue'
import { useTeam } from '@/composables/useTeam'

const props = defineProps({
  project: { type: Object, required: true },
  index: { type: Number, default: 0 },
})

defineEmits(['click', 'select-member'])

const { teamMembers } = useTeam()

function getStatusVariant(status) {
  if (status === 'Completed') return 'success'
  if (status === 'In Progress') return 'warning'
  return 'default'
}

const resolvedContributors = computed(() => {
  if (!props.project.contributors) return []
  return props.project.contributors.map((c) => {
    const member = teamMembers.value.find((m) => m.id === c.memberId)
    return {
      ...c,
      name: member ? member.name : `Anggota ${c.memberId}`,
      avatar: member ? member.avatar : '',
    }
  })
})
</script>

<template>
  <article
    class="project-card"
    :style="{ '--delay': `${index * 60}ms` }"
    @click="$emit('click', project)"
  >
    <!-- Thumbnail -->
    <div class="project-card__thumb">
      <img
        :src="project.thumbnail"
        :alt="project.title"
        class="project-card__img"
        loading="lazy"
      />
      <div class="project-card__overlay">
        <span class="project-card__view-label">Buka Detail Proyek →</span>
      </div>

      <div class="project-card__meta-top">
        <div class="project-card__badges">
          <Badge
            :variant="project.type === 'Personal' ? 'accent' : 'default'"
            size="sm"
          >
            {{ project.type === 'Personal' ? 'Personal' : 'Team' }}
          </Badge>
          <Badge :variant="getStatusVariant(project.status)" size="sm">
            {{ project.status }}
          </Badge>
        </div>
        <span class="project-card__year">{{ project.year }}</span>
      </div>
    </div>

    <!-- Content -->
    <div class="project-card__body">
      <!-- Category & Type -->
      <div class="project-card__category-line">
        <span class="project-card__category">{{ project.category }}</span>
        <span class="project-card__dot">·</span>
        <span class="project-card__owner-count">
          {{ project.type === 'Personal' ? 'Karya Mandiri' : `${resolvedContributors.length} Kontributor` }}
        </span>
      </div>

      <h3 class="project-card__title">{{ project.title }}</h3>
      <p class="project-card__desc">{{ project.shortDesc }}</p>

      <!-- Contributors Strip -->
      <div class="project-card__contributors" @click.stop>
        <span class="project-card__contrib-label">Pengerjaan:</span>
        <div class="project-card__avatars">
          <router-link
            v-for="contrib in resolvedContributors"
            :key="contrib.memberId"
            :to="`/members/${contrib.memberId}`"
            class="project-card__avatar-link"
            :title="`${contrib.name} — ${contrib.role}`"
            :aria-label="`Profil ${contrib.name}`"
          >
            <img
              :src="contrib.avatar"
              :alt="contrib.name"
              class="project-card__contrib-avatar"
              loading="lazy"
            />
          </router-link>
        </div>
        <span class="project-card__first-contrib-name">
          {{ resolvedContributors[0]?.name }}
          <span v-if="resolvedContributors.length > 1" class="project-card__others-tag">
            +{{ resolvedContributors.length - 1 }}
          </span>
        </span>
      </div>

      <!-- Tech Stack -->
      <div class="project-card__tech">
        <span v-for="t in project.tech.slice(0, 4)" :key="t" class="project-card__tech-item">
          {{ t }}
        </span>
        <span v-if="project.tech.length > 4" class="project-card__tech-more">
          +{{ project.tech.length - 4 }}
        </span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.project-card {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-bg-elevated);
  transition: transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base);
  animation: card-in var(--transition-xslow) var(--delay, 0ms) both;
}
.project-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-border);
}

/* Thumbnail */
.project-card__thumb {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--color-bg-alt);
}
.project-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}
.project-card:hover .project-card__img { transform: scale(1.04); }

.project-card__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-base);
  backdrop-filter: blur(2px);
}
.project-card:hover .project-card__overlay { opacity: 1; }

.project-card__view-label {
  color: white;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: var(--text-sm);
  letter-spacing: 0.03em;
  padding: var(--space-2) var(--space-4);
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-full);
}

.project-card__meta-top {
  position: absolute;
  top: var(--space-3);
  left: var(--space-3);
  right: var(--space-3);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.project-card__badges {
  display: flex;
  gap: var(--space-1);
}
.project-card__year {
  font-size: var(--text-xs);
  color: white;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.55);
  padding: 2px var(--space-2);
  border-radius: var(--radius-sm);
  backdrop-filter: blur(4px);
}

/* Body */
.project-card__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-5);
  flex: 1;
}

.project-card__category-line {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}
.project-card__category {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-highlight);
}
.project-card__dot {
  color: var(--color-text-muted);
}
.project-card__owner-count {
  color: var(--color-text-muted);
}

.project-card__title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.25;
  margin: 0;
}
.project-card__desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

/* Contributors */
.project-card__contributors {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--color-bg-alt);
  border-radius: var(--radius-md);
  margin-top: 2px;
}
.project-card__contrib-label {
  font-size: 11px;
  color: var(--color-text-muted);
  font-weight: 500;
}
.project-card__avatars {
  display: flex;
  align-items: center;
}
.project-card__avatar-link {
  display: block;
  margin-left: -6px;
  position: relative;
  transition: transform var(--transition-fast), z-index var(--transition-fast);
}
.project-card__avatar-link:first-child {
  margin-left: 0;
}
.project-card__avatar-link:hover {
  transform: translateY(-2px) scale(1.1);
  z-index: 5;
}
.project-card__contrib-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-bg-elevated);
}
.project-card__first-contrib-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.project-card__others-tag {
  color: var(--color-text-muted);
  font-weight: normal;
}

/* Tech */
.project-card__tech {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: auto;
  padding-top: var(--space-2);
}
.project-card__tech-item {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-muted);
  background: var(--color-bg);
  border: 1px solid var(--color-border-subtle);
  padding: 2px var(--space-2);
  border-radius: var(--radius-sm);
}
.project-card__tech-more {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-muted);
  padding: 2px var(--space-1);
}

@keyframes card-in {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
