<template>
  <section class="hero-section">
    <spline-viewer
      class="hero-spline"
      url="https://prod.spline.design/1MIwEp5wfARNeeSa/scene.splinecode"
      loading="lazy"
    ></spline-viewer>
    <div class="hero-overlay"></div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.hero-section {
  position: relative;
  height: 100vh;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.hero-spline {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: auto;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 60%,
    rgba(245, 245, 247, 0.8) 85%,
    rgba(245, 245, 247, 1) 100%
  );
}

@media (max-width: 768px) {
  .hero-section {
    min-height: 60vh;
  }
}
</style>
