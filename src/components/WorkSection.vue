<template>
  <!-- 经历内容已全部由右上角 3D 工牌承载，此处仅保留零高度的导航锚点 -->
  <div id="experience"></div>

  <!-- 固定在页面右上角的 3D 工牌：向下滚动时与页面滚动联动向上收起 -->
  <div
    v-if="cardFaceImage"
    class="lanyard-fixed-stage"
    :class="{ 'is-retracted': retract >= 1 }"
    :style="{ transform: `translateY(${(-retract * 100).toFixed(2)}%)` }"
  >
    <ReactLanyard
      :position="[-2.9, 0, 22]"
      :gravity="[0, -40, 0]"
      :fov="20"
      :transparent="true"
      :front-image="cardFaceImage"
      image-fit="cover"
    />
    <span class="lanyard-corner-hint">拖拽</span>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import ReactLanyard from './lanyard/ReactLanyard.vue'

const workItems = [
  '1、负责工厂非标机器人、具身智能落地方案设计，搭建机器人+机器视觉+具身智能融合软硬件架构，完成设备智能化开发、调试与落地应用',
  '2、负责PLC开发，伺服控制、HMI交互程序，电控算法、机器人运动控制、标定及精度调试，主导现场联调与工艺落地',
  '3、集成六轴协作臂、Halcon 3D视觉及多类工业传感器，掌握2D/3D图像处理、相机标定、畸变校正、光源选型等技术，落地自动上下料、高精度检测、激光焊接智能工艺',
  '4、基于 C/Python 开发上位机程序，对接 MES/ERP 搭建数据采集接口，依托 Cursor、Vibe Coding 等 AI 工具加速开发迭代'
]

const cardFaceImage = ref(null)

// 0 = 完全展开，1 = 完全收起
const retract = ref(0)
let ticking = null

// 与页面滚动实时联动：向下滚动多少，工牌就同步向上拉出多少；
// 滚动约一屏高度后完全收完，向上回滚时按同样比例复原。
const updateRetract = () => {
  ticking = null
  const vh = window.innerHeight || 1
  const p = window.scrollY / (vh * 0.9)
  retract.value = Math.min(1, Math.max(0, p))
}

// rAF 节流，与浏览器绘制同频，保证滚动和上拉动作不脱节
const onScroll = () => {
  if (ticking) return
  ticking = requestAnimationFrame(updateRetract)
}

function generateCardFace() {
  const W = 500, H = 750
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  // 深色渐变背景
  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, '#0a0a14')
  bg.addColorStop(1, '#161630')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // 顶部装饰条
  const bar = ctx.createLinearGradient(0, 0, W, 0)
  bar.addColorStop(0, '#0071e3')
  bar.addColorStop(1, '#30d5c8')
  ctx.fillStyle = bar
  ctx.fillRect(0, 0, W, 6)

  // 标签文字
  ctx.fillStyle = '#30d5c8'
  ctx.font = '600 18px "SF Mono","JetBrains Mono","Fira Code",monospace'
  ctx.textBaseline = 'top'
  ctx.textAlign = 'left'
  ctx.fillText('WORK EXPERIENCE', 34, 40)

  // 姓名
  ctx.fillStyle = '#ffffff'
  ctx.font = '700 58px "SF Pro Display","Inter","Noto Sans SC",sans-serif'
  ctx.fillText('王 伟', 34, 76)

  // 职位
  ctx.fillStyle = '#30d5c8'
  ctx.font = '500 26px "SF Pro Text","Inter","Noto Sans SC",sans-serif'
  ctx.fillText('机器人应用开发工程师', 34, 154)

  // 日期
  ctx.fillStyle = '#86868b'
  ctx.font = '400 20px "SF Mono","JetBrains Mono",monospace'
  ctx.fillText('2022.07 - 至今', 34, 194)

  // 分割线
  ctx.strokeStyle = 'rgba(48,213,200,0.28)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(34, 234)
  ctx.lineTo(W - 34, 234)
  ctx.stroke()

  // 工作内容
  ctx.font = '400 19px "SF Pro Text","Inter","Noto Sans SC",sans-serif'
  const maxWidth = W - 104
  let y = 262

  workItems.forEach(item => {
    ctx.fillStyle = '#30d5c8'
    ctx.beginPath()
    ctx.arc(44, y + 10, 4.5, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#dcdce4'
    let line = ''
    for (const ch of item) {
      const test = line + ch
      if (ctx.measureText(test).width > maxWidth) {
        ctx.fillText(line, 62, y)
        line = ch
        y += 29
      } else {
        line = test
      }
    }
    ctx.fillText(line, 62, y)
    y += 38
  })

  // 底部装饰
  const footer = ctx.createLinearGradient(0, H - 56, W, H - 56)
  footer.addColorStop(0, 'rgba(0,113,227,0.08)')
  footer.addColorStop(1, 'rgba(48,213,200,0.08)')
  ctx.fillStyle = footer
  ctx.fillRect(0, H - 56, W, 56)

  ctx.fillStyle = '#86868b'
  ctx.font = '400 14px "SF Mono","JetBrains Mono",monospace'
  ctx.textAlign = 'center'
  ctx.fillText('ROBOTICS · VISION · AI', W / 2, H - 34)
  ctx.textAlign = 'left'

  return canvas.toDataURL('image/png')
}

onMounted(() => {
  cardFaceImage.value = generateCardFace()
  updateRetract()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (ticking) cancelAnimationFrame(ticking)
})
</script>

<style scoped>
/* 固定在页面右上角，紧贴顶部，放大3倍 */
.lanyard-fixed-stage {
  position: fixed;
  top: 0;
  right: 0;
  width: 900px;
  height: 1200px;
  z-index: 100;
  overflow: hidden;
  will-change: transform;
}

.lanyard-fixed-stage.is-retracted {
  pointer-events: none;
  visibility: hidden;
}

.lanyard-corner-hint {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-family: var(--font-mono);
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  pointer-events: none;
  z-index: 2;
  letter-spacing: 0.08em;
}

@media (max-width: 768px) {
  .lanyard-fixed-stage {
    width: 600px;
    height: 800px;
    top: 0;
    right: 0;
  }
}

@media (max-width: 480px) {
  .lanyard-fixed-stage {
    width: 480px;
    height: 660px;
    top: 0;
    right: 0;
  }
  .lanyard-corner-hint {
    display: none;
  }
}
</style>
