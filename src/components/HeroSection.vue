<template>
  <section class="hero-section">
    <iframe
      class="hero-spline"
      src="https://my.spline.design/nexbotrobotcharacterconcept-1MIwEp5wfARNeeSaHr6zmKMt/"
      frameborder="0"
      allow="autoplay"
      loading="eager"
    ></iframe>
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
  border: none;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 55%,
    rgba(245, 245, 247, 0.7) 80%,
    rgba(245, 245, 247, 1) 100%
  );
}

@media (max-width: 768px) {
  .hero-section {
    min-height: 50vh;
  }
}
@media (max-width: 480px) {
  .hero-section {
    min-height: 40vh;
    height: 60vh;
  }
}
</style>
