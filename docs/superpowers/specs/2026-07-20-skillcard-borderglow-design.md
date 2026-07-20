# SkillCard BorderGlow 特效设计

> 日期：2026-07-20 | 状态：待实现

## 概述

将个人技能卡片的交互特效从当前 PixelCard（canvas 像素动画）替换为 BorderGlow（鼠标方向性发光边框 + mesh gradient），仅作用于技能卡片区域，兼容桌面端和移动端。

## 文件变更

| 操作 | 文件 | 说明 |
|------|------|------|
| 新增 | `src/components/SkillCard.vue` | BorderGlow 卡片组件 |
| 新增 | `src/composables/useBorderGlow.js` | 鼠标跟踪 + 边缘计算逻辑 |
| 修改 | `src/components/SkillsSection.vue` | 用 SkillCard 替换 PixelCard |
| 修改 | `src/data/skills.js` | 移除不再使用的 `level` 字段 |
| 保留 | `src/components/PixelCard.vue` | 不动，保留原文件 |

无新增依赖。

## 组件接口 — SkillCard.vue

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `glowColor` | String | `"200 80 60"` | HSL 光晕色，格式 "H S L" |
| `backgroundColor` | String | `"#0f0f1a"` | 卡片背景色 |
| `borderRadius` | Number | `28` | 圆角（px） |
| `glowRadius` | Number | `40` | 外层光晕扩散距离（px） |
| `glowIntensity` | Number | `1.0` | 光晕强度倍率（0.1-3.0） |
| `edgeSensitivity` | Number | `30` | 边缘感应灵敏度（0-100） |
| `coneSpread` | Number | `25` | 锥形遮罩宽度（5-45） |
| `animated` | Boolean | `true` | 是否播放入场扫光动画 |
| `colors` | String[] | `['#c084fc','#f472b6','#38bdf8']` | mesh gradient 三色 |
| `active` | Boolean | `false` | 移动端：当前是否激活 |
| `isMobile` | Boolean | `false` | 是否移动端模式 |

**Events：**
- `@toggle` — 移动端点击时触发，父组件用于管理互斥 active 状态

## 视觉效果 — 三层发光结构

```
┌─────────────────────────────────┐
│  ::before (mesh gradient 边框)    │  ← 彩色渐变边框，conic-gradient mask 控制方向
│  ::after  (背景填充)              │  ← 淡淡的彩色填充，soft-light 混合
│  <span>   (外层光晕)              │  ← 向外扩散的 HSL 单色光晕
│  ┌─────────────────────────┐     │
│  │  <slot /> 内容区          │     │
│  └─────────────────────────┘     │
└─────────────────────────────────┘
```

三层都通过 CSS 变量 `--cursor-angle` 和 `--edge-proximity` 控制可见性：
- 鼠标远离时三层 opacity → 0
- 靠近边缘时渐显
- 非 hover 状态下 0.75s ease-out 过渡

## 交互设计

### 桌面端（hover: hover and pointer: fine）

- `@pointermove` 实时跟踪鼠标位置
- 计算边缘距离 `--edge-proximity`（0~100）
- 计算鼠标角度 `--cursor-angle`（0~360deg）
- 鼠标离开卡片 → 光效淡出

### 移动端（触摸设备）

- 无 hover，通过 `@click` 切换
- 点击卡片 → 该卡片 active，显示全部光效
- 点击另一张 → 前一张关闭，新卡片 active（互斥）
- 点击已 active 的卡片 → 关闭
- 通过 `SkillsSection` 中的 `activeCardIndex` 状态管理互斥

### 入场动画

- `animated=true` 时，页面加载播放 sweep 扫光动画
- `--edge-proximity` 从 0→100→0，`--cursor-angle` 从 110°→465°
- 使用 `requestAnimationFrame` 实现，总时长约 4s
- 检测 `prefers-reduced-motion`，若用户偏好减少动效则跳过

## Composable — useBorderGlow.js

```js
// 输入：cardRef (template ref)
// 输出：{ handlePointerMove, handlePointerLeave, edgeProximity, cursorAngle }
// 内部：
//   - getEdgeProximity(el, x, y) → 0~1
//   - getCursorAngle(el, x, y) → 0~360
//   - 通过 matchMedia 检测设备能力
```

## 响应式

复用当前 PixelCard 的断点：

| 断点 | 卡片尺寸 |
|------|----------|
| ≥1024px | 3列网格，300×400px |
| 768-1023px | 单列，宽100%，高280px |
| ≤480px | 高220px |

## SkillsSection.vue 改动

```vue
<!-- 改前 -->
<PixelCard variant="blue">
  <div class="skill-content">...</div>
</PixelCard>

<!-- 改后 -->
<SkillCard
  :animated="true"
  :active="activeCardIndex === index"
  :is-mobile="isMobile"
  @toggle="onCardToggle(index)"
>
  <div class="skill-content">...</div>
</SkillCard>
```

新增逻辑：
- `isMobile` — 在 SkillsSection 中通过 `matchMedia('(hover: hover) and (pointer: fine)')` 检测，作为 prop 传给 SkillCard
- `activeCardIndex` — ref(null)，移动端互斥状态（null = 无激活卡片）
- `onCardToggle(index)` — 点击切换逻辑：若 index === activeCardIndex 则置 null，否则设为 index

## 边界情况

- 窗口 resize → ResizeObserver 更新卡片尺寸
- `prefers-reduced-motion` → 跳过入场动画
- 多卡片快速点击 → 单状态管理保证互斥
- 卡片内容溢出 → `border-glow-inner` 设置 `overflow: auto`
- 视频区域、section 布局、其他组件不做任何改动

## 不变更范围

- `src/components/PixelCard.vue` — 保留不动
- `src/components/SkillsSection.vue` — 视频区域（video、羽化遮罩）不动
- `src/style.css` — 不动
- 其他所有组件 — 不动