# 项目图片加载优化 — 设计文档

**日期：** 2026-07-15
**问题：** 向下滚动时项目图片加载慢，影响使用体验
**方案：** 方案 B — 构建时 WebP 转换 + 多尺寸响应式图片 + LQIP 模糊占位 + IntersectionObserver 按需加载

---

## 一、问题分析

当前项目是 Vue3 + Vite 作品集网站，有 9 个项目卡片，使用 Apple 风格 sticky 滚动视差效果。图片加载慢的根因有三：

1. **图片文件过大：** 3 张 PNG 格式照片（`proj-water-meter.png` 3.26MB、`proj-welding.png` 1.9MB、`proj-rail-grinding.png` 621KB），外加 370-684KB 的 JPG。总图片体积约 8MB。
2. **无占位策略：** `<img>` 仅设置了 `loading="lazy"` 和 `decoding="async"`，图片下载期间用户看到空白区域。
3. **所有图片一次性渲染到 DOM：** `v-for` 渲染全部 9 个 `ProjectCard`，浏览器提前下载多张图片，造成带宽竞争。

## 二、整体架构

```
构建时 (npm run build → prebuild hook)
═══════════════════════════════════════════════════════
  scripts/optimize-images.js
  1. 读取 src/assets/ 下所有项目图片
  2. sharp 生成三份产物：
     - {name}-640w.webp  (移动端，质量 75%)
     - {name}-1280w.webp (桌面端，质量 80%)
     - {name}-lqip.webp  (20px 缩略图，内联为 base64)
  3. 输出到 public/images/
  4. 生成 public/images/manifest.json

运行时 (浏览器)
═══════════════════════════════════════════════════════
  ProjectCard.vue
  - 初始状态：显示 LQIP base64（模糊 + 轻微放大）
  - IntersectionObserver 触发：设置 <img srcset> 开始加载
  - 图片 onload：CSS transition 模糊→清晰

  useProjectScroll.js (现有逻辑不变)
  - clipPath/blur/scale 动画作用于占位层或真实层（取已存在的）
  - 不阻塞动画：占位层也能呈现"揭示"效果
```

## 三、构建时图片处理管线

### 脚本：`scripts/optimize-images.js`

- **输入：** `src/assets/` 下所有项目图片（`.jpg` / `.png`，排除 hero/section 等非项目图片）
- **处理：** 使用 sharp 为每张图片生成三个版本
- **输出：** `public/images/` 下 18 个 WebP 文件 + 1 个 `manifest.json`
- **触发：** `package.json` 中 `"prebuild": "node scripts/optimize-images.js"`
- **容错：** 检查 `public/images/` 已有文件 mtime，若源文件未变则跳过

### manifest.json 结构

```json
{
  "proj-charging-robot": {
    "srcset": "/images/proj-charging-robot-640w.webp 640w, /images/proj-charging-robot-1280w.webp 1280w",
    "sizes": "(max-width: 768px) 640px, 1280px",
    "placeholder": "data:image/webp;base64,...",
    "width": 1280,
    "height": 720
  }
}
```

## 四、运行时图片加载

### ProjectCard.vue 改造

**三种状态：** `idle` → `loading` → `loaded`

```
idle:     显示 LQIP 占位层（filter: blur(20px), transform: scale(1.1)）
loading:  IntersectionObserver 触发，设置真实 <img> 的 srcset
loaded:   图片 onload 后，CSS transition 0.5s → blur(0) + scale(1)，占位层 opacity → 0
```

**模板结构：**

```html
<div class="apple-project-image-wrap">
  <img class="project-image-placeholder" :src="manifest.placeholder"
       :class="{ 'placeholder-hidden': imageLoaded }">
  <img v-if="shouldLoad" class="project-image-real"
       :srcset="manifest.srcset" :sizes="manifest.sizes"
       :alt="project.title" :class="{ 'image-ready': imageLoaded }"
       @load="onImageLoaded">
</div>
```

**IntersectionObserver：** 在 `onMounted` 中创建，当卡片进入视口 20% 时设置 `shouldLoad = true`，触发后 `unobserve`。

**manifest 数据来源：** `ProjectsSection.vue` 在 `onMounted` 中 fetch `public/images/manifest.json`，通过 props 传给 `ProjectCard`。

### CSS 关键样式

```css
.project-image-placeholder {
  filter: blur(20px);
  transform: scale(1.1);
  transition: opacity 0.5s ease;
}
.placeholder-hidden { opacity: 0; }

.project-image-real {
  opacity: 0;
  filter: blur(20px);
  transform: scale(1.1);
  transition: opacity 0.5s ease, filter 0.5s ease, transform 0.5s ease;
}
.image-ready {
  opacity: 1;
  filter: blur(0);
  transform: scale(1);
}
```

## 五、滚动视差集成

### useProjectScroll.js 改动

最小化侵入：在 `update()` 中获取 `img` 元素时，优先使用已加载的真实图片，否则回退到占位层。

```js
const realImg = s.querySelector('.project-image-real')
const placeholderImg = s.querySelector('.project-image-placeholder')
const activeImg = realImg?.classList.contains('image-ready') ? realImg : placeholderImg
```

后续 clipPath / blur / scale 操作全部作用于 `activeImg`。现有动画逻辑完全不变。

**设计决策：不阻塞动画等待图片加载。** 占位层（LQIP）已提供视觉内容，在模糊缩略图上运行 clipPath 揭示动画也能给用户合理的视觉反馈。图片加载完成后 CSS transition 自然过渡。

## 六、错误处理

| 场景 | 处理方式 |
|------|----------|
| `manifest.json` fetch 失败 | 降级：使用 `src/assets/` 原始图片直接加载，`console.warn` 提示 |
| 单张 WebP 图片 404 | `<img onerror>` 回退到原始 JPG/PNG 路径 |
| 构建时 sharp 处理失败 | 脚本 `process.exit(1)`，prebuild 失败阻断构建，避免部署不完整产物 |
| IntersectionObserver 不支持 | 降级：直接设置 `shouldLoad = true`，行为回退到现状 |

## 七、测试策略

1. **构建验证：** `npm run build` 后确认 `public/images/` 生成 18 个 WebP + 1 个 manifest.json，每张图片 < 200KB
2. **功能验证：** `npm run preview` 在 Chrome DevTools 中：
   - Network 面板确认图片按需加载（非一次性下载）
   - Slow 3G 节流下观察 LQIP → 模糊过渡 → 清晰的完整流程
   - 移动端模拟确认加载 640w 版本
3. **回归验证：** 确认 clipPath 揭示动画、blur 过渡、文字淡入淡出等现有滚动效果正常

## 八、涉及文件

| 文件 | 操作 | 说明 |
|------|------|------|
| `scripts/optimize-images.js` | 新增 | sharp 构建脚本 |
| `package.json` | 修改 | 添加 `prebuild` hook |
| `src/components/ProjectCard.vue` | 修改 | 双层图片 + IntersectionObserver + 加载状态 |
| `src/components/ProjectsSection.vue` | 修改 | fetch manifest 并传给 ProjectCard |
| `src/composables/useProjectScroll.js` | 修改 | activeImg 判断逻辑 |
| `src/data/projects.js` | 修改 | 移除 `?url` 导入，改用 manifest 中的 key 匹配 |
| `src/style.css` | 修改 | 新增占位层/真实层过渡样式 |
| `.gitignore` | 修改 | 忽略 `public/images/`（构建产物） |