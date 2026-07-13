<template>
  <section id="projects" class="section-padding">
    <div class="projects-header">
      <h2 class="section-headline reveal">项目作品，<br>开发项目。</h2>
      <p class="section-sub reveal reveal-delay-1">参与9+核心项目，覆盖汽车、高铁、新能源、智能制造等领域</p>
    </div>
    <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
  </section>
</template>

<script setup>
import { projects } from '../data/projects.js'
import ProjectCard from './ProjectCard.vue'
import { useProjectScroll } from '../composables/useProjectScroll.js'

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
