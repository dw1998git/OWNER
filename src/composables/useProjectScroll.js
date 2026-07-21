import { onMounted } from 'vue'

export function useProjectScroll() {
  onMounted(() => {
    const sections = document.querySelectorAll('.apple-project-section')
    if (!sections.length) return

    function clamp(v, min, max) { return Math.max(min, Math.min(max, v)) }
    function lerp(a, b, t) { return a + (b - a) * t }

    const isMobile = window.innerWidth < 768
    const maxBlur = isMobile ? 6 : 30
    const maxScale = isMobile ? 1.02 : 1.08

    // 移动端：不互相阻挡，每段独立动画，文字几乎全时段可见
    const T = isMobile ? {
      clipEnd: 0.4,
      blurEnd: 0.6,
      textIn: 0.0,
      textOutEnd: 1.0,
      blurStayEnd: 0.8,
      blurOutEnd: 1.0,
    } : {
      clipEnd: 0.45,
      blurEnd: 0.65,
      textInStart: 0.6,
      textInEnd: 0.7,
      textOutStart: 0.8,
      textOutEnd: 0.95,
      blurStayEnd: 0.9,
      blurOutEnd: 1.0,
    }

    function update() {
      const vh = window.innerHeight

      for (let i = 0; i < sections.length; i++) {
        const s = sections[i]
        const img = s.querySelector('.apple-project-image-wrap .project-image-main') || s.querySelector('.apple-project-image-wrap img')
        const content = s.querySelector('.apple-project-content')
        if (!img) continue

        const rect = s.getBoundingClientRect()
        const totalRange = s.offsetHeight - vh
        const progress = totalRange > 0 ? clamp(-rect.top / totalRange, 0, 1) : (rect.top < vh ? 1 : 0)

        // 移动端：不互相阻挡，每个 section 独立计算
        if (isMobile) {
          const direction = i % 2 === 0

          // Clip reveal (0 ~ clipEnd)
          let clipPercent
          if (progress < 0.05) {
            clipPercent = 100
          } else if (progress < T.clipEnd) {
            const t = (progress - 0.05) / (T.clipEnd - 0.05)
            clipPercent = lerp(100, 0, t)
          } else {
            clipPercent = 0
          }

          if (direction) {
            img.style.clipPath = `inset(0 ${clipPercent.toFixed(2)}% 0 0)`
          } else {
            img.style.clipPath = `inset(0 0 0 ${clipPercent.toFixed(2)}%)`
          }

          // Blur
          let blur, scale
          if (progress < T.clipEnd) {
            blur = 0; scale = 1
          } else if (progress < T.blurEnd) {
            const t = (progress - T.clipEnd) / (T.blurEnd - T.clipEnd)
            blur = lerp(0, maxBlur, t)
            scale = lerp(1, maxScale, t)
          } else if (progress < T.blurStayEnd) {
            blur = maxBlur; scale = maxScale
          } else {
            const t = (progress - T.blurStayEnd) / (T.blurOutEnd - T.blurStayEnd)
            blur = lerp(maxBlur, 0, t)
            scale = lerp(maxScale, 1, t)
          }

          img.style.filter = `blur(${blur.toFixed(1)}px)`
          img.style.transform = `scale(${scale.toFixed(4)})`

          // 文字：一旦 clip 展开就立即显示，一直保持到结束
          if (content) {
            if (progress > 0.05 && progress < T.textOutEnd) {
              content.style.opacity = '1'
              content.style.transform = 'translateY(0)'
            } else {
              content.style.opacity = '0'
              content.style.transform = 'translateY(40px)'
            }
          }
          continue
        }

        // 桌面端：保留原始阻挡逻辑
        if (i > 0) {
          const prev = sections[i - 1]
          const prevRect = prev.getBoundingClientRect()
          const prevRange = prev.offsetHeight - vh
          const prevProgress = prevRange > 0 ? clamp(-prevRect.top / prevRange, 0, 1) : (prevRect.top < vh ? 1 : 0)
          if (prevProgress < T.textOutEnd) {
            const dir = i % 2 === 0
            img.style.clipPath = dir ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)'
            img.style.filter = 'blur(0px)'
            img.style.transform = 'scale(1)'
            if (content) {
              content.style.opacity = '0'
              content.style.transform = 'translateY(40px)'
            }
            continue
          }
        }

        const direction = i % 2 === 0

        let clipPercent
        if (progress < 0.1) {
          clipPercent = 100
        } else if (progress < T.clipEnd) {
          const t = (progress - 0.1) / (T.clipEnd - 0.1)
          clipPercent = lerp(100, 0, t)
        } else {
          clipPercent = 0
        }

        if (direction) {
          img.style.clipPath = `inset(0 ${clipPercent.toFixed(2)}% 0 0)`
        } else {
          img.style.clipPath = `inset(0 0 0 ${clipPercent.toFixed(2)}%)`
        }

        let blur, scale
        if (progress < T.clipEnd) {
          blur = 0; scale = 1
        } else if (progress < T.blurEnd) {
          const t = (progress - T.clipEnd) / (T.blurEnd - T.clipEnd)
          blur = lerp(0, maxBlur, t)
          scale = lerp(1, maxScale, t)
        } else if (progress < T.blurStayEnd) {
          blur = maxBlur; scale = maxScale
        } else {
          const t = (progress - T.blurStayEnd) / (T.blurOutEnd - T.blurStayEnd)
          blur = lerp(maxBlur, 0, t)
          scale = lerp(maxScale, 1, t)
        }

        img.style.filter = `blur(${blur.toFixed(1)}px)`
        img.style.transform = `scale(${scale.toFixed(4)})`

        if (content) {
          const fadeIn = clamp((progress - T.textInStart) / (T.textInEnd - T.textInStart), 0, 1)
          const fadeOut = clamp((progress - T.textOutStart) / (T.textOutEnd - T.textOutStart), 0, 1)
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
