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
      <div
        class="skills-grid"
        :class="{ 'has-active': activeIndex !== null }"
        :style="gridStyle"
      >
        <div
          v-for="(skill, index) in skills"
          :key="skill.name"
          class="skill-card tilt-card"
          :class="{
            'card-active': activeIndex === index,
            'card-compressed': activeIndex !== null && activeIndex !== index
          }"
          :style="getCardStyle(index)"
          @click="toggleCard(index)"
        >
          <div class="card-inner">
            <h4 class="skill-name">{{ skill.name }}</h4>
            <p class="skill-desc">{{ skill.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { skills } from '../data/skills.js'

const activeIndex = ref(null)

// Grid position helpers (3 cols x 2 rows)
function getPosition(index) {
  const col = index % 3
  const row = Math.floor(index / 3)
  return { col, row }
}

const gridStyle = computed(() => {
  if (activeIndex.value === null) return {}
  return { 'grid-template-columns': '1fr 1fr 1fr', 'grid-template-rows': '1fr 1fr' }
})

function getCardStyle(index) {
  if (activeIndex.value === null) return {}

  const { col, row } = getPosition(index)
  const pos = getPosition(activeIndex.value)

  // Determine transform-origin and grid-area based on active card position
  if (activeIndex.value === index) {
    // Active card: spans 2 cols and 2 rows
    return {
      gridColumn: `${col + 1} / span 2`,
      gridRow: `${row + 1} / span 2`,
      zIndex: 2
    }
  }

  // Compressed cards: shrink to 1 col
  const ownCol = col
  // Check if active card is in same row
  if (row === pos.row) {
    // Same row: get pushed to remaining column
    const availableCols = [0, 1, 2].filter(c => c !== pos.col && c !== pos.col + 1)
    if (availableCols.includes(ownCol)) {
      return {
        gridColumn: `${ownCol + 1}`,
        gridRow: `${row + 1}`,
        zIndex: 1
      }
    }
    // Own column is taken by active card - stack in available
    return {
      gridColumn: `${availableCols[0] + 1}`,
      gridRow: `${row + 1}`,
      zIndex: 1
    }
  }

  return {
    gridColumn: `${ownCol + 1}`,
    gridRow: `${row + 1}`,
    zIndex: 1
  }
}

function toggleCard(index) {
  activeIndex.value = activeIndex.value === index ? null : index
}
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
  grid-template-rows: auto auto;
  gap: 16px;
  margin-top: 48px;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.skill-card {
  position: relative;
  background: var(--color-card-bg, rgba(255,255,255,0.6));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 28px 24px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  min-height: 200px;
}
.skill-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(0,113,227,0.05) 0%, rgba(48,213,200,0.05) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
}
.skill-card:hover::before {
  opacity: 1;
}
.skill-card.card-active {
  background: rgba(255,255,255,0.85);
  box-shadow: 0 8px 40px rgba(0,113,227,0.12), 0 0 0 1px rgba(0,113,227,0.08);
}
.skill-card.card-active::before {
  opacity: 1;
}
.skill-card.card-compressed {
  min-height: 120px;
  opacity: 0.7;
  transform: scale(0.97);
}
.card-inner {
  position: relative;
  z-index: 1;
}
.skill-name {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  transition: font-size 0.4s ease;
}
.skill-desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-top: 10px;
  line-height: 1.7;
  opacity: 0.8;
  transition: font-size 0.4s ease, opacity 0.4s ease, margin-top 0.4s ease;
}
.card-active .skill-name {
  font-size: clamp(1.5rem, 3vw, 2rem);
}
.card-active .skill-desc {
  font-size: var(--text-base);
  opacity: 1;
  margin-top: 16px;
  line-height: 1.9;
}
.card-compressed .skill-desc {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  margin-top: 0;
}

@media (max-width: 768px) {
  .section-alt {
    padding: 80px 16px;
  }
  .skills-video {
    height: 280px;
  }
  .skills-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-top: 32px;
  }
  .skill-card {
    min-height: auto;
    padding: 20px 16px;
  }
  .skill-card.card-active {
    grid-column: 1;
    grid-row: auto;
    min-height: auto;
  }
  .skill-card.card-compressed {
    min-height: auto;
    opacity: 0.5;
    transform: scale(0.98);
  }
  .card-compressed .skill-desc {
    max-height: 0;
  }
}
</style>
