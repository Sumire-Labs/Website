/**
 * v-ripple directive for Material Design 3 ripple effect
 * Usage: <button v-ripple>Click me</button>
 */

import type { Directive } from 'vue'
import { useRipple } from '@/composables/useRipple'

export const rippleDirective: Directive = {
  mounted(el: HTMLElement) {
    const { createRipple } = useRipple()

    // Ensure element has position relative/absolute for ripple positioning
    const position = window.getComputedStyle(el).position
    if (position === 'static') {
      el.style.position = 'relative'
    }

    // Add overflow hidden to contain ripple effect
    el.style.overflow = 'hidden'

    const handleClick = (event: MouseEvent) => {
      createRipple(event, el)
    }

    el.addEventListener('click', handleClick)

    // Store handler for cleanup
    ;(el as any)._rippleHandler = handleClick
  },

  unmounted(el: HTMLElement) {
    const handler = (el as any)._rippleHandler
    if (handler) {
      el.removeEventListener('click', handler)
      delete (el as any)._rippleHandler
    }
  },
}
