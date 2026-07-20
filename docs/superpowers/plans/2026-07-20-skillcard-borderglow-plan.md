# SkillCard BorderGlow 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将技能卡片从 PixelCard（canvas 像素动画）替换为 BorderGlow（鼠标方向性发光边框 + mesh gradient）效果

**Architecture:** 新建 `SkillCard.vue` 组件（Vue 3 SFC）和 `useBorderGlow.js` composable，在 `SkillsSection.vue` 中替换 PixelCard，保留 PixelCard 原文件不动

**Tech Stack:** Vue 3 (Composition API), Vite, 纯 CSS（无额外依赖）

---

## 文件结构

| 操作 | 文件 | 职责 |
|------|------|------|
| 新增 | `src/composables/useBorderGlow.js` | 鼠标跟踪、边缘距离/角度计算、设备检测 |
| 新增 | `src/components/SkillCard.vue` | BorderGlow 卡片组件（模板 + 样式） |
| 修改 | `src/components/SkillsSection.vue` | 替换 PixelCard、新增移动端互斥逻辑 |
| 修改 | `src/data/skills.js` | 移除 `level` 字段 |

---

### Task 1: 创建 useBorderGlow.js composable

**Files:**
- Create: `src/composables/useBorderGlow.js`

- [ ] **Step 1: 写入 composable 代码**

```js
// src/composables/useBorderGlow.js
import { ref, onMounted, onUnmounted } from 'vue'

/**
 * BorderGlow 核心逻辑 composable
 * @param {import('vue').Ref<HTMLElement|null>} cardRef - 卡片 DOM 引用
 * @returns {{ edgeProximity, cursorAngle, isMobile, handlePointerMove, handlePointerLeave, startSweepAnimation }}
 */
export function useBorderGlow(cardRef) {
  const edgeProximity = ref(0)
  const cursorAngle = ref(45)
  const isMobile = ref(false)

  // 检测设备能力
  const checkDevice = () => {
    isMobile.value = !window.matchMedia('(hover: hover) and (pointer: fine)').matches
  }

  // 获取元素中心
  const getCenterOfElement = (el) => {
    const { width, height } = el.getBoundingClientRect()
    return [width / 2, height / 2]
  }

  // 计算边缘距离 (0~1)
  const getEdgeProximity = (el, x, y) => {
    const [cx, cy] = getCenterOfElement(el)
    const dx = x - cx
    const dy = y - cy
    let kx = Infinity
    let ky = Infinity
    if (dx !== 0) kx = cx / Math.abs(dx)
    if (dy !== 0) ky = cy / Math.abs(dy)
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1)
  }

  // 计算鼠标角度 (0~360deg)
  const getCursorAngle = (el, x, y) => {
    const [cx, cy] = getCenterOfElement(el)
    const dx = x - cx
    const dy = y - cy
    if (dx === 0 && dy === 0) return 0
    const radians = Math.atan2(dy, dx)
    let degrees = radians * (180 / Math.PI) + 90
    if (degrees < 0) degrees += 360
    return degrees
  }

  const handlePointerMove = (e) => {
    const card = cardRef.value
    if (!card || isMobile.value) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    edgeProximity.value = Math.round(getEdgeProximity(card, x, y) * 100 * 1000) / 1000
    cursorAngle.value = Math.round(getCursorAngle(card, x, y) * 1000) / 1000
  }

  const handlePointerLeave = () => {
    if (isMobile.value) return
    edgeProximity.value = 0
  }

  // 动画工具函数
  const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3)
  const easeInCubic = (x) => x * x * x

  const animateValue = ({ start = 0, end = 100, duration = 1000, delay = 0, ease = easeOutCubic, onUpdate, onEnd }) => {
    const t0 = performance.now() + delay
    const tick = () => {
      const elapsed = performance.now() - t0
      const t = Math.min(elapsed / duration, 1)
      onUpdate(start + (end - start) * ease(t))
      if (t < 1) {
        requestAnimationFrame(tick)
      } else if (onEnd) {
        onEnd()
      }
    }
    setTimeout(() => requestAnimationFrame(tick), delay)
  }

  let sweepCleanup = null

  const startSweepAnimation = () => {
    const card = cardRef.value
    if (!card) return

    // 检查 reduced-motion 偏好
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const angleStart = 110
    const angleEnd = 465

    card.classList.add('sweep-active')
    cursorAngle.value = angleStart

    animateValue({
      duration: 500,
      onUpdate: (v) => { edgeProximity.value = v }
    })
    animateValue({
      ease: easeInCubic,
      duration: 1500,
      end: 50,
      onUpdate: (v) => {
        cursorAngle.value = (angleEnd - angleStart) * (v / 100) + angleStart
      }
    })
    animateValue({
      ease: easeOutCubic,
      delay: 1500,
      duration: 2250,
      start: 50,
      end: 100,
      onUpdate: (v) => {
        cursorAngle.value = (angleEnd - angleStart) * (v / 100) + angleStart
      }
    })
    const cleanup = animateValue({
      ease: easeInCubic,
      delay: 2500,
      duration: 1500,
      start: 100,
      end: 0,
      onUpdate: (v) => { edgeProximity.value = v },
      onEnd: () => {
        card.classList.remove('sweep-active')
        edgeProximity.value = 0
      }
    })
    sweepCleanup = cleanup
  }

  // 清理
  const cleanup = () => {
    sweepCleanup = null
    if (cardRef.value) {
      cardRef.value.classList.remove('sweep-active')
    }
  }

  onMounted(() => {
    checkDevice()
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const onDeviceChange = () => checkDevice()
    mq.addEventListener('change', onDeviceChange)
    onUnmounted(() => {
      mq.removeEventListener('change', onDeviceChange)
      cleanup()
    })
  })

  return {
    edgeProximity,
    cursorAngle,
    isMobile,
    handlePointerMove,
    handlePointerLeave,
    startSweepAnimation,
    cleanup
  }
}
```

