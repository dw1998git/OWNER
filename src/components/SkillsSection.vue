<template>
  <section id="skills" class="section-alt">
    <div class="skills-inner">
      <h2 class="section-headline reveal float-in">个人技能</h2>
      <p class="section-sub reveal reveal-delay-1">4年自动化领域机器人集成经验，掌握机器人、视觉、电气、上位机等技术能力</p>
      <div class="skills-content-wrapper">
        <div class="video-wrap reveal reveal-delay-2">
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
          <div class="video-fade-left"></div>
          <div class="video-fade-right"></div>
        </div>
        <div class="skills-grid">
          <div
            v-for="(skill, index) in skills"
            :key="skill.name"
            class="skill-card-no-bg"
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
  max-width: 1200px;
  margin: 0 auto;
}
.skills-content-wrapper {
  display: flex;
  gap: 24px;
  margin-top: 48px;
}
.video-wrap {
  position: relative;
  flex: 1;
  min-width: 0; /* Allow flex item to shrink below content size */
  border-radius: 20px;
  overflow: hidden;
  height: 500px; /* Match the height of the skill cards container */
}
.skills-video {
  width: 100%;
  height: 100%;
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
  z-index: 1;
}
.video-fade-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(to top, var(--color-bg-section-alt), transparent);
  pointer-events: none;
  z-index: 1;
}
.video-fade-left {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 40px;
  background: linear-gradient(to right, var(--color-bg-section-alt), transparent);
  pointer-events: none;
  z-index: 1;
}
.video-fade-right {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 40px;
  background: linear-gradient(to left, var(--color-bg-section-alt), transparent);
  pointer-events: none;
  z-index: 1;
}
.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Two columns for the skill cards */
  gap: 20px;
  width: 320px; /* Fixed width for the skill cards area */
}
.skill-card-no-bg {
  position: relative;
  border: none;
  background: transparent;
  box-shadow: none;
  padding: 0;
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

/* Responsive adjustments */
@media (max-width: 1024px) {
  .skills-content-wrapper {
    flex-direction: column;
  }
  .skills-grid {
    width: 100%;
    grid-template-columns: repeat(3, 1fr);
  }
  .video-wrap {
    height: 300px;
  }
}

@media (max-width: 768px) {
  .skills-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }
}
</style>