import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { router } from './Router/Route.jsx'
import { RouterProvider } from 'react-router'
import { AuthProvider } from './Auth/Context/AuthContext.jsx'
import { ServiceProvider } from './Auth/Context/ServiceContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ServiceProvider>
        <RouterProvider router={router} />
      </ServiceProvider>
    </AuthProvider>
  </StrictMode>,
)
