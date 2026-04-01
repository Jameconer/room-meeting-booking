import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // allowedHosts: ['Accident Report'],
    port: 8098, // ตั้งพอร์ตเป็น 8080
  },
})
