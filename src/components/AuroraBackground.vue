<template>
  <canvas ref="auroraCanvas" class="aurora-canvas" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const auroraCanvas = ref(null)
let rafId = 0

onMounted(() => {
  const canvas = auroraCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const colorStops = ['#5227FF', '#ffec67', '#5227FF']
  const amplitude = 1.0
  const blend = 0.5
  let time = 0

  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  function lerp(a, b, t) { return a + (b - a) * t }

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return { r, g, b }
  }

  const rgbStops = colorStops.map(hexToRgb)

  function getColor(t) {
    t = ((t % 1) + 1) % 1
    const scaled = t * (rgbStops.length - 1)
    const idx = Math.floor(scaled)
    const frac = scaled - idx
    const c1 = rgbStops[idx % rgbStops.length]
    const c2 = rgbStops[(idx + 1) % rgbStops.length]
    return {
      r: Math.round(lerp(c1.r, c2.r, frac)),
      g: Math.round(lerp(c1.g, c2.g, frac)),
      b: Math.round(lerp(c1.b, c2.b, frac))
    }
  }

  function drawAurora() {
    time += 0.003
    const w = canvas.width
    const h = canvas.height
    ctx.clearRect(0, 0, w, h)

    const bands = 5
    for (let b = 0; b < bands; b++) {
      ctx.beginPath()
      const baseY = h * 0.2 + (h * 0.6 / bands) * b
      const freq = 0.002 + b * 0.0005
      const phase = time * (0.5 + b * 0.3) + b * 1.5

      ctx.moveTo(0, h)
      for (let x = 0; x <= w; x += 3) {
        const y = baseY
          + Math.sin(x * freq + phase) * 80 * amplitude
          + Math.sin(x * freq * 2.3 + phase * 1.4) * 40 * amplitude
          + Math.sin(x * freq * 0.7 + phase * 0.6) * 60 * amplitude
        ctx.lineTo(x, y)
      }
      ctx.lineTo(w, h)
      ctx.closePath()

      const colorT = (b / bands + time * 0.15) % 1
      const color = getColor(colorT)
      const alpha = (0.06 + blend * 0.12) * (1 - Math.abs(b - bands / 2) / (bands / 2) * 0.6)
      ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${alpha})`
      ctx.fill()
    }

    rafId = requestAnimationFrame(drawAurora)
  }

  drawAurora()
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
})
</script>
