<template>
  <div
    ref="containerRef"
    class="pixel-card"
    :class="className"
    @mouseenter="handleAnimation('appear')"
    @mouseleave="handleAnimation('disappear')"
    :tabindex="finalNoFocus ? -1 : 0"
  >
    <canvas ref="canvasRef" class="pixel-canvas" />
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

// Define variants configuration
const VARIANTS = {
  default: {
    activeColor: null,
    gap: 5,
    speed: 35,
    colors: '#f8fafc,#f1f5f9,#cbd5e1',
    noFocus: false
  },
  blue: {
    activeColor: '#e0f2fe',
    gap: 10,
    speed: 25,
    colors: '#e0f2fe,#7dd3fc,#0ea5e9',
    noFocus: false
  },
  yellow: {
    activeColor: '#fef08a',
    gap: 3,
    speed: 20,
    colors: '#fef08a,#fde047,#eab308',
    noFocus: false
  },
  pink: {
    activeColor: '#fecdd3',
    gap: 6,
    speed: 80,
    colors: '#fecdd3,#fda4af,#e11d48',
    noFocus: true
  }
}

// Define Pixel class
class Pixel {
  constructor(canvas, context, x, y, color, speed, delay) {
    this.width = canvas.width
    this.height = canvas.height
    this.ctx = context
    this.x = x
    this.y = y
    this.color = color
    this.speed = this.getRandomValue(0.1, 0.9) * speed
    this.size = 0
    this.sizeStep = Math.random() * 0.4
    this.minSize = 0.5
    this.maxSizeInteger = 2
    this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger)
    this.delay = delay
    this.counter = 0
    this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01
    this.isIdle = false
    this.isReverse = false
    this.isShimmer = false
  }

  getRandomValue(min, max) {
    return Math.random() * (max - min) + min
  }

  draw() {
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5
    this.ctx.fillStyle = this.color
    this.ctx.fillRect(this.x + centerOffset, this.y + centerOffset, this.size, this.size)
  }

  appear() {
    this.isIdle = false
    if (this.counter <= this.delay) {
      this.counter += this.counterStep
      return
    }
    if (this.size >= this.maxSize) {
      this.isShimmer = true
    }
    if (this.isShimmer) {
      this.shimmer()
    } else {
      this.size += this.sizeStep
    }
    this.draw()
  }

  disappear() {
    this.isShimmer = false
    this.counter = 0
    if (this.size <= 0) {
      this.isIdle = true
      return
    } else {
      this.size -= 0.1
    }
    this.draw()
  }

  shimmer() {
    if (this.size >= this.maxSize) {
      this.isReverse = true
    } else if (this.size <= this.minSize) {
      this.isReverse = false
    }
    if (this.isReverse) {
      this.size -= this.speed
    } else {
      this.size += this.speed
    }
  }
}

// Get effective speed considering reduced motion
const getEffectiveSpeed = (value, reducedMotion) => {
  const min = 0
  const max = 100
  const throttle = 0.001
  const parsed = parseInt(value, 10)

  if (parsed <= min || reducedMotion) {
    return min
  } else if (parsed >= max) {
    return max * throttle
  } else {
    return parsed * throttle
  }
}

// Props
const props = defineProps({
  variant: {
    type: String,
    default: 'default'
  },
  gap: {
    type: Number,
    default: null
  },
  speed: {
    type: Number,
    default: null
  },
  colors: {
    type: String,
    default: null
  },
  noFocus: {
    type: Boolean,
    default: null
  },
  className: {
    type: String,
    default: ''
  }
})

// Refs
const containerRef = ref(null)
const canvasRef = ref(null)
const pixelsRef = ref([])
const animationRef = ref(null)
const timePreviousRef = ref(performance.now())

// Get variant configuration
const variantCfg = VARIANTS[props.variant] || VARIANTS.default
const finalGap = props.gap ?? variantCfg.gap
const finalSpeed = props.speed ?? variantCfg.speed
const finalColors = props.colors ?? variantCfg.colors
const finalNoFocus = props.noFocus ?? variantCfg.noFocus

// Initialize pixels
const initPixels = () => {
  if (!containerRef.value || !canvasRef.value) return

  const rect = containerRef.value.getBoundingClientRect()
  const width = Math.floor(rect.width)
  const height = Math.floor(rect.height)
  const ctx = canvasRef.value.getContext('2d')

  canvasRef.value.width = width
  canvasRef.value.height = height
  canvasRef.value.style.width = `${width}px`
  canvasRef.value.style.height = `${height}px`

  const colorsArray = finalColors.split(',')
  const pxs = []
  for (let x = 0; x < width; x += parseInt(finalGap, 10)) {
    for (let y = 0; y < height; y += parseInt(finalGap, 10)) {
      const color = colorsArray[Math.floor(Math.random() * colorsArray.length)]

      const dx = x - width / 2
      const dy = y - height / 2
      const distance = Math.sqrt(dx * dx + dy * dy)
      const delay = distance

      pxs.push(new Pixel(canvasRef.value, ctx, x, y, color, getEffectiveSpeed(finalSpeed, false), delay))
    }
  }
  pixelsRef.value = pxs
}

// Animation function
const doAnimate = (fnName) => {
  animationRef.value = requestAnimationFrame(() => doAnimate(fnName))
  const timeNow = performance.now()
  const timePassed = timeNow - timePreviousRef.value
  const timeInterval = 1000 / 60

  if (timePassed < timeInterval) return
  timePreviousRef.value = timeNow - (timePassed % timeInterval)

  const ctx = canvasRef.value?.getContext('2d')
  if (!ctx || !canvasRef.value) return

  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)

  let allIdle = true
  for (let i = 0; i < pixelsRef.value.length; i++) {
    const pixel = pixelsRef.value[i]
    pixel[fnName]()
    if (!pixel.isIdle) {
      allIdle = false
    }
  }
  if (allIdle) {
    cancelAnimationFrame(animationRef.value)
  }
}

// Handle animation
const handleAnimation = (name) => {
  cancelAnimationFrame(animationRef.value)
  animationRef.value = requestAnimationFrame(() => doAnimate(name))
}

// Watch for prop changes and reinitialize
watch([() => props.gap, () => props.speed, () => props.colors, () => props.noFocus], () => {
  initPixels()
})

// Lifecycle
onMounted(() => {
  initPixels()
  
  // Setup resize observer
  const resizeObserver = new ResizeObserver(() => {
    initPixels()
  })
  
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value)
  }
  
  // Cleanup
  onUnmounted(() => {
    resizeObserver.disconnect()
    cancelAnimationFrame(animationRef.value)
  })
})
</script>

<style scoped>
.pixel-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.pixel-card {
  height: 400px;
  width: 300px;
  position: relative;
  overflow: hidden;
  display: grid;
  place-items: center;
  aspect-ratio: 4 / 5;
  border: 1px solid #27272a;
  border-radius: 25px;
  isolation: isolate;
  transition: border-color 200ms cubic-bezier(0.5, 1, 0.89, 1);
  user-select: none;
}

.pixel-card::before {
  content: '';
  position: absolute;
  inset: 0;
  margin: auto;
  aspect-ratio: 1;
  background: radial-gradient(circle, #09090b, transparent 85%);
  opacity: 0;
  transition: opacity 800ms cubic-bezier(0.5, 1, 0.89, 1);
}

.pixel-card:hover::before,
.pixel-card:focus-within::before {
  opacity: 1;
}
</style>