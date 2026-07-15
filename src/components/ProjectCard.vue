<template>
  <div
    class="apple-project-section"
    :data-project="project.id"
  >
    <div class="apple-project-image-wrap">
      <img
        v-if="imageManifest"
        :src="`/images/${project.imageKey}-1280w.webp`"
        :srcset="imageManifest.srcset"
        :sizes="imageManifest.sizes"
        :alt="project.title"
        decoding="async"
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