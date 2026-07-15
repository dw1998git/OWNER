<template>
  <div class="rotate-overlay" v-if="showPrompt">
    <div class="rotate-card">
      <div class="rotate-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
          <path d="M19 5l-7 7-7-7" opacity="0.3"></path>
        </svg>
        <svg class="rotate-arrow" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="23 4 23 10 17 10"></polyline>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
        </svg>
      </div>
      <p class="rotate-text">请旋转手机</p>
      <p class="rotate-sub">横屏浏览体验更佳</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const showPrompt = ref(false)

function check() {
  const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent)
  const isPortrait = window.innerWidth < window.innerHeight
  showPrompt.value = isMobile && isPortrait
}

onMounted(() => {
  check()
  window.addEventListener('resize', check)
  window.addEventListener('orientationchange', () => setTimeout(check, 300))
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', check)
  window.removeEventListener('orientationchange', check)
})
</script>

<style scoped>
.rotate-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: #09090b;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.rotate-card {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.rotate-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #30d5c8;
}
.rotate-arrow {
  animation: rotate-hint 2s ease-in-out infinite;
}
@keyframes rotate-hint {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(90deg); }
}
.rotate-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}
.rotate-sub {
  font-size: 0.9375rem;
  color: rgba(255,255,255,0.5);
  margin: 0;
}
</style>