<template>
  <footer class="app-footer">
    <Dock 
      :items="dockItems"
      :panel-height="68"
      :base-item-size="50"
      :magnification="70"
      :distance="200"
      class="dock-container"
    />
    <p class="footer-text">Made with precision. &copy; 2025 Wang Wei. All rights reserved.</p>
  </footer>
</template>

<script setup>
import Dock from './Dock.vue'
import HomeIcon from './icons/HomeIcon.vue'
import ArchiveIcon from './icons/ArchiveIcon.vue'
import AccountIcon from './icons/AccountIcon.vue'
import SettingsIcon from './icons/SettingsIcon.vue'

const dockItems = [
  { 
    icon: HomeIcon, 
    label: 'Home', 
    onClick: () => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' }) 
  },
  { 
    icon: ArchiveIcon, 
    label: 'Projects', 
    onClick: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) 
  },
  { 
    icon: AccountIcon, 
    label: 'Skills', 
    onClick: () => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }) 
  },
  { 
    icon: SettingsIcon, 
    label: 'Contact', 
    onClick: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) 
  },
]
</script>

<style scoped>
.app-footer {
  padding: 32px 0 80px;
  text-align: center;
  border-top: 1px solid var(--color-border-light);
  position: relative;
}

.dock-container {
  margin-bottom: 20px;
}

.footer-text {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-weight: var(--font-normal);
  letter-spacing: 0.02em;
}
</style>