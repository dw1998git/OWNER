# 项目图片加载优化 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 优化作品集网站项目图片加载性能，通过构建时 WebP 转换、LQIP 模糊占位、IntersectionObserver 按需加载，使滚动体验流畅。

**Architecture:** 构建时用 sharp 将项目图片转为多尺寸 WebP + 20px LQIP 缩略图，运行时通过 manifest.json 驱动双层图片（占位层 + 真实层），IntersectionObserver 触发真实图片加载，图片加载完成后 CSS transition 模糊→清晰过渡。

**Tech Stack:** Vue 3, Vite, sharp (已安装)

---

## 文件结构

| 文件 | 操作 | 职责 |
|------|------|------|
| `scripts/optimize-images.js` | 新增 | 构建时图片处理管线 |
| `package.json` | 修改 | 添加 prebuild hook |
| `.gitignore` | 修改 | 忽略构建产物 public/images/ |
| `src/data/projects.js` | 修改 | 添加 imageKey 字段用于 manifest 匹配 |
| `src/style.css` | 修改 | 新增占位层/真实层过渡样式 |
| `src/components/ProjectCard.vue` | 修改 | 双层图片 + IntersectionObserver + 降级 |
| `src/components/ProjectsSection.vue` | 修改 | fetch manifest，通过 props 传给 ProjectCard |
| `src/composables/useProjectScroll.js` | 修改 | activeImg 选择逻辑：优先真实层，回退占位层 |

---

### Task 1: 构建时图片处理脚本

**Files:**
- Create: `scripts/optimize-images.js`

- [ ] **Step 1: 创建图片优化脚本**

```js
import { readdirSync, statSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, basename, extname } from 'node:path'
import sharp from 'sharp'

const ASSETS_DIR = join(import.meta.dirname, '..', 'src', 'assets')
const OUTPUT_DIR = join(import.meta.dirname, '..', 'public', 'images')

// 排除非项目图片
const EXCLUDE_PREFIXES = ['hero', 'section', 'show']

function isProjectImage(filename) {
  const ext = extname(filename).toLowerCase()
  if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') return false
  const name = basename(filename, ext)
  return EXCLUDE_PREFIXES.every(prefix => !name.startsWith(prefix))
}

function getStem(filename) {
  return basename(filename, extname(filename))
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true })

  const files = readdirSync(ASSETS_DIR).filter(isProjectImage)
  const manifest = {}

  for (const file of files) {
    const stem = getStem(file)
    const srcPath = join(ASSETS_DIR, file)
    const srcMtime = statSync(srcPath).mtimeMs

    const out640 = join(OUTPUT_DIR, `${stem}-640w.webp`)
    const out1280 = join(OUTPUT_DIR, `${stem}-1280w.webp`)
    const outLqip = join(OUTPUT_DIR, `${stem}-lqip.webp`)

    // 跳过未变化的文件
    try {
      const existingMtime = statSync(out640).mtimeMs
      if (existingMtime >= srcMtime) {
        // 读取已有的 manifest 条目
        const lqipBuffer = readFileSync(outLqip)
        manifest[stem] = {
          srcset: `/images/${stem}-640w.webp 640w, /images/${stem}-1280w.webp 1280w`,
          sizes: '(max-width: 768px) 640px, 1280px',
          placeholder: `data:image/webp;base64,${lqipBuffer.toString('base64')}`,
          width: 1280,
          height: 720
        }
        console.log(`  skip: ${stem} (unchanged)`)
        continue
      }
    } catch {}

    console.log(`  processing: ${stem}`)

    // 生成 LQIP
    const lqipBuffer = await sharp(srcPath)
      .resize(20)
      .webp({ quality: 30 })
      .toBuffer()
    writeFileSync(outLqip, lqipBuffer)

    // 生成 640w
    await sharp(srcPath)
      .resize(640)
      .webp({ quality: 75 })
      .toFile(out640)

    // 生成 1280w
    await sharp(srcPath)
      .resize(1280)
      .webp({ quality: 80 })
      .toFile(out1280)

    manifest[stem] = {
      srcset: `/images/${stem}-640w.webp 640w, /images/${stem}-1280w.webp 1280w`,
      sizes: '(max-width: 768px) 640px, 1280px',
      placeholder: `data:image/webp;base64,${lqipBuffer.toString('base64')}`,
      width: 1280,
      height: 720
    }
  }

  writeFileSync(join(OUTPUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2))
  console.log(`  done: ${files.length} images processed`)
}

main().catch(err => {
  console.error('Image optimization failed:', err)
  process.exit(1)
})
```

