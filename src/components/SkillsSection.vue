<template>
  <section id="skills" class="section-alt">
    <div class="skills-inner">
      <h2 class="section-headline reveal float-in">个人技能</h2>
      <p class="section-sub reveal reveal-delay-1">4年自动化领域机器人集成经验，掌握机器人、视觉、电气、上位机等技术能力</p>
      <div class="skills-content-area">
        <!-- 视频 -->
        <div class="video-wrap full-bleed reveal reveal-delay-2">
          <video
            ref="videoRef"
            class="skills-video"
            autoplay
            muted
            loop
            playsinline
            webkit-playsinline
            preload="auto"
            src="@/assets/show.mp4"
          ></video>
          <!-- 四边羽化遮罩 -->
          <div class="video-fade-top"></div>
          <div class="video-fade-bottom"></div>
          <div class="video-fade-left"></div>
          <div class="video-fade-right"></div>
        </div>
        <!-- 卡片 -->
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
import { ref, onMounted } from 'vue'
import { skills } from '../data/skills.js'
import PixelCard from './PixelCard.vue'

const videoRef = ref(null)

onMounted(() => {
  const tryPlay = () => {
    if (videoRef.value) {
      videoRef.value.play().catch(() => {
        document.addEventListener('touchstart', () => {
          videoRef.value?.play()
        }, { once: true })
      })
    }
  }
  tryPlay()
})
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
.skills-content-area {
  display: flex;
  flex-direction: column;
  gap: 48px;
  margin-top: 48px;
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

/* 四边羽化遮罩 */
.video-fade-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(to bottom, var(--color-bg-section-alt), transparent);
  pointer-events: none;
  z-index: 2;
}
.video-fade-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(to top, var(--color-bg-section-alt), transparent);
  pointer-events: none;
  z-index: 2;
}
.video-fade-left {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 80px;
  background: linear-gradient(to right, var(--color-bg-section-alt), transparent);
  pointer-events: none;
  z-index: 2;
}
.video-fade-right {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 80px;
  background: linear-gradient(to left, var(--color-bg-section-alt), transparent);
  pointer-events: none;
  z-index: 2;
}

/* 卡片 */
.cards-section {
  display: flex;
  justify-content: center;
}
.skills-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  overflow: hidden;
}
.skill-card {
  /* PixelCard 自带样式 */
}

@media (min-width: 1024px) {
  .skills-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    width: auto;
    margin: 0;
    overflow: visible;
    max-width: none;
  }
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

@media (max-width: 1023px) {
  .video-fade-left {
    width: 30px;
  }
  .video-fade-right {
    width: 30px;
  }
  .video-fade-top {
    height: 40px;
  }
  .video-fade-bottom {
    height: 40px;
  }
}
@media (max-width: 480px) {
  .skills-grid {
    gap: 10px;
  }
}
</style>