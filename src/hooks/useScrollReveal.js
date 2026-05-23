import { useEffect, useRef } from 'react'

function revealIfInViewport(el) {
  const rect = el.getBoundingClientRect()
  const vh = window.innerHeight || document.documentElement.clientHeight
  if (rect.top < vh * 0.95 && rect.bottom > 0) {
    el.classList.add('on')
  }
}

export default function useScrollReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('on')
        })
      },
      { threshold: 0.05, rootMargin: '0px 0px -24px 0px' }
    )

    const bind = () => {
      const items = root.querySelectorAll('.rv')
      items.forEach((item) => {
        revealIfInViewport(item)
        observer.observe(item)
      })
      return items
    }

    let items = []
    const raf = requestAnimationFrame(() => {
      items = bind()
      requestAnimationFrame(() => {
        root.querySelectorAll('.rv').forEach(revealIfInViewport)
      })
    })

    return () => {
      cancelAnimationFrame(raf)
      items.forEach((item) => observer.unobserve(item))
      observer.disconnect()
    }
  }, [])

  return ref
}
