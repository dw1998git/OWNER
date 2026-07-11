import { onMounted } from 'vue'

export function useProjectScroll() {
  onMounted(() => {
    const sections = document.querySelectorAll('.apple-project-section')
    if (!sections.length) return

    function clamp(v, min, max) { return Math.max(min, Math.min(max, v)) }
    function lerp(a, b, t) { return a + (b - a) * t }

    function update() {
      for (let i = 0; i < sections.length; i++) {
        const s = sections[i]
        const rect = s.getBoundingClientRect()
        const h = s.offsetHeight
        const progress = clamp(-rect.top / (h - window.innerHeight), 0, 1)
        const img = s.querySelector('.apple-project-image-wrap img')
        const content = s.querySelector('.apple-project-content')
        if (img) {
          const bp = clamp(progress * 1.5, 0, 1)
          img.style.filter = `blur(${lerp(0, 30, bp)}px)`
          img.style.transform = `scale(${lerp(1, 1.08, bp)})`
        }
        if (content) {
          const tp = clamp((progress - 0.15) / 0.4, 0, 1)
          content.style.opacity = String(tp)
          content.style.transform = `translateY(${lerp(60, 0, tp)}px)`
        }
      }
    }

    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => { update(); ticking = false })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    update()
  })
}
