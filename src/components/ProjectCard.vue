<template>
  <article
    class="project-showcase reveal"
    :data-project="project.id"
  >
    <div class="project-figure" :class="{ 'is-duo': figures.length > 1 }">
      <div
        v-for="(figure, i) in figures"
        :key="figure.key || i"
        class="project-frame"
      >
        <img
          v-if="figure.manifest?.placeholder && !loaded[i]"
          :src="figure.manifest.placeholder"
          alt=""
          aria-hidden="true"
          class="project-image project-image--lqip"
        >
        <img
          v-if="figure.manifest"
          :src="`/images/${figure.key}-1280w.webp`"
          :srcset="figure.manifest.srcset"
          :sizes="figure.manifest.sizes"
          :alt="`${project.title} 展示图 ${i + 1}`"
          loading="lazy"
          decoding="async"
          class="project-image"
          @load="loaded[i] = true"
          @click="openLightbox(figure.src)"
        >
        <img
          v-else-if="figure.src"
          :src="figure.src"
          :alt="`${project.title} 展示图 ${i + 1}`"
          loading="lazy"
          decoding="async"
          class="project-image"
          @load="loaded[i] = true"
          @click="openLightbox(figure.src)"
        >
      </div>
    </div>

    <div class="project-copy">
      <p class="project-eyebrow">
        <span class="project-role">{{ project.role }}</span>
        <span class="project-eyebrow-sep" aria-hidden="true"></span>
        <span class="project-date">{{ project.date }}</span>
      </p>

      <h3 class="project-title">{{ project.title }}</h3>

      <p
        v-for="(desc, i) in project.descriptions"
        :key="i"
        class="project-desc"
        v-html="desc"
      ></p>

      <ul v-if="project.tags && project.tags.length" class="project-tags">
        <li v-for="tag in project.tags" :key="tag" class="project-tag">{{ tag }}</li>
      </ul>

      <a
        v-if="project.link"
        class="project-link"
        :href="project.link"
        target="_blank"
        rel="noopener noreferrer"
      >
        查看项目源码
        <span class="project-link__arrow" aria-hidden="true">&rsaquo;</span>
      </a>
    </div>

    <Teleport to="body">
      <div
        v-if="lightboxSrc"
        class="project-lightbox"
        role="dialog"
        aria-modal="true"
        aria-label="查看项目大图"
        @click="closeLightbox"
      >
        <img :src="lightboxSrc" :alt="project.title" class="project-lightbox__img">
        <span class="project-lightbox__hint">点击任意处或按 Esc 关闭</span>
      </div>
    </Teleport>
  </article>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'

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

const loaded = ref([])

const lightboxSrc = ref(null)

const openLightbox = (src) => {
  if (src) lightboxSrc.value = src
}

const closeLightbox = () => {
  lightboxSrc.value = null
}

const onKeydown = (event) => {
  if (event.key === 'Escape') closeLightbox()
}

watch(lightboxSrc, (value) => {
  if (value) {
    document.addEventListener('keydown', onKeydown)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})

const figures = computed(() => {
  const entries = [
    { key: props.project.imageKey, src: props.project.image },
    { key: props.project.imageKeyAlt, src: props.project.imageAlt }
  ]

  return entries
    .filter(entry => entry.key || entry.src)
    .map(entry => ({
      key: entry.key,
      src: entry.src,
      manifest: entry.key && props.imageManifest
        ? props.imageManifest[entry.key] || null
        : null
    }))
})
</script>

<style scoped>
.project-showcase {
  max-width: 1080px;
  margin: 0 auto 88px;
  background: var(--color-bg-elevated);
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}
.project-showcase:last-of-type {
  margin-bottom: 0;
}

/* 展示图：统一 16:9，居中裁切；双图并排自动对齐 */
.project-figure {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px;
  background: var(--color-bg-section-alt);
}
.project-figure.is-duo {
  grid-template-columns: 1fr 1fr;
}
.project-frame {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--color-bg-section-alt);
}
.project-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  cursor: zoom-in;
}

/* 灯箱：点击后全屏浏览原图 */
.project-lightbox {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.92);
  cursor: zoom-out;
  animation: lightbox-fade 0.2s ease;
}
.project-lightbox__img {
  max-width: 94vw;
  max-height: 88vh;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 12px 60px rgba(0, 0, 0, 0.5);
}
.project-lightbox__hint {
  position: absolute;
  bottom: 24px;
  left: 0;
  right: 0;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: var(--text-sm);
  pointer-events: none;
}
@keyframes lightbox-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 文案区：居中、大标题、留白充足 */
.project-copy {
  padding: 56px 72px 64px;
  text-align: center;
}
.project-eyebrow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 14px;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
}
.project-role {
  color: var(--color-accent);
  font-weight: var(--font-medium);
}
.project-eyebrow-sep {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.45;
}
.project-title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3.4vw, 2.75rem);
  font-weight: var(--font-bold);
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
  text-wrap: balance;
  margin-bottom: 24px;
}
.project-desc {
  max-width: 720px;
  margin: 0 auto 14px;
  font-size: clamp(1rem, 1.5vw, 1.125rem);
  line-height: 1.75;
  color: var(--color-text-secondary);
}
.project-desc :deep(strong) {
  color: var(--color-text-primary);
  font-weight: var(--font-semibold);
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  list-style: none;
  padding: 0;
  margin: 32px 0 0;
}
.project-tag {
  padding: 7px 16px;
  border-radius: var(--radius-full);
  background: rgba(0, 0, 0, 0.05);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  letter-spacing: 0.01em;
}

.project-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 28px;
  color: var(--color-accent);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  text-decoration: none;
  transition: opacity 0.16s ease;
}
.project-link:hover {
  opacity: 0.75;
}
.project-link__arrow {
  font-size: 1.15em;
  line-height: 1;
}

@media (max-width: 768px) {
  .project-showcase {
    margin-bottom: 56px;
    border-radius: 20px;
  }
  .project-figure.is-duo {
    grid-template-columns: 1fr;
  }
  .project-copy {
    padding: 36px 24px 40px;
  }
  .project-eyebrow {
    font-size: var(--text-xs);
    gap: 10px;
    margin-bottom: 12px;
  }
  .project-title {
    margin-bottom: 18px;
  }
  .project-desc {
    font-size: 0.9375rem;
    margin-bottom: 12px;
  }
  .project-tags {
    gap: 8px;
    margin-top: 24px;
  }
  .project-tag {
    padding: 6px 12px;
    font-size: var(--text-xs);
  }
  .project-link {
    margin-top: 22px;
    font-size: var(--text-sm);
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-image {
    transition: none;
  }
}
</style>
