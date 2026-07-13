<template>
  <section id="projects" class="section-padding">
    <div class="section-center">
      <h2 class="section-headline reveal float-in">开发项目</h2>
      <p class="section-sub reveal reveal-delay-1">参与9+核心项目，覆盖汽车、高铁、新能源、智能制造等领域</p>
      <div class="projects-grid">
        <ProjectCard
          v-for="project in projects"
          :key="project.id"
          :project="project"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import ProjectCard from './ProjectCard.vue'
import { projects } from '../data/projects.js'
</script>

<style scoped>
.section-padding {
  padding: 96px 32px 128px;
}
.section-center {
  max-width: 1200px;
  margin: 0 auto;
}
.projects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  margin-top: 64px;
}
</style>