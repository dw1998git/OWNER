<template>
  <div
    class="apple-project-section"
    :data-project="project.id"
  >
    <div class="apple-project-image-wrap">
      <!-- LQIP 模糊占位图 -->
      <img
        v-if="imageManifest?.placeholder"
        :src="imageManifest.placeholder"
        alt=""
        aria-hidden="true"
        class="project-image-placeholder"
        :class="{ 'placeholder-hidden': imageLoaded }"
      >
      <img
        v-if="imageManifest"
        ref="mainImgRef"
        :src="`/images/${project.imageKey}-1280w.webp`"
        :srcset="imageManifest.srcset"
        :sizes="imageManifest.sizes"
        :alt="project.title"
        loading="lazy"
        decoding="async"
        class="project-image-main"
        :class="{ 'image-visible': imageLoaded }"
        @load="onImageLoad"
      >
      <img
        v-else
        :src="project.image"
        :alt="project.title"
        loading="lazy"
        decoding="async"
      >
    </div>
    <div class="apple-project-content">
      <div class="project-text">
        <div class="project-header">
          <h3 class="project-title">
            <ParticleText
              :text="project.title"
              :font-size="'clamp(2rem, 4vw, 3rem)'"
              :font-weight="700"
              color="#ffffff"
              highlight-color="#ffffff"
              :particle-size="3"
              :density="2"
              :scatter="60"
              :pointer-repel="15"
              :repel-radius="60"
              :glow="false"
              trigger="hover"
            />
          </h3>
          <span class="role-badge">
            <ParticleText
              :text="project.role"
              :font-size="'var(--text-xs)'"
              :font-weight="600"
              color="#4fc3f7"
              highlight-color="#4fc3f7"
              :particle-size="2"
              :density="2"
              :scatter="20"
              :pointer-repel="0"
              :repel-radius="0"
              :glow="false"
              trigger="hover"
            />
          </span>
        </div>
        <p class="project-date-text">{{ project.date }}</p>
        <p
          v-for="(desc, i) in project.descriptions"
          :key="i"
          class="project-desc"
          style="white-space: pre-line;"
        >{{ splitDescription(desc) }}</p>
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
import { ref } from 'vue'
import ParticleText from './ParticleText.vue'

defineProps({
  project: {
    type: Object,
    required: true
  },
  imageManifest: {
    type: Object,
    default: null
  }
})

const imageLoaded = ref(false)

const onImageLoad = () => {
  imageLoaded.value = true
}

const splitDescription = (html) => {
  const plain = String(html || '').replace(/<[^>]+>/g, '')
  return plain
    .replace(/([。！？；])/g, '$1\n')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n')
}

</script>

<style scoped>
/* LQIP 占位图 */
.project-image-placeholder {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  filter: blur(20px);
  transform: scale(1.1);
  transition: opacity 0.5s ease;
  z-index: 0;
}
.project-image-placeholder.placeholder-hidden {
  opacity: 0;
}

/* 主图 */
.project-image-main {
  position: relative;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.5s ease;
}
.project-image-main.image-visible {
  opacity: 1;
}

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
  flex: 0 0 auto;
  min-width: max-content;
  max-width: 100%;
  line-height: 1.2;
}
.role-badge {
  flex: 0 0 auto;
  min-width: max-content;
  vertical-align: middle;
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
.project-date-text {
  font-family: var(--font-mono);
  font-size: var(--text-lg);
  color: rgba(255,255,255,0.85);
  margin-bottom: 24px;
  text-shadow: 0 1px 10px rgba(0,0,0,0.8);
}
.project-text {
  background: linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0) 100%);
  border-radius: 20px;
  padding: 32px;
}
.project-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>