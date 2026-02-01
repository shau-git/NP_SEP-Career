import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        // Your backend port   
        //target: 'http://localhost:3000', 
        target: 'https://np-sep-career.onrender.com', 
        changeOrigin: true,
      },
    },
  },
})
