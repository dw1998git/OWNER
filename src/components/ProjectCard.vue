<template>
  <div
    class="apple-project-section"
    :data-project="project.id"
  >
    <div class="apple-project-image-wrap">
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
          class="project-image-real"
          :src="`/images/${project.imageKey}-1280w.webp`"
          :srcset="imageManifest.srcset"
          :sizes="imageManifest.sizes"
          loading="lazy"
          decoding="async"
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
import { ref } from 'vue'

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

const imageLoaded = ref(false)

function onImageLoaded() {
  imageLoaded.value = true
}

function onImageError() {
  console.warn(`Image load failed for ${props.project.imageKey}, keeping placeholder`)
}
</script>

<style scoped>
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