import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Ganti 'aksara-karya-62' dengan nama repo GitHub kamu
// Contoh: jika repo = https://github.com/username/web-aksara → base: '/web-aksara/'
export default defineConfig({
  plugins: [react()],
  base: '/komunitas-prestasi-ipb62/',  // ← GANTI dengan nama repo GitHub kamu
})
