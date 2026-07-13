<template>
  <div
    v-if="isVisible"
    class="dock-label"
    role="tooltip"
    :style="{ 
      transform: 'translateX(-50%)',
      opacity: labelOpacity,
      top: `${labelY}px`
    }"
  >
    {{ label }}
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  isVisible: Boolean,
  label: String
})

const labelOpacity = ref(0)
const labelY = ref(0)

// 监听可见性变化
watch(() => props.isVisible, (newVal) => {
  if (newVal) {
    // 显示动画
    animateLabel(1, -10)
  } else {
    // 隐藏动画
    animateLabel(0, 0)
  }
}, { immediate: true })

// 动画函数
const animateLabel = (targetOpacity, targetY) => {
  const currentOpacity = labelOpacity.value
  const currentY = labelY.value
  
  const opacityStep = (targetOpacity - currentOpacity) * 0.3
  const yStep = (targetY - currentY) * 0.3
  
  labelOpacity.value += opacityStep
  labelY.value += yStep
  
  // 如果还未到达目标值，继续动画
  if (Math.abs(labelOpacity.value - targetOpacity) > 0.01 || Math.abs(labelY.value - targetY) > 0.5) {
    requestAnimationFrame(() => animateLabel(targetOpacity, targetY))
  } else {
    labelOpacity.value = targetOpacity
    labelY.value = targetY
  }
}
</script>

<style scoped>
.dock-label {
  position: absolute;
  top: -1.5rem;
  left: 50%;
  width: fit-content;
  white-space: pre;
  border-radius: 0.375rem;
  border: 1px solid #222;
  background-color: #120F17;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  color: #fff;
}
</style>