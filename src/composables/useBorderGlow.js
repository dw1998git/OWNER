import { ref, onMounted, onUnmounted } from 'vue'

export function useBorderGlow(cardRef) {
  const edgeProximity = ref(0)
  const cursorAngle = ref(45)
  const isMobile = ref(false)

  const checkDevice = () => {
    isMobile.value = !window.matchMedia('(hover: hover) and (pointer: fine)').matches
  }

  const getCenterOfElement = (el) => {
    const { width, height } = el.getBoundingClientRect()
    return [width / 2, height / 2]
  }

  const getEdgeProximity = (el, x, y) => {
    const [cx, cy] = getCenterOfElement(el)
    const dx = x - cx
    const dy = y - cy
    let kx = Infinity
    let ky = Infinity
    if (dx !== 0) kx = cx / Math.abs(dx)
    if (dy !== 0) ky = cy / Math.abs(dy)
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1)
  }

  const getCursorAngle = (el, x, y) => {
    const [cx, cy] = getCenterOfElement(el)
    const dx = x - cx
    const dy = y - cy
    if (dx === 0 && dy === 0) return 0
    const radians = Math.atan2(dy, dx)
    let degrees = radians * (180 / Math.PI) + 90
    if (degrees < 0) degrees += 360
    return degrees
  }

  const handlePointerMove = (e) => {
    const card = cardRef.value
    if (!card || isMobile.value) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    edgeProximity.value = Math.round(getEdgeProximity(card, x, y) * 100 * 1000) / 1000
    cursorAngle.value = Math.round(getCursorAngle(card, x, y) * 1000) / 1000
  }

  const handlePointerLeave = () => {
    if (isMobile.value) return
    edgeProximity.value = 0
  }

  const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3)
  const easeInCubic = (x) => x * x * x

  const animateValue = ({ start = 0, end = 100, duration = 1000, delay = 0, ease = easeOutCubic, onUpdate, onEnd }) => {
    const t0 = performance.now() + delay
    const tick = () => {
      const elapsed = performance.now() - t0
      const t = Math.min(elapsed / duration, 1)
      onUpdate(start + (end - start) * ease(t))
      if (t < 1) {
        requestAnimationFrame(tick)
      } else if (onEnd) {
        onEnd()
      }
    }
    setTimeout(() => requestAnimationFrame(tick), delay)
  }

  const startSweepAnimation = () => {
    const card = cardRef.value
    if (!card) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const angleStart = 110
    const angleEnd = 465

    card.classList.add('sweep-active')
    cursorAngle.value = angleStart

    animateValue({
      duration: 500,
      onUpdate: (v) => { edgeProximity.value = v }
    })
    animateValue({
      ease: easeInCubic,
      duration: 1500,
      end: 50,
      onUpdate: (v) => {
        cursorAngle.value = (angleEnd - angleStart) * (v / 100) + angleStart
      }
    })
    animateValue({
      ease: easeOutCubic,
      delay: 1500,
      duration: 2250,
      start: 50,
      end: 100,
      onUpdate: (v) => {
        cursorAngle.value = (angleEnd - angleStart) * (v / 100) + angleStart
      }
    })
    animateValue({
      ease: easeInCubic,
      delay: 2500,
      duration: 1500,
      start: 100,
      end: 0,
      onUpdate: (v) => { edgeProximity.value = v },
      onEnd: () => {
        card.classList.remove('sweep-active')
        edgeProximity.value = 0
      }
    })
  }

  const cleanup = () => {
    if (cardRef.value) {
      cardRef.value.classList.remove('sweep-active')
    }
  }

  onMounted(() => {
    checkDevice()
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const onDeviceChange = () => checkDevice()
    mq.addEventListener('change', onDeviceChange)
    onUnmounted(() => {
      mq.removeEventListener('change', onDeviceChange)
      cleanup()
    })
  })

  return {
    edgeProximity,
    cursorAngle,
    isMobile,
    handlePointerMove,
    handlePointerLeave,
    startSweepAnimation,
    cleanup
  }
}