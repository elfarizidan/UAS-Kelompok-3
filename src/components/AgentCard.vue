<script setup>
import MemberAvatar from './MemberAvatar.vue'

defineProps({
  member: { type: Object, required: true },
  index: { type: Number, default: 0 },
})
</script>

<template>
  <article class="agent" :style="{ '--i': index }">
    <div class="agent__frame">
      <MemberAvatar :name="member.name" :src="member.avatar" />
    </div>
    <div class="agent__meta">
      <span class="agent__class">{{ member.agentClass }}</span>
      <h3 class="agent__name">{{ member.name }}</h3>
      <span class="agent__role">{{ member.role }}</span>
    </div>
  </article>
</template>

<style scoped>
.agent {
  position: relative;
}

.agent__frame {
  aspect-ratio: 3 / 4.4;
  clip-path: polygon(14% 0, 100% 0, 86% 100%, 0 100%);
  border-bottom: 6px solid var(--red);
  transition: transform 0.3s var(--ease), filter 0.3s var(--ease);
  filter: saturate(0.85);
}

.agent:hover .agent__frame {
  transform: translateY(-8px);
  filter: saturate(1.1);
}

.agent__meta {
  position: absolute;
  left: 10%;
  right: 10%;
  bottom: 18px;
  text-align: center;
  color: var(--white);
}

.agent__class {
  display: inline-block;
  padding: 2px 8px;
  background: var(--navy);
  font-family: var(--font-cond);
  font-weight: 700;
  font-size: 0.7rem;
  letter-spacing: 0.18em;
}

.agent__name {
  margin-top: 6px;
  font-size: clamp(1.6rem, 2.6vw, 2.2rem);
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.agent__role {
  display: block;
  margin-top: 4px;
  font-family: var(--font-cond);
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.9;
}
</style>
