import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { AuthProvider } from './hooks/useAuth'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '0.875rem',
              borderRadius: '12px',
              border: '1px solid #E8E6E0',
            },
            success: { iconTheme: { primary: '#1B4332', secondary: '#D8F3DC' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
