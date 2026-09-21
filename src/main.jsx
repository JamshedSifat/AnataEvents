import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { router } from './app/router.jsx'
import { RouterProvider } from 'react-router'
import { AuthProvider } from './auth/Context/AuthContext.jsx'
import { ServiceProvider } from './auth/Context/ServiceContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <AuthProvider>
      <ServiceProvider>
        <RouterProvider router={router} />
      </ServiceProvider>
    </AuthProvider>
  </StrictMode>,
  
)
