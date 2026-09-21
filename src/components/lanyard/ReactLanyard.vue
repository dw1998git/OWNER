<template>
  <div ref="containerRef" class="react-lanyard-container"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { createRoot } from 'react-dom/client'
import React from 'react'
import Lanyard from './Lanyard.jsx'

const props = defineProps({
  position: {
    type: Array,
    default: () => [0, 0, 30]
  },
  gravity: {
    type: Array,
    default: () => [0, -40, 0]
  },
  fov: {
    type: Number,
    default: 20
  },
  transparent: {
    type: Boolean,
    default: true
  },
  frontImage: {
    type: String,
    default: null
  },
  backImage: {
    type: String,
    default: null
  },
  imageFit: {
    type: String,
    default: 'cover'
  },
  lanyardImage: {
    type: String,
    default: null
  },
  lanyardWidth: {
    type: Number,
    default: 1
  }
})

const containerRef = ref(null)
let root = null

const renderLanyard = () => {
  if (!root) return
  root.render(
    React.createElement(Lanyard, {
      position: props.position,
      gravity: props.gravity,
      fov: props.fov,
      transparent: props.transparent,
      frontImage: props.frontImage,
      backImage: props.backImage,
      imageFit: props.imageFit,
      lanyardImage: props.lanyardImage,
      lanyardWidth: props.lanyardWidth
    })
  )
}

onMounted(() => {
  if (containerRef.value) {
    root = createRoot(containerRef.value)
    renderLanyard()
  }
})

onBeforeUnmount(() => {
  if (root) {
    root.unmount()
    root = null
  }
})

// Watch all props for changes and re-render
watch(
  () => [props.position, props.gravity, props.fov, props.transparent, props.frontImage, props.backImage, props.imageFit, props.lanyardImage, props.lanyardWidth],
  () => {
    renderLanyard()
  }
)
</script>

<style scoped>
.react-lanyard-container {
  width: 100%;
  height: 100%;
}
</style>
