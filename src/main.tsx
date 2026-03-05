import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'   // 👈 importar BrowserRouter
import './index.css'
import App from './App.tsx'

const rootElement = document.getElementById('root')!
const splashElement = document.getElementById('splash')

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>   {/* 👈 envolver App */}
      <App />
    </BrowserRouter>
  </StrictMode>,
)

// Esperar 1 segundo antes de ocultar splash
setTimeout(() => {
  if (splashElement) {
    splashElement.style.opacity = "0"
    splashElement.style.transition = "opacity 0.5s ease"
    setTimeout(() => {
      splashElement.style.display = "none"
      rootElement.style.display = "block"
    }, 500) // espera a que termine la transición
  }
}, 1000)
