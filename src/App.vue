<template>
  <AuroraBackground />
  <AppNav />
  <main>
    <HeroSection />
    <WorkSection />
    <SkillsSection />
    <EducationSection />
    <ProjectsSection />
    <ContactSection />
  </main>
  <AppFooter />
</template>

<script setup>
import AuroraBackground from './components/AuroraBackground.vue'
import AppNav from './components/AppNav.vue'
import HeroSection from './components/HeroSection.vue'
import WorkSection from './components/WorkSection.vue'
import SkillsSection from './components/SkillsSection.vue'
import EducationSection from './components/EducationSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import ContactSection from './components/ContactSection.vue'
import AppFooter from './components/AppFooter.vue'
import { useReveal } from './composables/useReveal.js'

useReveal()
</script>