- [ ] **Step 2: 验证文件创建**

确认 `src/composables/useBorderGlow.js` 存在且语法正确。

- [ ] **Step 3: Commit**

```bash
git add src/composables/useBorderGlow.js
git commit -m "feat: add useBorderGlow composable for pointer tracking and edge glow"
```

---

### Task 2: 创建 SkillCard.vue 组件

**Files:**
- Create: `src/components/SkillCard.vue`

- [ ] **Step 1: 写入组件模板和脚本**

```vue
<!-- src/components/SkillCard.vue -->
<template>
  <div
    ref="cardRef"
    class="border-glow-card"
    :class="{ 'border-glow-card--active': isActive }"
    :style="cardStyle"
    @pointermove="handlePointerMove"
    @pointerleave="handlePointerLeave"
    @click="handleClick"
  >
    <span class="edge-light" />
    <div class="border-glow-inner">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useBorderGlow } from '../composables/useBorderGlow.js'

const props = defineProps({
  glowColor: { type: String, default: '200 80 60' },
  backgroundColor: { type: String, default: '#0f0f1a' },
  borderRadius: { type: Number, default: 28 },
  glowRadius: { type: Number, default: 40 },
  glowIntensity: { type: Number, default: 1.0 },
  edgeSensitivity: { type: Number, default: 30 },
  coneSpread: { type: Number, default: 25 },
  animated: { type: Boolean, default: false },
  colors: {
    type: Array,
    default: () => ['#c084fc', '#f472b6', '#38bdf8']
  },
  active: { type: Boolean, default: false },
  isMobile: { type: Boolean, default: false }
})

const emit = defineEmits(['toggle'])

const cardRef = ref(null)
const {
  edgeProximity,
  cursorAngle,
  handlePointerMove,
  handlePointerLeave,
  startSweepAnimation
} = useBorderGlow(cardRef)

// 移动端激活状态
const isActive = computed(() => {
  if (props.isMobile) return props.active
  return false
})

const handleClick = () => {
  if (props.isMobile) {
    emit('toggle')
  }
}

// 解析 HSL
const parseHSL = (hslStr) => {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/)
  if (!match) return { h: 40, s: 80, l: 80 }
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) }
}

// 构建光晕颜色变量
const buildGlowVars = (glowColor, intensity) => {
  const { h, s, l } = parseHSL(glowColor)
  const base = `${h}deg ${s}% ${l}%`
  const opacities = [100, 60, 50, 40, 30, 20, 10]
  const keys = ['', '-60', '-50', '-40', '-30', '-20', '-10']
  const vars = {}
  for (let i = 0; i < opacities.length; i++) {
    vars[`--glow-color${keys[i]}`] = `hsl(${base} / ${Math.min(opacities[i] * intensity, 100)}%)`
  }
  return vars
}

// 构建渐变颜色变量
const GRADIENT_POSITIONS = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%']
const GRADIENT_KEYS = ['--gradient-one', '--gradient-two', '--gradient-three', '--gradient-four', '--gradient-five', '--gradient-six', '--gradient-seven']
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1]

const buildGradientVars = (colors) => {
  const vars = {}
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)]
    vars[GRADIENT_KEYS[i]] = `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`
  }
  vars['--gradient-base'] = `linear-gradient(${colors[0]} 0 100%)`
  return vars
}

const glowVars = computed(() => buildGlowVars(props.glowColor, props.glowIntensity))
const gradientVars = computed(() => buildGradientVars(props.colors))

// CSS 变量
const cardStyle = computed(() => ({
  '--card-bg': props.backgroundColor,
  '--edge-sensitivity': props.edgeSensitivity,
  '--border-radius': `${props.borderRadius}px`,
  '--glow-padding': `${props.glowRadius}px`,
  '--cone-spread': props.coneSpread,
  '--edge-proximity': isActive.value ? 100 : edgeProximity.value,
  '--cursor-angle': isActive.value ? '45deg' : `${cursorAngle.value}deg`,
  ...glowVars.value,
  ...gradientVars.value
}))

// 入场动画
onMounted(() => {
  if (props.animated) {
    startSweepAnimation()
  }
})

// 监听 active 变化，移动端激活时触发光效
watch(() => props.active, (val) => {
  if (val && props.isMobile) {
    // 移动端激活：直接设置 edgeProximity 为 100
    edgeProximity.value = 100
  }
})
</script>
```

