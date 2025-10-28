import { createApp } from 'vue'
import '@/assets/styles/main.css'
import App from './App.vue'
import router from './router'
import { rippleDirective } from './directives/ripple'

const app = createApp(App)

// Register global directives
app.directive('ripple', rippleDirective)

// Global Error Handler
app.config.errorHandler = (err, instance, info) => {
  // Log error details in development
  if (import.meta.env.DEV) {
    console.error('=== Vue Error Handler ===')
    console.error('Error:', err)
    console.error('Component:', instance)
    console.error('Error Info:', info)
    console.error('========================')
  } else {
    // In production, you could send errors to an external service
    // Example: Sentry, LogRocket, etc.
    console.error('Application error occurred:', err)
  }
}

// Global Warning Handler (development only)
app.config.warnHandler = (msg, instance, trace) => {
  if (import.meta.env.DEV) {
    console.warn('=== Vue Warning ===')
    console.warn('Message:', msg)
    console.warn('Component:', instance)
    console.warn('Trace:', trace)
    console.warn('===================')
  }
}

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  if (import.meta.env.DEV) {
    console.error('=== Unhandled Promise Rejection ===')
    console.error('Reason:', event.reason)
    console.error('===================================')
  } else {
    console.error('Unhandled promise rejection:', event.reason)
  }
  // Prevent default browser error handling
  event.preventDefault()
})

app.use(router)

app.mount('#app')
