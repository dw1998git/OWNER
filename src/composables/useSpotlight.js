import { ref, onMounted, onUnmounted } from 'vue'

export function useSpotlight() {
  const spotlightCanvas = ref(null)
  const revealLayer = ref(null)
  let rafId = 0
  const mouse = { x: -999, y: -999 }
  const smooth = { x: -999, y: -999 }
  const SPOTLIGHT_R = 260

  onMounted(() => {
    const canvas = spotlightCanvas.value
    const layer = revealLayer.value
    if (!canvas || !layer) return
    const ctx = canvas.getContext('2d')
    const section = canvas.parentElement

    function resize() {
      canvas.width = section.offsetWidth
      canvas.height = section.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    section.addEventListener('mousemove', e => {
      const rect = section.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    })
    section.addEventListener('mouseleave', () => {
      mouse.x = -999
      mouse.y = -999
    })

    function loop() {
      smooth.x += (mouse.x - smooth.x) * 0.1
      smooth.y += (mouse.y - smooth.y) * 0.1
      if (smooth.x > -500) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        const g = ctx.createRadialGradient(smooth.x, smooth.y, 0, smooth.x, smooth.y, SPOTLIGHT_R)
        g.addColorStop(0, 'rgba(255,255,255,1)')
        g.addColorStop(0.4, 'rgba(255,255,255,1)')
        g.addColorStop(0.6, 'rgba(255,255,255,0.75)')
        g.addColorStop(0.75, 'rgba(255,255,255,0.4)')
        g.addColorStop(0.88, 'rgba(255,255,255,0.12)')
        g.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(smooth.x, smooth.y, SPOTLIGHT_R, 0, Math.PI * 2)
        ctx.fill()
        const url = canvas.toDataURL()
        layer.style.webkitMaskImage = `url(${url})`
        layer.style.maskImage = `url(${url})`
      } else {
        const transparent = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==)"
        layer.style.webkitMaskImage = transparent
        layer.style.maskImage = transparent
      }
      rafId = requestAnimationFrame(loop)
    }
    loop()
  })

  onUnmounted(() => {
    cancelAnimationFrame(rafId)
  })

  return { spotlightCanvas, revealLayer }
}
