import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'path'
import { copyFileSync } from 'fs'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    plugins: [
        react(),
        {
            name: 'copy-htaccess',
            closeBundle() {
                // Vite skips dotfiles on some systems; copy manually to be safe
                try {
                    copyFileSync(
                        resolve(__dirname, 'public/.htaccess'),
                        resolve(__dirname, 'dist/.htaccess')
                    )
                } catch {/* already copied */}
            },
        },
    ],
})
