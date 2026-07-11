<template>
  <section class="hero-section">
    <img class="hero-bg" src="@/assets/hero-robotics.jpg" alt="Robotics engineering background">
    <canvas ref="heroSpotlightCanvas" id="hero-spotlight-canvas"></canvas>
    <div ref="heroRevealLayer" id="hero-reveal-layer" :style="revealStyle"></div>
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <p class="reveal hero-subtitle">Robotics Application Engineer</p>
      <h1 class="reveal reveal-delay-1 hero-title">王 伟</h1>
      <p class="reveal reveal-delay-2 hero-desc">4年自动化与机器人系统集成经验</p>
      <div class="reveal reveal-delay-3 hero-ctas">
        <a href="#projects" class="cta-primary">查看项目</a>
        <a href="#skills" class="cta-secondary">了解技能</a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useSpotlight } from '../composables/useSpotlight.js'

const { spotlightCanvas: heroSpotlightCanvas, revealLayer: heroRevealLayer } = useSpotlight()
</script>

<style scoped>
.hero-section {
  position: relative;
  height: 100vh;
  min-height: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.hero-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
}
.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 0 32px;
  max-width: 980px;
}
.hero-subtitle {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-accent);
  letter-spacing: 0.08em;
  margin-bottom: 20px;
}
.hero-title {
  font-family: var(--font-display);
  font-size: clamp(4.5rem, 10vw, 6rem);
  font-weight: var(--font-bold);
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: var(--color-text-primary);
  text-wrap: balance;
}
.hero-desc {
  font-size: clamp(1.25rem, 2.5vw, 1.5rem);
  font-weight: var(--font-light);
  color: var(--color-text-secondary);
  margin-top: 20px;
  line-height: 1.5;
}
.hero-ctas {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 40px;
  flex-wrap: wrap;
}
</style>
