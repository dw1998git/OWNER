<template>
  <button
    type="button"
    class="back-to-top"
    :class="{ 'is-visible': visible }"
    aria-label="回到顶部"
    @click="scrollToTop"
  >
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 15V3M9 3L3.5 8.5M9 3l5.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </button>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const visible = ref(false)

const onScroll = () => {
  visible.value = window.scrollY > 600
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.back-to-top {
  position: fixed;
  right: 28px;
  bottom: 28px;
  z-index: 900;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: saturate(180%) blur(16px);
  -webkit-backdrop-filter: saturate(180%) blur(16px);
  color: var(--color-text-primary);
  box-shadow: var(--shadow-card);
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transform: translateY(12px);
  transition: opacity 0.24s ease, transform 0.24s ease, background 0.16s ease;
}
.back-to-top.is-visible {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}
.back-to-top:hover {
  background: #ffffff;
  transform: translateY(-2px);
}
.back-to-top:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .back-to-top {
    right: 16px;
    bottom: 16px;
  }
}
</style>
