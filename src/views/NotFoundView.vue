<template>
  <section class="section section--dark nf">
    <div class="container nf__inner">
      <span class="nf__code">404</span>
      <h1 class="nf__title">Halaman tidak ditemukan</h1>
      <RouterLink to="/" class="btn">Kembali ke Beranda</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.nf {
  min-height: 70vh;
  display: flex;
  align-items: center;
}

.nf__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
}

.nf__code {
  font-family: var(--font-display);
  font-size: clamp(7rem, 25vw, 16rem);
  line-height: 0.8;
  color: transparent;
  -webkit-text-stroke: 2px var(--red);
}

.nf__title {
  font-size: clamp(1.8rem, 4vw, 3rem);
}
</style>