- [ ] **Step 2: 验证脚本语法正确**

Run: `node --check scripts/optimize-images.js`
Expected: 无输出（无语法错误）

- [ ] **Step 3: 运行脚本并验证输出**

Run: `node scripts/optimize-images.js`
Expected: 输出 `processing: proj-xxx` 等日志，`done: 9 images processed`

- [ ] **Step 4: 验证产物**

Run: `dir public\images`
Expected: 列出 18 个 `.webp` 文件 + 1 个 `manifest.json`

- [ ] **Step 5: 验证 manifest.json 结构**

Read `public/images/manifest.json`，确认包含 9 个 key，每个有 `srcset`、`sizes`、`placeholder` 字段

- [ ] **Step 6: 验证文件大小**

Run: `node -e "const fs = require('fs'); const files = fs.readdirSync('public/images').filter(f => f.endsWith('.webp') && !f.includes('lqip')); files.forEach(f => { const s = fs.statSync('public/images/' + f); console.log(f, (s.size/1024).toFixed(1) + 'KB') })"`
Expected: 每个 640w/1280w 文件都 < 200KB

- [ ] **Step 7: Commit**

```bash
git add scripts/optimize-images.js public/images/manifest.json
git commit -m "feat: add image optimization build script with sharp"
```

---

### Task 2: 添加 prebuild hook

**Files:**
- Modify: `package.json`

- [ ] **Step 1: 在 scripts 中添加 prebuild**

读取 `package.json`，在 `"scripts"` 对象中添加：

```json
"prebuild": "node scripts/optimize-images.js"
```

完整 scripts 块变为：

```json
"scripts": {
  "dev": "vite",
  "prebuild": "node scripts/optimize-images.js",
  "build": "vite build",
  "preview": "vite preview"
}
```

- [ ] **Step 2: 验证 prebuild 链**

Run: `npm run build`
Expected: 先执行 optimize-images.js（输出 processing 日志），然后 vite build 正常完成

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "feat: add prebuild hook for image optimization"
```

---

### Task 3: 更新 .gitignore

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: 添加 public/images/ 到 .gitignore**

在 `.gitignore` 末尾追加一行：

```
public/images/
```

- [ ] **Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: ignore public/images/ build artifacts"
```

---

### Task 4: 添加 imageKey 字段到 projects.js

**Files:**
- Modify: `src/data/projects.js`

- [ ] **Step 1: 为每个项目添加 imageKey 字段**

`imageKey` 使用与 manifest 一致的 stem 命名，与 `assets/` 下文件名对应（去掉扩展名）：

```js
export const projects = [
  {
    id: 1,
    title: '理想汽车自动充电机器人',
    role: '核心成员',
    date: '2025.05 - 至今',
    image: projChargingRobotUrl,
    imageKey: 'proj-charging-robot',
    // ... descriptions, tags 不变
  },
  {
    id: 2,
    // ...
    image: projDualArmUrl,
    imageKey: 'proj-dual-arm',
    // ...
  },
  {
    id: 3,
    // ...
    image: projCoffeeRobotUrl,
    imageKey: 'proj-coffee-robot',
    // ...
  },
  {
    id: 4,
    // ...
    image: projRailGrindingUrl,
    imageKey: 'proj-rail-grinding',
    // ...
  },
  {
    id: 5,
    // ...
    image: projGarageChargingUrl,
    imageKey: 'proj-garage-charging',
    // ...
  },
  {
    id: 6,
    // ...
    image: projPalletizingUrl,
    imageKey: 'proj-palletizing',
    // ...
  },
  {
    id: 7,
    // ...
    image: projWaterMeter,
    imageKey: 'proj-water-meter',
    // ...
  },
  {
    id: 8,
    // ...
    image: projWeldingUrl,
    imageKey: 'proj-welding',
    // ...
  },
  {
    id: 9,
    // ...
    image: projMagnaUrl,
    imageKey: 'proj-magna',
    // ...
  }
]
```

注意：保留原有的 `?url` 导入和 `image` 字段，作为 manifest 不可用时的降级路径。

- [ ] **Step 2: Commit**

