<template>
  <section id="experience" class="section-padding">
    <div class="section-center">
      <div class="reveal work-intro">
        <p class="work-subtitle">Robotics Application Engineer</p>
        <h2 class="work-name">王 伟</h2>
        <p class="work-tagline">4年自动化与机器人系统集成经验</p>
      </div>
      <div class="reveal reveal-delay-1 work-body">
        <h3 class="section-headline" style="text-align: left;">工作经历。</h3>
        <div style="margin-top: 36px;">
          <p class="work-date">2022.07 - 至今</p>
          <h3 class="work-title">自动化应用工程师</h3>
          <ul class="work-list stagger-group">
          <li v-for="(item, i) in workItems" :key="i" class="work-item stagger-item">
            <span class="work-dot"></span>
            {{ item }}
          </li>
        </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const workItems = [
  '独立完成非标自动化设备电气方案设计，搭建软硬件系统架构',
  'EPLAN电气原理图绘制、PLC与触摸屏程序开发及现场调试',
  '集成工业机器人、机器视觉与传感器系统，实现自动化上下料、检测、焊接等工艺',
  '参与MES/ERP系统对接，完成生产数据实时采集与信息化管理'
]
</script>

<style scoped>
.section-padding {
  padding: 96px 32px 128px;
}
.section-center {
  max-width: 720px;
  margin: 0 auto;
}
.work-intro {
  text-align: center;
  margin-bottom: 64px;
}
.work-subtitle {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-accent);
  letter-spacing: 0.1em;
  margin-bottom: 20px;
}
.work-name {
  font-family: var(--font-display);
  font-size: clamp(3.5rem, 10vw, 5.5rem);
  font-weight: var(--font-bold);
  line-height: 1.02;
  letter-spacing: -0.04em;
  color: var(--color-text-primary);
  background: linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-text-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.work-tagline {
  font-size: clamp(1.25rem, 2.5vw, 1.5rem);
  font-weight: var(--font-light);
  color: var(--color-text-secondary);
  margin-top: 20px;
  letter-spacing: 0.02em;
}
.work-body {
  margin-top: 0;
}
.work-date {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-accent);
  margin-bottom: 10px;
  letter-spacing: 0.04em;
}
.work-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: 24px;
}
.work-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.work-item {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  line-height: 1.8;
  padding-left: 22px;
  position: relative;
}
.work-dot {
  position: absolute;
  left: 0;
  top: 12px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-teal);
  box-shadow: 0 0 8px rgba(48, 213, 200, 0.4);
}
</style>