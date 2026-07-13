<template>
  <section id="skills" class="section-alt">
    <div class="skills-inner">
      <h2 class="section-headline reveal float-in">个人技能</h2>
      <p class="section-sub reveal reveal-delay-1">4年自动化领域机器人集成经验，掌握机器人、视觉、电气、上位机等技术能力</p>
      <div class="skills-content-area">
        <div class="video-section">
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
        </div>
        <div class="cards-section">
          <div class="skills-grid">
            <div
              v-for="(skill, index) in skills"
              :key="skill.name"
              class="skill-card"
              :style="{ transitionDelay: index * 100 + 'ms' }"
            >
              <PixelCard variant="blue">
                <div class="skill-content">
                  <h4 class="skill-name">{{ skill.name }}</h4>
                  <p class="skill-desc">{{ skill.desc }}</p>
                  <p class="skill-level">{{ skill.level }}%</p>
                </div>
              </PixelCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { skills } from '../data/skills.js'
import PixelCard from './PixelCard.vue'
</script>

<style scoped>
.section-alt {
  padding: 128px 32px;
  background: var(--color-bg-section-alt);
}
.skills-inner {
  max-width: 1200px; /* 增加最大宽度以容納兩部分 */
  margin: 0 auto;
}
.skills-content-area {
  display: flex;
  flex-direction: column;
  gap: 48px;
  margin-top: 48px;
}
.video-section {
  width: 100%;
}
.cards-section {
  width: 100%;
  display: flex;
  justify-content: flex-end; /* 右側對齊 */
}
.video-wrap {
  width: 100%;
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
  width: fit-content; /* 讓網格只佔用必要的寬度 */
  max-width: 100%; /* 但不超過容器 */
}
.skill-card {
  /* 移除原来的 highlight-card 样式 */
}
.skill-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  z-index: 10;
}
.skill-name {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: 10px;
}
.skill-desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-top: 10px;
  line-height: 1.7;
}
.skill-level {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  margin-top: 10px;
  font-family: var(--font-mono);
  font-weight: var(--font-semibold);
}
</style>