# 移动端图片展示适配 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 优化项目卡片和技能板块在移动端的图片展示，保留 sticky 动画但降级参数，适配 768px 和 480px 两个断点。

**Architecture:** 纯 CSS 媒体查询改动，不涉及 JS。`useProjectScroll.js` 已有移动端检测（`maxBlur: 8px, maxScale: 1.03`），无需修改。

**Tech Stack:** CSS（媒体查询 @media max-width: 768px / 480px）

---

## 文件结构

| 文件 | 操作 | 职责 |
|------|------|------|
| `src/style.css` | 修改 | 768px 和 480px 中项目卡片 min-height / image-wrap / content 调整 |
| `src/components/SkillsSection.vue` | 修改 | 768px 中视频羽化遮罩宽度调整 |
| `src/components/PixelCard.vue` | 修改 | 768px 和 480px 中 width/height 响应式 |

---

### Task 1: 项目卡片 768px 断点适配

**Files:**
- Modify: `src/style.css`

- [ ] **Step 1: 读取当前 768px 媒体查询中项目卡片相关规则**

读取 `src/style.css`，定位 `@media (max-width: 768px)` 块中的项目卡片样式（约第 525-570 行）。

- [ ] **Step 2: 修改 `.apple-project-section` 的 min-height 和 image-wrap height**

将：
```css
.apple-project-section {
  min-height: 160vh;
}
```
改为：
```css
.apple-project-section {
  min-height: 130vh;
}
```

将：
```css
.apple-project-image-wrap {
  height: 100vh;
  position: sticky;
  top: 0;
}
```
改为：
```css
.apple-project-image-wrap {
  height: 55vh;
  position: sticky;
  top: 0;
}
```

- [ ] **Step 3: 修改 `.apple-project-content`**

将：
```css
.apple-project-content {
  margin-top: -5vh;
  padding: 24px 16px 80px;
}
```
改为：
```css
.apple-project-content {
  margin-top: -8vh;
  padding: 20px 12px 60px;
}
```

- [ ] **Step 4: 修改 `.project-text`**

将：
```css
.project-text {
  padding: 16px 0;
}
```
改为：
```css
.project-text {
  padding: 12px 0;
}
```

- [ ] **Step 5: 修改 `.project-title`**

将：
```css
.project-title {
  font-size: clamp(1.5rem, 5vw, 2rem);
}
```
改为：
```css
.project-title {
  font-size: clamp(1.25rem, 5vw, 1.75rem);
}
```

- [ ] **Step 6: 修改 `.project-desc` 和新增 `.project-header`、`.role-badge`**

将：
```css
.project-desc {
  font-size: var(--text-base);
}
```
改为：
```css
.project-desc {
  font-size: 0.9375rem;
}
```

在同一媒体查询块中新增：
```css
.project-header {
  gap: 10px;
}
.role-badge {
  font-size: 0.75rem;
}
```

- [ ] **Step 7: Commit**

```bash
git add src/style.css
git commit -m "feat: mobile project card adaptation at 768px breakpoint"
```

---

### Task 2: 项目卡片 480px 断点适配

**Files:**
- Modify: `src/style.css`

- [ ] **Step 1: 读取当前 480px 媒体查询中项目卡片规则**

定位 `@media (max-width: 480px)` 块中的项目卡片样式。

- [ ] **Step 2: 修改 `.apple-project-section` 和 `.apple-project-image-wrap`**

将：
```css
.apple-project-section {
  min-height: 160vh;
}
.apple-project-image-wrap {
  height: 100vh;
}
```
改为：
```css
.apple-project-section {
  min-height: 120vh;
}
.apple-project-image-wrap {
  height: 45vh;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/style.css
git commit -m "feat: mobile project card adaptation at 480px breakpoint"
```

---

### Task 3: 技能板块视频羽化遮罩适配

**Files:**
- Modify: `src/components/SkillsSection.vue`

- [ ] **Step 1: 在 scoped 样式中新增 768px 媒体查询**

在 `SkillsSection.vue` 的 `<style scoped>` 末尾新增：

```css
@media (max-width: 768px) {
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SkillsSection.vue
git commit -m "feat: mobile video fade mask adaptation for skills section"
```

---

### Task 4: PixelCard 响应式尺寸

**Files:**
- Modify: `src/components/PixelCard.vue`

- [ ] **Step 1: 读取 PixelCard 当前样式**

读取 `src/components/PixelCard.vue`，定位 `.pixel-card` 样式规则（约第 290 行），确认当前 `width: 300px; height: 400px; aspect-ratio: 4/5;`。

- [ ] **Step 2: 在 scoped 样式中新增 768px 媒体查询**

在 `PixelCard.vue` 的 `<style scoped>` 末尾新增：

```css
@media (max-width: 768px) {
  .pixel-card {
    width: 100%;
    height: 280px;
    aspect-ratio: auto;
  }
}
@media (max-width: 480px) {
  .pixel-card {
    height: 220px;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/PixelCard.vue
git commit -m "feat: responsive PixelCard sizing for mobile"
```

---

### Task 5: 验证

- [ ] **Step 1: 启动 dev 服务器**

Run: `npm run dev`
Expected: Vite dev server 启动

- [ ] **Step 2: Chrome DevTools 移动端模拟**

- iPhone 14 (375px): 确认项目卡片 min-height 120vh、图片 45vh、卡片 1 列 220px 高
- iPad (768px): 确认项目卡片 min-height 130vh、图片 55vh、卡片 2 列 280px 高
- 确认视频羽化遮罩 30px 左右，不遮挡视频内容
- 确认卡片无边框、无溢出

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: verify mobile adaptation"
```