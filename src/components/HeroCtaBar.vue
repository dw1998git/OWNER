<template>
  <section class="hero-cta-bar">
    <div class="cta-inner">
      <a href="#projects" class="cta-primary">查看项目</a>
      <a href="#skills" class="cta-secondary">了解技能</a>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.hero-cta-bar {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: center;
  padding: 32px 32px 64px;
  margin-top: -80px;
}
.cta-inner {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
</style>