- [ ] **Step 2: 写入组件样式**

```vue
<style scoped>
.border-glow-card {
  --edge-proximity: 0;
  --cursor-angle: 45deg;
  --edge-sensitivity: 30;
  --color-sensitivity: calc(var(--edge-sensitivity) + 20);
  --border-radius: 28px;
  --glow-padding: 40px;
  --cone-spread: 25;

  position: relative;
  width: 300px;
  height: 400px;
  border-radius: var(--border-radius);
  isolation: isolate;
  transform: translate3d(0, 0, 0.01px);
  display: grid;
  border: 1px solid rgb(255 255 255 / 15%);
  background: var(--card-bg, #0f0f1a);
  overflow: visible;
  box-shadow:
    rgba(0, 0, 0, 0.1) 0px 1px 2px,
    rgba(0, 0, 0, 0.1) 0px 2px 4px,
    rgba(0, 0, 0, 0.1) 0px 4px 8px,
    rgba(0, 0, 0, 0.1) 0px 8px 16px,
    rgba(0, 0, 0, 0.1) 0px 16px 32px,
    rgba(0, 0, 0, 0.1) 0px 32px 64px;
  user-select: none;
}

/* 伪元素 + edge-light 三层共用 */
.border-glow-card::before,
.border-glow-card::after,
.border-glow-card > .edge-light {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  transition: opacity 0.25s ease-out;
  z-index: -1;
}

/* 非 hover 非 sweep 时隐藏 */
.border-glow-card:not(:hover):not(.sweep-active)::before,
.border-glow-card:not(:hover):not(.sweep-active)::after,
.border-glow-card:not(:hover):not(.sweep-active) > .edge-light {
  opacity: 0;
  transition: opacity 0.75s ease-in-out;
}

/* 移动端激活时强制显示 */
.border-glow-card--active::before,
.border-glow-card--active::after,
.border-glow-card--active > .edge-light {
  opacity: 1 !important;
  transition: opacity 0.25s ease-out !important;
}

/* ::before — mesh gradient 边框 */
.border-glow-card::before {
  border: 1px solid transparent;
  background:
    linear-gradient(var(--card-bg, #0f0f1a) 0 100%) padding-box,
    linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box,
    var(--gradient-one, radial-gradient(at 80% 55%, hsla(268, 100%, 76%, 1) 0px, transparent 50%)) border-box,
    var(--gradient-two, radial-gradient(at 69% 34%, hsla(349, 100%, 74%, 1) 0px, transparent 50%)) border-box,
    var(--gradient-three, radial-gradient(at 8% 6%, hsla(136, 100%, 78%, 1) 0px, transparent 50%)) border-box,
    var(--gradient-four, radial-gradient(at 41% 38%, hsla(192, 100%, 64%, 1) 0px, transparent 50%)) border-box,
    var(--gradient-five, radial-gradient(at 86% 85%, hsla(186, 100%, 74%, 1) 0px, transparent 50%)) border-box,
    var(--gradient-six, radial-gradient(at 82% 18%, hsla(52, 100%, 65%, 1) 0px, transparent 50%)) border-box,
    var(--gradient-seven, radial-gradient(at 51% 4%, hsla(12, 100%, 72%, 1) 0px, transparent 50%)) border-box,
    var(--gradient-base, linear-gradient(#c299ff 0 100%)) border-box;

  opacity: calc((var(--edge-proximity) - var(--color-sensitivity)) / (100 - var(--color-sensitivity)));

  mask-image:
    conic-gradient(
      from var(--cursor-angle) at center,
      black calc(var(--cone-spread) * 1%),
      transparent calc((var(--cone-spread) + 15) * 1%),
      transparent calc((100 - var(--cone-spread) - 15) * 1%),
      black calc((100 - var(--cone-spread)) * 1%)
    );
}

/* ::after — mesh gradient 背景填充 */
.border-glow-card::after {
  border: 1px solid transparent;
  background:
    var(--gradient-one, radial-gradient(at 80% 55%, hsla(268, 100%, 76%, 1) 0px, transparent 50%)) padding-box,
    var(--gradient-two, radial-gradient(at 69% 34%, hsla(349, 100%, 74%, 1) 0px, transparent 50%)) padding-box,
    var(--gradient-three, radial-gradient(at 8% 6%, hsla(136, 100%, 78%, 1) 0px, transparent 50%)) padding-box,
    var(--gradient-four, radial-gradient(at 41% 38%, hsla(192, 100%, 64%, 1) 0px, transparent 50%)) padding-box,
    var(--gradient-five, radial-gradient(at 86% 85%, hsla(186, 100%, 74%, 1) 0px, transparent 50%)) padding-box,
    var(--gradient-six, radial-gradient(at 82% 18%, hsla(52, 100%, 65%, 1) 0px, transparent 50%)) padding-box,
    var(--gradient-seven, radial-gradient(at 51% 4%, hsla(12, 100%, 72%, 1) 0px, transparent 50%)) padding-box,
    var(--gradient-base, linear-gradient(#c299ff 0 100%)) padding-box;

  mask-image:
    linear-gradient(to bottom, black, black),
    radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%),
    radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%),
    radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%),
    radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%),
    radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%),
    conic-gradient(from var(--cursor-angle) at center, transparent 5%, black 15%, black 85%, transparent 95%);

  mask-composite: subtract, add, add, add, add, add;
  opacity: calc(0.5 * (var(--edge-proximity) - var(--color-sensitivity)) / (100 - var(--color-sensitivity)));
  mix-blend-mode: soft-light;
}

/* edge-light — 外层光晕 */
.border-glow-card > .edge-light {
  inset: calc(var(--glow-padding) * -1);
  pointer-events: none;
  z-index: 1;

  mask-image:
    conic-gradient(
      from var(--cursor-angle) at center,
      black 2.5%, transparent 10%, transparent 90%, black 97.5%
    );

  opacity: calc((var(--edge-proximity) - var(--edge-sensitivity)) / (100 - var(--edge-sensitivity)));
  mix-blend-mode: plus-lighter;
}

.border-glow-card > .edge-light::before {
  content: "";
  position: absolute;
  inset: var(--glow-padding);
  border-radius: inherit;
  box-shadow:
    inset 0 0 0 1px var(--glow-color, hsl(200deg 80% 60% / 100%)),
    inset 0 0 1px 0 var(--glow-color-60, hsl(200deg 80% 60% / 60%)),
    inset 0 0 3px 0 var(--glow-color-50, hsl(200deg 80% 60% / 50%)),
    inset 0 0 6px 0 var(--glow-color-40, hsl(200deg 80% 60% / 40%)),
    inset 0 0 15px 0 var(--glow-color-30, hsl(200deg 80% 60% / 30%)),
    inset 0 0 25px 2px var(--glow-color-20, hsl(200deg 80% 60% / 20%)),
    inset 0 0 50px 2px var(--glow-color-10, hsl(200deg 80% 60% / 10%)),
    0 0 1px 0 var(--glow-color-60, hsl(200deg 80% 60% / 60%)),
    0 0 3px 0 var(--glow-color-50, hsl(200deg 80% 60% / 50%)),
    0 0 6px 0 var(--glow-color-40, hsl(200deg 80% 60% / 40%)),
    0 0 15px 0 var(--glow-color-30, hsl(200deg 80% 60% / 30%)),
    0 0 25px 2px var(--glow-color-20, hsl(200deg 80% 60% / 20%)),
    0 0 50px 2px var(--glow-color-10, hsl(200deg 80% 60% / 10%));
}

/* 内容区 */
.border-glow-inner {
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: auto;
  z-index: 2;
}

/* 响应式 */
@media (max-width: 1023px) {
  .border-glow-card {
    width: 100%;
    height: 280px;
  }
}

@media (max-width: 480px) {
  .border-glow-card {
    height: 220px;
  }
}
</style>
```

