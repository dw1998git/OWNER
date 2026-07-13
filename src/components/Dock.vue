<template>
  <div 
    ref="dockOuterRef"
    class="dock-outer"
    :style="{ height: `${animatedHeight}px` }"
  >
    <div
      ref="dockPanelRef"
      class="dock-panel"
      :style="{ height: `${panelHeight}px` }"
      role="toolbar"
      aria-label="Application dock"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    >
      <DockItem
        v-for="(item, index) in items"
        :key="index"
        :item="item"
        :mouse-x="currentMouseX"
        :distance="distance"
        :magnification="magnification"
        :base-item-size="baseItemSize"
        @click="item.onClick"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watchEffect } from 'vue'
import DockItem from './DockItem.vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  className: {
    type: String,
    default: ''
  },
  magnification: {
    type: Number,
    default: 70
  },
  distance: {
    type: Number,
    default: 200
  },
  panelHeight: {
    type: Number,
    default: 68
  },
  dockHeight: {
    type: Number,
    default: 256
  },
  baseItemSize: {
    type: Number,
    default: 50
  }
})

const dockOuterRef = ref(null)
const dockPanelRef = ref(null)
const isHovered = ref(false)
const currentMouseX = ref(Infinity)
const animatedHeight = ref(props.panelHeight)

// 计算最大高度
const maxHeight = computed(() => 
  Math.max(props.dockHeight, props.magnification + props.magnification / 2 + 4)
)

const handleMouseMove = (e) => {
  isHovered.value = true
  currentMouseX.value = e.pageX
  animatedHeight.value = maxHeight.value
}

const handleMouseLeave = () => {
  isHovered.value = false
  currentMouseX.value = Infinity
  animatedHeight.value = props.panelHeight
}

// 平滑动画效果
let animationId = null
const animateHeight = (targetHeight) => {
  const currentHeight = animatedHeight.value
  const delta = targetHeight - currentHeight
  const step = delta * 0.1
  
  if (Math.abs(delta) > 0.5) {
    animatedHeight.value = currentHeight + step
    animationId = requestAnimationFrame(() => animateHeight(targetHeight))
  } else {
    animatedHeight.value = targetHeight
  }
}

// 监听鼠标位置变化
watchEffect(() => {
  if (isHovered.value) {
    animateHeight(maxHeight.value)
  } else {
    animateHeight(props.panelHeight)
  }
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped>
.dock-outer {
  margin: 0 0.5rem;
  display: flex;
  max-width: 100%;
  align-items: center;
}

.dock-panel {
  position: absolute;
  bottom: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: flex-end;
  width: fit-content;
  gap: 1rem;
  border-radius: 1rem;
  background-color: #120F17;
  border: 1px solid #222;
  padding: 0 0.5rem 0.5rem;
}
</style>