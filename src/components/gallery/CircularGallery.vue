<template>
  <div ref="containerRef" class="circular-gallery-host"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { createRoot } from 'react-dom/client'
import React from 'react'
import CircularGallery from './CircularGallery.jsx'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  textColor: {
    type: String,
    default: '#1d1d1f'
  },
  autoScroll: {
    type: Number,
    default: 0.6
  },
  itemAspect: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['item-click'])

const containerRef = ref(null)
let root = null

const renderGallery = () => {
  if (!root) return
  root.render(
    React.createElement(CircularGallery, {
      items: props.items,
      bend: 3,
      textColor: props.textColor,
      font: 'bold 30px "SF Pro Display", "Noto Sans SC", sans-serif',
      borderRadius: 0.08,
      itemSize: 1,
      itemAspect: props.itemAspect,
      scrollEase: 0.05,
      autoScroll: props.autoScroll,
      openOnClick: false,
      onItemClick: (item, index) => emit('item-click', item, index)
    })
  )
}

onMounted(() => {
  if (containerRef.value) {
    root = createRoot(containerRef.value)
    renderGallery()
  }
})

onBeforeUnmount(() => {
  if (root) {
    root.unmount()
    root = null
  }
})

watch(
  () => [props.items, props.textColor, props.autoScroll, props.itemAspect],
  () => {
    renderGallery()
  }
)
</script>

<style scoped>
.circular-gallery-host {
  width: 100%;
  height: 100%;
}
</style>
