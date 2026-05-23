import { useEffect, useRef } from 'react'

export default function useScrollReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('on')
          }
        })
      },
      { threshold: 0.12 }
    )

    const el = ref.current
    if (!el) return
    const items = el.querySelectorAll('.rv')
    items.forEach(item => observer.observe(item))

    return () => items.forEach(item => observer.unobserve(item))
  }, [])

  return ref
}
