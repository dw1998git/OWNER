<template>
  <section class="hero-section">
    <iframe
      class="hero-spline"
      src="https://my.spline.design/nexbotrobotcharacterconcept-1MIwEp5wfARNeeSaHr6zmKMt/"
      frameborder="0"
      loading="lazy"
      allow="autoplay"
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
  min-height: 600px;
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
</style>
