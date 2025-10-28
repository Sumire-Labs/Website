/**
 * Material Design 3 Ripple Effect Composable
 * Lightweight implementation optimized for performance
 */

export function useRipple() {
  const createRipple = (event: MouseEvent, element: HTMLElement) => {
    // Remove existing ripples to prevent memory leaks
    const existingRipples = element.querySelectorAll('.ripple-effect')
    existingRipples.forEach(ripple => ripple.remove())

    const ripple = document.createElement('span')
    ripple.classList.add('ripple-effect')

    const rect = element.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    ripple.style.width = ripple.style.height = `${size}px`
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`

    element.appendChild(ripple)

    // Remove ripple after animation completes (600ms)
    setTimeout(() => {
      ripple.remove()
    }, 600)
  }

  return {
    createRipple,
  }
}
