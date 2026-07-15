# 移动端图片展示适配 — 设计文档

**日期：** 2026-07-15
**方案：** 方案 C — 渐进增强，保留 sticky 动画但降级参数，优化图片展示

---

## 一、范围

只适配图片展示相关组件，不改导航和其他非图片组件：

- **项目卡片**（ProjectsSection + ProjectCard + useProjectScroll.js）
- **技能板块**（SkillsSection + PixelCard）

现有 `useProjectScroll.js` 已有移动端检测（`maxBlur: 8px, maxScale: 1.03`），无需改动 JS。

## 二、项目卡片适配

### 768px 断点

| 属性 | 选择器 | 当前值 | 新值 |
|------|--------|--------|------|
| 最小高度 | `.apple-project-section` | 160vh | 130vh |
| 图片容器高度 | `.apple-project-image-wrap` | 100vh | 55vh |
| 内容区上移 | `.apple-project-content` margin-top | -5vh | -8vh |
| 内容区内边距 | `.apple-project-content` padding | 24px 16px 80px | 20px 12px 60px |
| 文字区内边距 | `.project-text` padding | 16px 0 | 12px 0 |
| 标题字号 | `.project-title` | clamp(1.5rem, 5vw, 2rem) | clamp(1.25rem, 5vw, 1.75rem) |
| 描述字号 | `.project-desc` | var(--text-base) | 0.9375rem |
| 标题行间距 | `.project-header` gap | 14px | 10px |
| 角色标签 | `.role-badge` | 无 | font-size: 0.75rem |

### 480px 断点

| 属性 | 选择器 | 当前值 | 新值 |
|------|--------|--------|------|
| 最小高度 | `.apple-project-section` | 160vh | 120vh |
| 图片容器高度 | `.apple-project-image-wrap` | 100vh | 45vh |

## 三、技能板块适配

### 视频羽化遮罩 — 768px 断点

| 属性 | 选择器 | 当前值 | 新值 |
|------|--------|--------|------|
| 左侧遮罩 | `.video-fade-left` | 80px | 30px |
| 右侧遮罩 | `.video-fade-right` | 80px | 30px |
| 顶部遮罩 | `.video-fade-top` | 30px | 40px |
| 底部遮罩 | `.video-fade-bottom` | 50px | 40px |

### PixelCard 响应式 — 768px 断点

| 属性 | 选择器 | 当前值 | 新值 |
|------|--------|--------|------|
| 宽度 | `.pixel-card` | 300px | 100% |
| 高度 | `.pixel-card` | 400px | 280px |
| 宽高比 | `.pixel-card` aspect-ratio | 4/5 | 移除 |

### 480px 断点

| 属性 | 选择器 | 当前值 | 新值 |
|------|--------|--------|------|
| 卡片高度 | `.pixel-card` | 400px | 220px |

## 四、涉及文件

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/style.css` | 修改 | 768px 和 480px 媒体查询中新增/修改上述规则 |
| `src/components/PixelCard.vue` | 修改 | 768px 和 480px 媒体查询中 width/height 响应式 |
| `src/components/SkillsSection.vue` | 修改 | 768px 媒体查询中视频羽化遮罩宽度 |

## 五、测试策略

- Chrome DevTools 移动端模拟（iPhone 14 / 375px、iPad / 768px）
- 确认项目卡片 sticky 动画流畅，图片不溢出
- 确认技能视频四边羽化自然，卡片不挤
- 确认 480px 以下卡片 1 列、768px 以下 2 列