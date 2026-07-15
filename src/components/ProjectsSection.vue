<template>
  <section id="projects" class="section-padding">
    <div class="projects-header">
      <h2 class="section-headline reveal">项目经历</h2>
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