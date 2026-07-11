import { onMounted } from 'vue'

export function useReveal() {
  onMounted(() => {
    const els = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          const bars = entry.target.querySelectorAll('.skill-progress-bar')
          bars.forEach(bar => {
            const w = bar.dataset.width
            if (w) bar.style.width = w + '%'
          })
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })
    els.forEach(el => observer.observe(el))
  })
}
