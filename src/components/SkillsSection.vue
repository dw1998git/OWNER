<template>
  <section id="skills" class="section-alt">
    <div class="skills-inner">
      <h2 class="section-headline reveal">技术实力，<br>全面覆盖。</h2>
      <p class="section-sub reveal reveal-delay-1">4年深耕自动化领域，掌握机器人、视觉、电气、上位机全栈技术能力</p>
      <div class="full-bleed reveal reveal-delay-2">
        <img src="@/assets/section-vision.jpg" alt="Machine vision technology" style="height: 500px; object-fit: cover;">
      </div>
      <div class="skills-grid">
        <div
          v-for="(skill, index) in skills"
          :key="skill.name"
          class="highlight-card skill-card reveal"
          :class="`reveal-delay-${index + 3}`"
        >
          <h4 class="skill-name">{{ skill.name }}</h4>
          <p class="skill-desc">{{ skill.desc }}</p>
          <p class="skill-level">{{ skill.level }}%</p>
          <div class="skill-progress-bg">
            <div class="skill-progress-bar" :data-width="skill.level" style="width: 0%;"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { skills } from '../data/skills.js'
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
.skills-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 48px;
}
.skill-name {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}
.skill-desc {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  margin-top: 8px;
  line-height: 1.6;
}
.skill-level {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-top: 8px;
}
</style>
