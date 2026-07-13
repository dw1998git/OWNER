<template>
  <div
    ref="itemRef"
    class="dock-item"
    :style="{ width: `${currentSize}px`, height: `${currentSize}px` }"
    @click="$emit('click')"
    @mouseenter="handleHoverStart"
    @mouseleave="handleHoverEnd"
    tabindex="0"
    role="button"
    :aria-label="item.label"
  >
    <div class="dock-icon">
      <component :is="item.icon" />
    </div>
    <DockLabel :is-visible="isHovered" :label="item.label" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watchEffect } from 'vue'
import DockLabel from './DockLabel.vue'

const props = defineProps({
  item: Object,
  mouseX: Number,
  distance: Number,
  magnification: Number,
  baseItemSize: Number
})

const emit = defineEmits(['click'])

const itemRef = ref(null)
const isHovered = ref(false)
const mouseDistance = ref(Infinity)
const currentSize = ref(props.baseItemSize)

const handleHoverStart = () => {
  isHovered.value = true
}

const handleHoverEnd = () => {
  isHovered.value = false
}

// 更新鼠标距离
const updateMouseDistance = () => {
  if (itemRef.value && props.mouseX !== Infinity) {
    const rect = itemRef.value.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    mouseDistance.value = Math.abs(props.mouseX - centerX)
  } else {
    mouseDistance.value = Infinity
  }
}

// 计算尺寸
const calculateSize = () => {
  if (mouseDistance.value <= props.distance) {
    // 根据距离计算放大程度
    const proximityRatio = 1 - (mouseDistance.value / props.distance)
    const sizeIncrease = (props.magnification - props.baseItemSize) * proximityRatio
    return props.baseItemSize + sizeIncrease
  }
  return props.baseItemSize
}

// 动画效果
let animationId = null
const animateSize = (targetSize) => {
  const currentSizeValue = currentSize.value
  const delta = targetSize - currentSizeValue
  const step = delta * 0.2 // 20% 的插值
  
  if (Math.abs(delta) > 0.5) {
    currentSize.value = currentSizeValue + step
    animationId = requestAnimationFrame(() => animateSize(targetSize))
  } else {
    currentSize.value = targetSize
  }
}

// 监听鼠标位置变化
watchEffect(() => {
  updateMouseDistance()
  const targetSize = calculateSize()
  animateSize(targetSize)
})

// 处理键盘事件
const handleKeyDown = (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    emit('click')
  }
}

onMounted(() => {
  if (itemRef.value) {
    itemRef.value.addEventListener('keydown', handleKeyDown)
  }
})

onUnmounted(() => {
  if (itemRef.value) {
    itemRef.value.removeEventListener('keydown', handleKeyDown)
  }
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped>
.dock-item {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background-color: #120F17;
  border: 1px solid #222;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  outline: none;
}

.dock-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>