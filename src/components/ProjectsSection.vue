<template>
  <section id="projects" class="section-padding">
    <div class="projects-header">
      <h2 class="section-headline reveal">项目经历</h2>
      <p class="section-sub reveal reveal-delay-1">9 个公司项目与 2 个个人项目，覆盖汽车、高铁、新能源、智能制造与具身智能领域</p>
    </div>
    <div class="projects-gallery reveal">
      <CircularGallery :items="galleryItems" @item-click="scrollToProject" />
    </div>
    <ProjectCard
      v-for="project in projects"
      :key="project.id"
      :project="project"
      :image-manifest="imageManifest"
    />
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { projects } from '../data/projects.js'
import ProjectCard from './ProjectCard.vue'
import CircularGallery from './gallery/CircularGallery.vue'

const imageManifest = ref(null)

const galleryItems = computed(() =>
  projects.map(p => ({
    image: p.image,
    text: p.title,
    description: `${p.role} · ${p.date}`,
    alt: p.title,
    projectId: p.id
  }))
)

const scrollToProject = (item) => {
  const el = document.querySelector(`[data-project="${item.projectId}"]`)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

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
</script>

<style scoped>
.section-padding {
  padding: 96px 32px 128px;
}
.projects-header {
  max-width: 980px;
  margin: 0 auto;
  padding-bottom: 64px;
}
.projects-gallery {
  max-width: 1280px;
  height: 520px;
  margin: 0 auto 96px;
}

@media (max-width: 768px) {
  .section-padding {
    padding-bottom: 80px;
  }
  .projects-header {
    padding-bottom: 40px;
  }
  .projects-gallery {
    height: 360px;
    margin-bottom: 64px;
  }
}
</style>
