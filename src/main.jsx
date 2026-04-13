import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { AuthProvider } from './hooks/useAuth'
import './styles/global.css'

// Handle redirect dari 404.html untuk SPA routing di GitHub Pages
(function() {
  const redirect = sessionStorage.redirect;
  delete sessionStorage.redirect;
  if (redirect && redirect !== location.pathname + location.search + location.hash) {
    history.replaceState(null, null, redirect);
  }
})();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
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