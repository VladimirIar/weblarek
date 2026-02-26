import { defineConfig } from 'vite'

// ВАЖНО для GitHub Pages:
// - base должен совпадать с именем репозитория (`/weblarek/`),
//   чтобы пути к собранным скриптам/стилям были корректными на https://<user>.github.io/weblarek/
// - outDir = 'docs', чтобы можно было публиковать GitHub Pages из папки /docs ветки main
export default defineConfig({
  base: '/weblarek/',
  build: {
    outDir: 'docs',
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [
          './src/scss'
        ],
      },
    },
  },
})