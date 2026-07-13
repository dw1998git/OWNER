<template>
  <section class="hero-section">
    <!-- Desktop/tablet: Spline 3D iframe -->
    <iframe
      v-if="!isMobile"
      class="hero-spline"
      src="https://my.spline.design/nexbotrobotcharacterconcept-1MIwEp5wfARNeeSaHr6zmKMt/"
      frameborder="0"
      allow="autoplay"
    ></iframe>
    <!-- Mobile: lightweight static fallback -->
    <div v-else class="hero-mobile-fallback">
      <div class="hero-mobile-glow"></div>
    </div>
    <div class="hero-overlay"></div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isMobile = ref(false)
onMounted(() => {
  isMobile.value = window.innerWidth < 768
})
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
}
.hero-mobile-fallback {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(ellipse at 50% 40%, #d1d1d6 0%, #f5f5f7 70%);
}
.hero-mobile-glow {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0,113,227,0.15) 0%, transparent 70%);
  animation: pulse 3s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.3); opacity: 1; }
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