```bash
git add src/data/projects.js
git commit -m "feat: add imageKey field to project data for manifest matching"
```

---

### Task 5: 添加占位层/真实层过渡样式

**Files:**
- Modify: `src/style.css`

- [ ] **Step 1: 在 style.css 中新增过渡样式**

在现有 `.apple-project-image-wrap img` 样式块之后，添加以下新样式（替换旧的 `.apple-project-image-wrap img` 规则中的 transition/will-change）：

找到 `.apple-project-image-wrap img` 规则块（约第 485-492 行），将其替换为：

```css
.apple-project-image-wrap img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
```

然后在同一位置附近添加新样式：

```css
/* Placeholder layer */
.project-image-placeholder {
  filter: blur(20px);
  transform: scale(1.1);
  transition: opacity 0.5s ease;
  z-index: 1;
  will-change: filter, transform;
}
.placeholder-hidden {
  opacity: 0;
}

/* Real image layer */
.project-image-real {
  opacity: 0;
  filter: blur(20px);
  transform: scale(1.1);
  transition: opacity 0.5s ease, filter 0.5s ease, transform 0.5s ease;
  z-index: 2;
  will-change: filter, transform, opacity;
}
.image-ready {
  opacity: 1;
  filter: blur(0);
  transform: scale(1);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/style.css
git commit -m "feat: add placeholder and real image transition styles"
```

---

### Task 6: 改造 ProjectCard.vue

**Files:**
- Modify: `src/components/ProjectCard.vue`

- [ ] **Step 1: 重写模板和脚本**

将 `ProjectCard.vue` 完全替换为以下内容：

```vue
<template>
  <div
    class="apple-project-section"
    :data-project="project.id"
  >
    <div class="apple-project-image-wrap" ref="imageWrapRef">
      <!-- 降级模式：无 manifest 时使用原始图片 -->
      <img
        v-if="!imageManifest"
        :src="project.image"
        :alt="project.title"
        loading="lazy"
        decoding="async"
      >
      <!-- 优化模式：LQIP 占位层 + 真实图片层 -->
      <template v-else>
        <img
          class="project-image-placeholder"
          :src="imageManifest.placeholder"
          :class="{ 'placeholder-hidden': imageLoaded }"
          :alt="project.title"
        >
        <img
          v-if="shouldLoad"
          class="project-image-real"
          :srcset="imageManifest.srcset"
          :sizes="imageManifest.sizes"
          :alt="project.title"
          :class="{ 'image-ready': imageLoaded }"
          @load="onImageLoaded"
          @error="onImageError"
        >
      </template>
    </div>
    <div class="apple-project-content">
      <div class="project-text">
        <div class="project-header">
          <h3 class="project-title">{{ project.title }}</h3>
          <span class="role-badge">{{ project.role }}</span>
        </div>
        <p class="project-date">{{ project.date }}</p>
        <p
          v-for="(desc, i) in project.descriptions"
          :key="i"
          class="project-desc"
          v-html="desc"
        ></p>
        <div class="project-tags stagger-group">
          <span
            v-for="(tag, i) in project.tags"
            :key="tag"
            class="tech-tag tag-pop stagger-item"
            :style="{ transitionDelay: i * 80 + 'ms' }"
          >{{ tag }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  project: {
    type: Object,
    required: true
  },
  imageManifest: {
    type: Object,
    default: null
  }
})

const imageWrapRef = ref(null)
const shouldLoad = ref(false)
const imageLoaded = ref(false)

function onImageLoaded() {
  imageLoaded.value = true
}

function onImageError() {
  // 回退：隐藏占位层，不显示真实图片层
  // 占位层继续保持可见作为降级
  console.warn(`Image load failed for ${props.project.imageKey}, keeping placeholder`)
}

let observer = null

onMounted(() => {
  // 如果没有 manifest，不需要 observer
  if (!props.imageManifest) return

  if (!('IntersectionObserver' in window)) {
    // IntersectionObserver 不支持，直接加载
    shouldLoad.value = true
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          shouldLoad.value = true
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.2 }
  )

  if (imageWrapRef.value) {
    observer.observe(imageWrapRef.value)
  }
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
/* 原有样式保持不变 */
.project-header {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}
.project-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: var(--font-bold);
  color: #ffffff;
  text-shadow: 0 2px 24px rgba(0,0,0,0.85);
  letter-spacing: -0.01em;
}
.project-date {
  font-family: var(--font-mono);
  font-size: var(--text-lg);
  color: rgba(255,255,255,0.75);
  margin-bottom: 24px;
  text-shadow: 0 1px 10px rgba(0,0,0,0.7);
}
.project-desc {
  font-size: clamp(1.125rem, 2vw, 1.375rem);
  color: #ffffff;
  line-height: 2;
  text-shadow: 0 2px 20px rgba(0,0,0,0.95), 0 0 50px rgba(0,0,0,0.5);
  margin-bottom: 24px;
}
.project-desc:last-of-type {
  margin-bottom: 28px;
}
.project-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProjectCard.vue
git commit -m "feat: add dual-layer image loading with LQIP placeholder and IntersectionObserver"
```

