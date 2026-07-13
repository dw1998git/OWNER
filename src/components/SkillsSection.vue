<template>
  <section id="skills" class="section-alt">
    <div class="skills-inner">
      <h2 class="section-headline reveal float-in">个人技能</h2>
      <p class="section-sub reveal reveal-delay-1">4年自动化领域机器人集成经验，掌握机器人、视觉、电气、上位机等技术能力</p>
      <div class="full-bleed video-wrap reveal reveal-delay-2">
        <video
          class="skills-video"
          autoplay
          muted
          loop
          playsinline
          src="@/assets/show.mp4"
        ></video>
        <div class="video-fade-top"></div>
        <div class="video-fade-bottom"></div>
      </div>
      <div class="skills-grid">
        <PixelCard 
          v-for="(skill, index) in skills"
          :key="skill.name"
          :variant="'default'"
          class="pixel-card-wrapper"
          :style="{ transitionDelay: index * 100 + 'ms' }"
        >
          <div class="skill-card-content">
            <h4 class="skill-name">{{ skill.name }}</h4>
            <p class="skill-desc">{{ skill.desc }}</p>
            <p class="skill-level">{{ skill.level }}%</p>
          </div>
        </PixelCard>
      </div>
    </div>
  </section>
</template>

<script setup>
import { skills } from '../data/skills.js'
import PixelCard from '../components/PixelCard.vue'
</script>

<style scoped>
.section-alt {
  padding: 128px 32px;
  background: var(--color-bg-section-alt);
}
.skills-inner {
  max-width: 980px;
  margin: 0 auto;
}
.video-wrap {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
}
.skills-video {
  width: 100%;
  height: 500px;
  object-fit: cover;
  display: block;
}
.video-fade-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(to bottom, var(--color-bg-section-alt), transparent);
  pointer-events: none;
}
.video-fade-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(to top, var(--color-bg-section-alt), transparent);
  pointer-events: none;
}
.skills-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 48px;
}

/* PixelCard wrapper styles */
.pixel-card-wrapper {
  width: 100%;
  height: 100%;
  min-height: 300px; /* 确保最小高度 */
}

.skill-card-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 10;
  text-align: center;
  width: 100%;
  height: 100%;
}

.skill-name {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: 10px;
  z-index: 11;
}
.skill-desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-top: 10px;
  line-height: 1.7;
  z-index: 11;
  flex-grow: 1;
  display: flex;
  align-items: center;
}
.skill-level {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  margin-top: 10px;
  font-family: var(--font-mono);
  font-weight: var(--font-semibold);
  z-index: 11;
}

/* 调整 PixelCard 的样式以完全填充 */
.pixel-card {
  height: 100%;
  width: 100%;
  min-height: 300px;
  aspect-ratio: unset; /* 取消固定宽高比 */
  border-radius: 20px; /* 与网格圆角保持一致 */
}
</style>