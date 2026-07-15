<template>
  <transition name="fade">
    <div class="rotate-toast" v-if="showPrompt">
      <div class="rotate-toast-inner">
        <svg class="rotate-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="23 4 23 10 17 10"></polyline>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
        </svg>
        <span>建议横屏浏览，效果更佳</span>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const showPrompt = ref(false)
let timer = null

function check() {
  const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent)
  const isPortrait = window.innerWidth < window.innerHeight
  showPrompt.value = isMobile && isPortrait
  if (showPrompt.value) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      showPrompt.value = false
    }, 3000)
  }
}

onMounted(() => {
  check()
  window.addEventListener('resize', check)
  window.addEventListener('orientationchange', () => setTimeout(check, 300))
})

onBeforeUnmount(() => {
  clearTimeout(timer)
  window.removeEventListener('resize', check)
  window.removeEventListener('orientationchange', check)
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.rotate-toast {
  position: fixed;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99999;
  pointer-events: none;
}
.rotate-toast-inner {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #fff;
  padding: 10px 18px;
  border-radius: 9999px;
  font-size: 0.875rem;
  white-space: nowrap;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}
.rotate-icon {
  color: #30d5c8;
  flex-shrink: 0;
}
</style>
