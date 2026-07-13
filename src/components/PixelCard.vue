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
    gap: 8,  // Increased gap for less density
    speed: 45, // Slower speed for smoother animation
    colors: '#f8fafc,#f1f5f9,#e2e8f0',
    noFocus: false
  },
  blue: {
    activeColor: '#dbeafe',
    gap: 12, // Larger gap for less density
    speed: 35, // Balanced speed
    colors: '#dbeafe,#93c5fd,#3b82f6',
    noFocus: false
  },
  yellow: {
    activeColor: '#fef9c3',
    gap: 10,
    speed: 30,
    colors: '#fef9c3,#fcd34d,#f59e0b',
    noFocus: false
  },
  pink: {
    activeColor: '#fce7f3',
    gap: 14, // Larger gap for less density
    speed: 60,
    colors: '#fce7f3,#f9a8d4,#ec4899',
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
    this.speed = this.getRandomValue(0.05, 0.5) * speed * 0.1 // Reduced speed impact
    this.size = 0
    this.sizeStep = Math.random() * 0.2 + 0.1 // Reduced size step for smoother animation
    this.minSize = 0.3
    this.maxSizeInteger = 1.5
    this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger)
    this.delay = delay
    this.counter = 0
    this.counterStep = Math.random() * 2 + (this.width + this.height) * 0.005 // Reduced counter step
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
      this.size -= 0.08 // Slower disappearance
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
      this.size -= this.speed * 0.02 // Slower shimmer
    } else {
      this.size += this.speed * 0.02
    }
  }
}

// Get effective speed considering reduced motion
const getEffectiveSpeed = (value, reducedMotion) => {
  const min = 0
  const max = 100
  const throttle = 0.0005 // Reduced throttle for smoother animation
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
      const delay = distance * 0.3 // Reduced delay factor

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
  z-index: 1;
  position: relative;
}

.pixel-card {
  position: relative;
  overflow: hidden;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  isolation: isolate;
  transition: border-color 200ms cubic-bezier(0.5, 1, 0.89, 1);
  user-select: none;
  background: rgba(18, 15, 23, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.pixel-card::before {
  content: '';
  position: absolute;
  inset: 0;
  margin: auto;
  aspect-ratio: 1;
  background: radial-gradient(circle, rgba(9, 9, 11, 0.8), transparent 85%);
  opacity: 0;
  transition: opacity 800ms cubic-bezier(0.5, 1, 0.89, 1);
  z-index: 0;
}

.pixel-card:hover::before,
.pixel-card:focus-within::before {
  opacity: 0.3;
}

/* Ensure content is always visible above the pixel animation */
:slotted(*) {
  position: relative;
  z-index: 10;
  color: white;
}
</style>