import { onMounted } from 'vue'

export function useProjectScroll() {
  onMounted(() => {
    const sections = document.querySelectorAll('.apple-project-section')
    if (!sections.length) return

    function clamp(v, min, max) { return Math.max(min, Math.min(max, v)) }
    function lerp(a, b, t) { return a + (b - a) * t }

    const isMobile = window.innerWidth < 768
    const maxBlur = isMobile ? 8 : 30
    const maxScale = isMobile ? 1.03 : 1.08

    function update() {
      const vh = window.innerHeight

      const progresses = []
      for (let i = 0; i < sections.length; i++) {
        const s = sections[i]
        const rect = s.getBoundingClientRect()
        const totalRange = s.offsetHeight - vh
        const progress = totalRange > 0 ? clamp(-rect.top / totalRange, 0, 1) : (rect.top < vh ? 1 : 0)
        progresses.push({ rect, totalRange, progress })
      }

      for (let i = 0; i < sections.length; i++) {
        const s = sections[i]
        const realImg = s.querySelector('.project-image-real')
        const placeholderImg = s.querySelector('.project-image-placeholder')
        // 优先使用已加载的真实图片，否则用占位层，都没有则回退到任意 img
        const img = (realImg?.classList.contains('image-ready') ? realImg : null)
          || placeholderImg
          || s.querySelector('.apple-project-image-wrap img')
        const content = s.querySelector('.apple-project-content')
        if (!img) continue

        const { progress } = progresses[i]

        // Block next project until this one is done (progress >= 0.95)
        if (i > 0 && progresses[i - 1].progress < 0.95) {
          img.style.clipPath = i % 2 === 0 ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)'
          img.style.filter = 'blur(0px)'
          img.style.transform = 'scale(1)'
          if (content) {
            content.style.opacity = '0'
            content.style.transform = 'translateY(40px)'
          }
          continue
        }

        // === TIMELINE ===
        // 0%  - 10%:  hidden
        // 10% - 45%:  image clip reveal (linear)
        // 45% - 65%:  image fully visible, blur ramps up
        // 60% - 70%:  text fades in (during blur, so text appears ON blurred bg)
        // 65% - 80%:  image stays blurred, text is sharp/readable in center
        // 80% - 95%:  text fades out
        // 90% - 100%: image blur decreases (fades to white)

        const direction = i % 2 === 0

        // Clip reveal
        let clipPercent
        if (progress < 0.1) {
          clipPercent = 100
        } else if (progress < 0.45) {
          const t = (progress - 0.1) / 0.35
          clipPercent = lerp(100, 0, t)
        } else {
          clipPercent = 0
        }

        let clipValue
        if (direction) {
          clipValue = `inset(0 ${clipPercent.toFixed(2)}% 0 0)`
        } else {
          clipValue = `inset(0 0 0 ${clipPercent.toFixed(2)}%)`
        }

        // Blur: ramp up after clip, then ramp down at end
        let blur, scale
        if (progress < 0.45) {
          blur = 0; scale = 1
        } else if (progress < 0.65) {
          const t = (progress - 0.45) / 0.2
          blur = lerp(0, maxBlur, t)
          scale = lerp(1, maxScale, t)
        } else if (progress < 0.9) {
          blur = maxBlur; scale = maxScale
        } else {
          const t = (progress - 0.9) / 0.1
          blur = lerp(maxBlur, 0, t)
          scale = lerp(maxScale, 1, t)
        }

        img.style.clipPath = clipValue
        img.style.filter = `blur(${blur.toFixed(1)}px)`
        img.style.transform = `scale(${scale.toFixed(4)})`

        // Text: fade in on blurred background, sharp in center, fade out
        if (content) {
          const fadeIn = clamp((progress - 0.6) / 0.1, 0, 1)
          const fadeOut = clamp((progress - 0.8) / 0.15, 0, 1)
          const opacity = Math.max(0, Math.min(fadeIn, 1 - fadeOut))
          const exitDir = i % 2 === 0 ? -1 : 1
          content.style.opacity = String(opacity)
          content.style.transform = `translateY(${lerp(30, 0, fadeIn)}px) translateX(${fadeOut * 20 * exitDir}px)`
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
