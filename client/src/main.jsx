import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Admin } from './pages/Admin'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Admin/>
  </StrictMode>,
)
