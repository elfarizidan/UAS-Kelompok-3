<script setup>
import { getMembers, getTeam } from '@/services/api'
import { useAsync } from '@/composables/useAsync'
import SectionHeading from '@/components/SectionHeading.vue'
import BgWord from '@/components/BgWord.vue'
import AsyncState from '@/components/AsyncState.vue'
import MemberAvatar from '@/components/MemberAvatar.vue'

const team = useAsync(getTeam)
const members = useAsync(getMembers)
</script>

<template>
  <div>
    <section class="section section--dark page-head">
      <BgWord text="Roster" />
      <div class="container">
        <SectionHeading
          eyebrow="Tentang Tim"
          title="Profil Anggota"
          :subtitle="team.data.value?.summary || 'Lima anggota, lima peran, satu tim.'"
        />
      </div>
    </section>

    <section class="section section--light section--framed">
      <div class="container">
        <AsyncState :loading="members.loading.value" :error="members.error.value" :skeletons="3" @retry="members.reload">
          <ol class="roster">
            <li v-for="(m, i) in members.data.value" :key="m.id" class="member" :class="{ 'member--flip': i % 2 }">
              <div class="member__photo">
                <MemberAvatar :name="m.name" :src="m.avatar" />
                <span class="member__no">{{ String(i + 1).padStart(2, '0') }}</span>
              </div>

              <div class="member__info">
                <span class="chip chip--red">{{ m.agentClass }}</span>
                <h2 class="member__name">{{ m.name }}</h2>
                <p class="member__role">{{ m.role }}</p>
                <p class="member__bio">{{ m.bio }}</p>

                <div class="member__skills">
                  <span class="member__label">Keahlian</span>
                  <ul class="chips">
                    <li v-for="skill in m.skills" :key="skill" class="chip">{{ skill }}</li>
                  </ul>
                </div>

                <ul class="member__links">
                  <li v-if="m.email"><a :href="`mailto:${m.email}`">Email</a></li>
                  <li v-if="m.github"><a :href="m.github" target="_blank" rel="noopener">GitHub</a></li>
                  <li v-if="m.linkedin"><a :href="m.linkedin" target="_blank" rel="noopener">LinkedIn</a></li>
                </ul>
              </div>
            </li>
          </ol>
        </AsyncState>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-head {
  padding-bottom: 40px;
}

.roster {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: clamp(48px, 7vw, 88px);
}

.member {
  display: grid;
  grid-template-columns: minmax(220px, 360px) 1fr;
  gap: clamp(28px, 5vw, 64px);
  align-items: center;
}

.member--flip {
  grid-template-columns: 1fr minmax(220px, 360px);
}

.member--flip .member__photo {
  order: 2;
}

.member__photo {
  position: relative;
  aspect-ratio: 4 / 5;
  box-shadow: 14px 14px 0 var(--navy);
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 28px), calc(100% - 28px) 100%, 0 100%);
}

.member__no {
  position: absolute;
  top: 10px;
  left: 14px;
  font-family: var(--font-display);
  font-size: 1.4rem;
  color: var(--white);
  letter-spacing: 0.1em;
}

.member__info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.member__name {
  font-size: clamp(3rem, 7vw, 5.5rem);
}

.member__role {
  font-family: var(--font-cond);
  font-weight: 700;
  font-size: 1.15rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--red);
}

.member__bio {
  max-width: 56ch;
  color: var(--muted-light);
}

.member__skills {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 6px;
}

.member__label {
  font-family: var(--font-cond);
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.member__links {
  display: flex;
  gap: 20px;
  margin-top: 8px;
}

.member__links a {
  font-family: var(--font-cond);
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-decoration: none;
  border-bottom: 2px solid var(--red);
  padding-bottom: 2px;
}

.member__links a:hover {
  color: var(--red);
}

@media (max-width: 760px) {
  .member,
  .member--flip {
    grid-template-columns: 1fr;
  }
  .member--flip .member__photo {
    order: 0;
  }
  .member__photo {
    max-width: 320px;
  }
}
</style>
