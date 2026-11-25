<script setup>
import { defineAsyncComponent, ref } from 'vue'
import BrandMark from './BrandMark.vue'

const EditorModal = defineAsyncComponent(() => import('./editor/EditorModal.vue'))

const year = new Date().getFullYear()
const editorOpen = ref(false)
</script>

<template>
  <footer class="footer">
    <div class="container footer__grid">
      <div>
        <BrandMark />
        <p class="footer__note">Portofolio tim untuk UAS UI/UX Lanjut, semester 7.</p>
      </div>

      <nav aria-label="Navigasi footer">
        <h4 class="footer__title">Navigasi</h4>
        <ul>
          <li><RouterLink to="/">Beranda</RouterLink></li>
          <li><RouterLink to="/tim">Tentang Tim</RouterLink></li>
          <li><RouterLink to="/proyek">Proyek</RouterLink></li>
          <li><RouterLink to="/kontak">Kontak</RouterLink></li>
        </ul>
      </nav>

      <div>
        <h4 class="footer__title">Misi</h4>
        <p class="footer__note">Lima peran, satu tujuan: produk digital yang jelas dan mudah dipakai.</p>
        <button type="button" class="footer__edit" aria-haspopup="dialog" @click="editorOpen = true">Edit Data</button>
      </div>
    </div>

    <div class="container footer__bottom">
      <span>&copy; {{ year }} Kelompok 3. Seluruh hak cipta dilindungi.</span>
      <span>Dibuat dengan Vue 3 + Vite</span>
    </div>

    <EditorModal v-if="editorOpen" @close="editorOpen = false" />
  </footer>
</template>

<style scoped>
.footer {
  background: #0a1118;
  color: var(--cream);
  padding: 64px 0 24px;
  border-top: 4px solid var(--red);
}

.footer__grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 40px;
}

.footer__title {
  font-size: 1.1rem;
  letter-spacing: 0.08em;
  margin-bottom: 14px;
  color: var(--white);
}

.footer__note {
  margin-top: 12px;
  font-size: 0.92rem;
  color: var(--muted);
  max-width: 34ch;
}

.footer a {
  display: inline-block;
  padding: 4px 0;
  font-family: var(--font-cond);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-size: 0.88rem;
  text-decoration: none;
  color: var(--muted);
  transition: color 0.2s var(--ease);
}

.footer a:hover {
  color: var(--red);
}

.footer__edit {
  margin-top: 18px;
  padding: 10px 18px;
  background: transparent;
  border: 1px solid var(--red);
  color: var(--red);
  font-family: var(--font-cond);
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s var(--ease), color 0.2s var(--ease);
}

.footer__edit:hover {
  background: var(--red);
  color: var(--white);
}

.footer__bottom {
  margin-top: 48px;
  padding-top: 20px;
  border-top: 1px solid rgba(236, 232, 225, 0.1);
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 0.8rem;
  color: var(--muted-light);
  letter-spacing: 0.04em;
}

@media (max-width: 760px) {
  .footer__grid {
    grid-template-columns: 1fr;
  }
}
</style>
