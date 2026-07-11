<template>
  <section id="education" class="section-padding">
    <div class="section-center">
      <h2 class="section-headline reveal">教育背景。</h2>
      <div class="reveal reveal-delay-1 edu-body">
        <p class="edu-date">2018 - 2022</p>
        <h3 class="edu-school">三江学院</h3>
        <p class="edu-degree">本科 | 机器人竞赛一等奖</p>
        <ul class="edu-list">
          <li v-for="(item, i) in eduItems" :key="i" class="edu-item">
            <span class="edu-dot"></span>
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
const eduItems = [
  '传感器模块：红外+超声波传感器融合，实现障碍物实时检测与距离测算',
  '控制模块：基于51单片机开发传感器数据处理与路径决策算法，实现自主避障',
  '驱动模块：设计PWM脉宽调制方案，实现电机精准调速与加减速平滑控制',
  '优化系统响应速度与避障策略，显著提升机器人运行稳定性'
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
.edu-body {
  margin-top: 48px;
}
.edu-date {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-accent);
  margin-bottom: 8px;
}
.edu-school {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: 4px;
}
.edu-degree {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: 16px;
}
.edu-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.edu-item {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.7;
  padding-left: 20px;
  position: relative;
}
.edu-dot {
  position: absolute;
  left: 0;
  top: 10px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-teal);
}
</style>