- [ ] **Step 3: 验证文件创建**

确认 `src/components/SkillCard.vue` 存在且语法正确。

- [ ] **Step 4: Commit**

```bash
git add src/components/SkillCard.vue
git commit -m "feat: add SkillCard component with BorderGlow effect"
```

---

### Task 3: 修改 SkillsSection.vue 替换 PixelCard

**Files:**
- Modify: `src/components/SkillsSection.vue`

- [ ] **Step 1: 替换模板中的 PixelCard 为 SkillCard**

在 `src/components/SkillsSection.vue` 中，将第 35-40 行：

```vue
              <PixelCard variant="blue">
                <div class="skill-content">
                  <h4 class="skill-name">{{ skill.name }}</h4>
                  <p class="skill-desc">{{ skill.desc }}</p>
                </div>
              </PixelCard>
```

替换为：

```vue
              <SkillCard
                :animated="true"
                :active="activeCardIndex === index"
                :is-mobile="isMobile"
                @toggle="onCardToggle(index)"
              >
                <div class="skill-content">
                  <h4 class="skill-name">{{ skill.name }}</h4>
                  <p class="skill-desc">{{ skill.desc }}</p>
                </div>
              </SkillCard>
```

- [ ] **Step 2: 替换 import 和新增状态逻辑**

