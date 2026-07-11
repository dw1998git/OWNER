<template>
  <section id="experience" class="section-padding">
    <div class="section-center">
      <h2 class="section-headline reveal">工作经历。</h2>
      <div class="reveal reveal-delay-1 work-body">
        <p class="work-date">2022.07 - 至今</p>
        <h3 class="work-title">自动化应用工程师</h3>
        <ul class="work-list">
          <li v-for="(item, i) in workItems" :key="i" class="work-item">
            <span class="work-dot"></span>
            {{ item }}
          </li>
        </ul>
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
  padding: 128px 32px;
}
.section-center {
  max-width: 680px;
  margin: 0 auto;
}
.work-body {
  margin-top: 48px;
}
.work-date {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-accent);
  margin-bottom: 8px;
}
.work-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: 20px;
}
.work-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.work-item {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: 1.7;
  padding-left: 20px;
  position: relative;
}
.work-dot {
  position: absolute;
  left: 0;
  top: 10px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-teal);
}
</style>
