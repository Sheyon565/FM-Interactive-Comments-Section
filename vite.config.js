import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    base: '/FM-Interactive-Comments-Section/',
    plugins: [
        tailwindcss(),
    ],
})