---

### Task 7: 改造 ProjectsSection.vue

**Files:**
- Modify: `src/components/ProjectsSection.vue`

- [ ] **Step 1: 重写模板和脚本**

```vue
<template>
  <section id="projects" class="section-padding">
    <div class="projects-header">
      <h2 class="section-headline reveal">项目作品，<br>实力说话。</h2>
      <p class="section-sub reveal reveal-delay-1">参与9+核心项目，覆盖汽车、高铁、新能源、智能制造等领域</p>
    </div>
    <ProjectCard
      v-for="project in projects"
      :key="project.id"
      :project="project"
      :image-manifest="imageManifest ? imageManifest[project.imageKey] || null : null"
    />
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { projects } from '../data/projects.js'
import ProjectCard from './ProjectCard.vue'
import { useProjectScroll } from '../composables/useProjectScroll.js'

const imageManifest = ref(null)

onMounted(async () => {
  try {
    const res = await fetch('/images/manifest.json')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    imageManifest.value = await res.json()
  } catch (err) {
    console.warn('Image manifest not available, using original images:', err.message)
    imageManifest.value = null
  }
})

useProjectScroll()
</script>

<style scoped>
.section-padding {
  padding: 96px 32px 0;
}
.projects-header {
  max-width: 980px;
  margin: 0 auto;
  padding-bottom: 64px;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProjectsSection.vue
git commit -m "feat: fetch image manifest in ProjectsSection and pass to ProjectCard"
```

---

### Task 8: 改造 useProjectScroll.js

**Files:**
- Modify: `src/composables/useProjectScroll.js`

- [ ] **Step 1: 修改 update() 中获取 img 元素的逻辑**

将 `useProjectScroll.js` 中 `update()` 函数内的这段代码（第 29-31 行）：

```js
        const img = s.querySelector('.apple-project-image-wrap img')
        const content = s.querySelector('.apple-project-content')
        if (!img) continue
```

替换为：

```js
        const realImg = s.querySelector('.project-image-real')
        const placeholderImg = s.querySelector('.project-image-placeholder')
        // 优先使用已加载的真实图片，否则用占位层，都没有则回退到任意 img
        const img = (realImg?.classList.contains('image-ready') ? realImg : null)
          || placeholderImg
          || s.querySelector('.apple-project-image-wrap img')
        const content = s.querySelector('.apple-project-content')
        if (!img) continue
```

- [ ] **Step 2: Commit**

```bash
git add src/composables/useProjectScroll.js
git commit -m "feat: prefer loaded real image over placeholder in scroll animation"
```

---

### Task 9: 构建验证

- [ ] **Step 1: 完整构建**

Run: `npm run build`
Expected: prebuild 先执行图片优化，然后 vite build 成功，输出 `dist/` 目录

- [ ] **Step 2: 验证 dist 中包含优化后的图片**

Run: `dir dist\images`
Expected: 列出 18 个 `.webp` 文件 + `manifest.json`

- [ ] **Step 3: 验证原始大图未被打包**

Run: `node -e "const fs = require('fs'); const files = fs.readdirSync('dist/assets').filter(f => f.endsWith('.png') || f.endsWith('.jpg')); console.log(files)"`
Expected: 列表中不应包含 `proj-water-meter`、`proj-welding` 等文件名（它们已在构建时被优化，但原始 `?url` 导入仍可能被 Vite 打包进 dist/assets——需要检查）

- [ ] **Step 4: 启动预览服务器**

Run: `npm run preview`
Expected: 服务器启动，显示 `http://localhost:4173/`

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: verify build output with optimized images"
```