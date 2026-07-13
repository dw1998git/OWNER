import { onMounted } from 'vue'

export function useReveal() {
  onMounted(() => {
    // Standard reveal
    const els = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible', 'revealed')
          const bars = entry.target.querySelectorAll('.skill-progress-bar')
          bars.forEach(bar => {
            const w = bar.dataset.width
            if (w) bar.style.width = w + '%'
          })
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' })
    els.forEach(el => observer.observe(el))

    // Slide-in from left/right
    const slides = document.querySelectorAll('.slide-in')
    const slideObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('slide-visible')
          slideObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' })
    slides.forEach(el => slideObserver.observe(el))

    // Stagger list items
    const staggerGroups = document.querySelectorAll('.stagger-group')
    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('.stagger-item')
          items.forEach((item, i) => {
            setTimeout(() => {
              item.classList.add('stagger-visible')
            }, i * 120)
          })
          staggerObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.2 })
    staggerGroups.forEach(el => staggerObserver.observe(el))

    // 3D tilt cards
    const tiltCards = document.querySelectorAll('.tilt-card')
    const tiltObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('tilt-visible')
          tiltObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.15 })
    tiltCards.forEach(el => tiltObserver.observe(el))

    // Parallax float elements
    const floats = document.querySelectorAll('.float-in')
    const floatObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('float-visible')
          floatObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })
    floats.forEach(el => floatObserver.observe(el))
  })
}
