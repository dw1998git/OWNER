<template>
  <div class="apple-project-section" :data-project="project.id">
    <div class="apple-project-image-wrap">
      <img :src="project.image" :alt="project.title">
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
        <div class="project-tags">
          <span v-for="tag in project.tags" :key="tag" class="tech-tag">{{ tag }}</span>
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
  }
})
</script>

<style scoped>
.project-header {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}
.project-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}
.project-date {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: rgba(255,255,255,0.6);
  margin-bottom: 16px;
}
.project-desc {
  font-size: var(--text-base);
  color: rgba(255,255,255,0.95);
  line-height: 1.8;
  text-shadow: 0 1px 16px rgba(0,0,0,0.9);
  margin-bottom: 16px;
}
.project-desc:last-of-type {
  margin-bottom: 20px;
}
.project-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
