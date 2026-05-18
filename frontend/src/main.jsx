import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { resolveRouterBasename } from './lib/routerBasename.js'

const routerBasename = resolveRouterBasename()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="min-h-screen w-full">
      <BrowserRouter basename={routerBasename}>
        <App />
      </BrowserRouter>
    </div>
  </StrictMode>,
)
