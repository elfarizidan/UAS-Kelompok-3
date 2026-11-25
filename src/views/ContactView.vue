<script setup>
import { getMembers, getTeam } from '@/services/api'
import { useAsync } from '@/composables/useAsync'
import SectionHeading from '@/components/SectionHeading.vue'
import BgWord from '@/components/BgWord.vue'
import AsyncState from '@/components/AsyncState.vue'

const team = useAsync(getTeam)
const members = useAsync(getMembers)

function handle(url) {
  return url ? url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') : ''
}
</script>

<template>
  <div>
    <section class="section section--dark">
      <BgWord text="Kontak" />
      <div class="container">
        <SectionHeading
          eyebrow="Kontak"
          title="Hubungi Tim"
          subtitle="Untuk kolaborasi, pertanyaan proyek, atau sekadar menyapa."
        />
        <AsyncState :loading="team.loading.value" :error="team.error.value" :skeletons="3" @retry="team.reload">
          <ul v-if="team.data.value" class="channels">
            <li>
              <a class="channel" :href="`mailto:${team.data.value.email}`">
                <span class="channel__type">Email</span>
                <span class="channel__value">{{ team.data.value.email }}</span>
              </a>
            </li>
            <li>
              <a class="channel" :href="team.data.value.github" target="_blank" rel="noopener">
                <span class="channel__type">GitHub</span>
                <span class="channel__value">{{ handle(team.data.value.github) }}</span>
              </a>
            </li>
            <li>
              <a class="channel" :href="team.data.value.linkedin" target="_blank" rel="noopener">
                <span class="channel__type">LinkedIn</span>
                <span class="channel__value">{{ handle(team.data.value.linkedin) }}</span>
              </a>
            </li>
          </ul>
        </AsyncState>
      </div>
    </section>

    <section class="section section--light section--framed">
      <div class="container">
        <SectionHeading eyebrow="Direktori" title="Kontak Anggota" align="left" />
        <AsyncState :loading="members.loading.value" :error="members.error.value" :skeletons="5" @retry="members.reload">
          <div class="table-wrap">
            <table class="directory">
              <thead>
                <tr>
                  <th scope="col">Nama</th>
                  <th scope="col">Peran</th>
                  <th scope="col">Email</th>
                  <th scope="col">GitHub</th>
                  <th scope="col">LinkedIn</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="m in members.data.value" :key="m.id">
                  <th scope="row" class="directory__name">{{ m.name }}</th>
                  <td data-label="Peran">{{ m.role }}</td>
                  <td data-label="Email"><a :href="`mailto:${m.email}`">{{ m.email }}</a></td>
                  <td data-label="GitHub"><a :href="m.github" target="_blank" rel="noopener">{{ handle(m.github) }}</a></td>
                  <td data-label="LinkedIn"><a :href="m.linkedin" target="_blank" rel="noopener">{{ handle(m.linkedin) }}</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </AsyncState>
      </div>
    </section>
  </div>
</template>

<style scoped>
.channels {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.channel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 32px 28px;
  height: 100%;
  background: var(--navy-2);
  border-top: 4px solid var(--red);
  text-decoration: none;
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%);
  transition: background 0.25s var(--ease), transform 0.25s var(--ease);
}

.channel:hover {
  background: var(--red);
  transform: translateY(-4px);
}

.channel__type {
  font-family: var(--font-display);
  font-size: 2rem;
  text-transform: uppercase;
  color: var(--white);
}

.channel__value {
  font-family: var(--font-cond);
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--cream);
  word-break: break-all;
}

.table-wrap {
  overflow-x: auto;
}

.directory {
  width: 100%;
  border-collapse: collapse;
  background: var(--white);
  box-shadow: 10px 10px 0 var(--navy);
}

.directory th,
.directory td {
  padding: 16px 18px;
  text-align: left;
  border-bottom: 1px solid var(--cream-2);
  font-size: 0.95rem;
}

.directory thead th {
  background: var(--navy);
  color: var(--white);
  font-family: var(--font-cond);
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-size: 0.8rem;
}

.directory__name {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 1.3rem;
  text-transform: uppercase;
}

.directory a {
  text-decoration: none;
  border-bottom: 1px solid var(--red);
}

.directory a:hover {
  color: var(--red);
}

.directory tbody tr:hover {
  background: #faf8f5;
}

@media (max-width: 860px) {
  .channels {
    grid-template-columns: 1fr;
  }

  .directory thead {
    display: none;
  }
  .directory,
  .directory tbody,
  .directory tr,
  .directory th,
  .directory td {
    display: block;
    width: 100%;
  }
  .directory tr {
    padding: 12px 0;
    border-bottom: 3px solid var(--red);
  }
  .directory th,
  .directory td {
    border: 0;
    padding: 6px 18px;
  }
  .directory td::before {
    content: attr(data-label);
    display: block;
    font-family: var(--font-cond);
    font-weight: 700;
    font-size: 0.75rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted-light);
  }
}
</style>
