<template>
  <!-- 全屏遮罩 - 仅首次进入显示 -->
  <transition name="fade">
    <div class="rotate-overlay" v-if="showFullMask" @click="dismiss">
      <div class="rotate-card" @click.stop>
        <div class="rotate-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
            <path d="M19 5l-7 7-7-7" opacity="0.3"></path>
          </svg>
          <svg class="rotate-arrow" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
          </svg>
        </div>
        <p class="rotate-text">横屏浏览效果更佳</p>
        <p class="rotate-sub">点击任意处关闭</p>
      </div>
    </div>
  </transition>
  <!-- 小提示 - 关闭遮罩后若仍竖屏，一直显示 -->
  <transition name="toast-fade">
    <div class="rotate-toast" v-if="showMiniToast" @click="showMiniToast = false">
      <div class="rotate-toast-inner">
        <svg class="toast-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="23 4 23 10 17 10"></polyline>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
        </svg>
        <span>横屏浏览效果更佳</span>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const showFullMask = ref(false)
const showMiniToast = ref(false)
const maskDismissed = ref(false)
let timer = null

function check() {
  const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent)
  const isPortrait = window.innerWidth < window.innerHeight

  if (isMobile && isPortrait) {
    if (!maskDismissed.value) {
      showFullMask.value = true
      clearTimeout(timer)
      timer = setTimeout(() => {
        showFullMask.value = false
        maskDismissed.value = true
        showMiniToast.value = true
      }, 3000)
    } else {
      showMiniToast.value = true
    }
  } else {
    showFullMask.value = false
    showMiniToast.value = false
  }
}

function dismiss() {
  showFullMask.value = false
  maskDismissed.value = true
  clearTimeout(timer)
  showMiniToast.value = true
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
  transition: opacity 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.toast-fade-enter-active, .toast-fade-leave-active {
  transition: opacity 0.3s ease;
}
.toast-fade-enter-from, .toast-fade-leave-to {
  opacity: 0;
}
.rotate-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(9, 9, 11, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
}
.rotate-card {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  cursor: default;
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
.rotate-toast {
  position: fixed;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  cursor: pointer;
}
.rotate-toast-inner {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #fff;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 0.75rem;
  white-space: nowrap;
  box-shadow: 0 2px 12px rgba(0,0,0,0.2);
}
.toast-icon {
  color: #30d5c8;
  flex-shrink: 0;
}
</style>
