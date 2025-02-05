import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
	server: {
		proxy: {
			'/api/customs': {
				target: 'https://calcus.ru/calculate/Customs',
				changeOrigin: true,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'User-Agent':
						'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
					Referer: 'https://calcus.ru/',
					Origin: 'https://calcus.ru',
				},
				rewrite: (path) => path.replace(/^\/api\/customs/, ''),
			},
		},
	},
	plugins: [react(), tailwindcss()],
	build: {
		outDir: 'dist',
	},
})