在 `<script setup>` 中，将第 52 行：

```js
import PixelCard from './PixelCard.vue'
```

替换为：

```js
import { ref, onMounted, onUnmounted } from 'vue'
import SkillCard from './SkillCard.vue'
```

在 `const videoRef = ref(null)` 之后新增：

```js
const isMobile = ref(false)
const activeCardIndex = ref(null)

let deviceMq = null

const checkDevice = () => {
  isMobile.value = !window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

const onCardToggle = (index) => {
  if (activeCardIndex.value === index) {
    activeCardIndex.value = null
  } else {
    activeCardIndex.value = index
  }
}

onMounted(() => {
  checkDevice()
  deviceMq = window.matchMedia('(hover: hover) and (pointer: fine)')
  deviceMq.addEventListener('change', checkDevice)

  // 原有视频播放逻辑
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

onUnmounted(() => {
  if (deviceMq) {
    deviceMq.removeEventListener('change', checkDevice)
  }
})
```

注意：需要移除原来的 `onMounted` 块（第 56-67 行），因为新代码已包含视频播放逻辑。

- [ ] **Step 3: 去除样式中的 .skill-level 规则**

在 `<style scoped>` 中删除 `.skill-level` 样式规则（第 191-197 行），因为 `level` 字段已不再使用。

- [ ] **Step 4: 验证**

确认 `SkillsSection.vue` 中不再有 `PixelCard` 的引用，且 `SkillCard` 正确导入。

- [ ] **Step 5: Commit**

```bash
git add src/components/SkillsSection.vue
git commit -m "feat: replace PixelCard with SkillCard in skills section"
```

---

### Task 4: 清理 skills.js 中的 level 字段

**Files:**
- Modify: `src/data/skills.js`

- [ ] **Step 1: 移除 level 字段**

将 `src/data/skills.js` 中每条技能对象的 `level` 字段删除。例如第一行从：

```js
  { name: '机器人系统集成', desc: '...', level: 90 },
```

改为：

```js
  { name: '机器人系统集成', desc: '...' },
```

对所有 6 条技能做同样处理。

- [ ] **Step 2: Commit**

```bash
git add src/data/skills.js
git commit -m "refactor: remove unused level field from skills data"
```

---

### Task 5: 端到端验证

- [ ] **Step 1: 启动开发服务器**

```bash
npm run dev
```

- [ ] **Step 2: 桌面端验证**

1. 打开浏览器，导航到技能卡片区域
2. 鼠标靠近卡片边缘 → 应看到彩色渐变边框发光，方向随鼠标位置变化
3. 鼠标移到卡片中心 → 光效消失
4. 鼠标离开卡片 → 光效淡出（0.75s）
5. 刷新页面 → 应看到扫光入场动画

- [ ] **Step 3: 移动端验证**

1. 使用 Chrome DevTools 切换到移动设备模拟
2. 点击一张卡片 → 该卡片边缘发光
3. 点击另一张卡片 → 前一张关闭，新卡片发光
4. 点击已激活的卡片 → 光效关闭
5. 同一时间只有一张卡片发光

- [ ] **Step 4: 响应式验证**

1. 调整浏览器宽度到 768px 以下 → 卡片全宽显示
2. 调整到 480px 以下 → 卡片高度缩小
3. 确认卡片内容文字正常显示

- [ ] **Step 5: 提交最终验证结果**

如无问题，无需额外 commit（Task 4 已提交所有变更）。