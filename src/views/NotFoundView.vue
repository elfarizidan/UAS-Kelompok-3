<script setup>
import Button from '@/components/common/Button.vue'
</script>

<template>
  <main class="not-found">
    <div class="container not-found__inner">
      <span class="not-found__code">404</span>
      <h1 class="not-found__title">Halaman Tidak Ditemukan</h1>
      <p class="not-found__desc">
        Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tautan yang Anda tuju salah.
      </p>
      <div class="not-found__actions">
        <Button as="router-link" to="/" size="lg">Kembali ke Beranda</Button>
        <Button as="router-link" to="/projects" variant="outline" size="lg">Lihat Proyek</Button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.not-found {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-20) 0;
  text-align: center;
}

.not-found__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 540px;
}

.not-found__code {
  font-family: var(--font-display);
  font-size: clamp(5rem, 12vw, 9rem);
  font-weight: 800;
  line-height: 1;
  color: var(--color-highlight);
  letter-spacing: -0.05em;
  margin-bottom: var(--space-2);
}

.not-found__title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  margin-bottom: var(--space-4);
}

.not-found__desc {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-8);
}

.not-found__actions {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
  justify-content: center;
}
</style>
