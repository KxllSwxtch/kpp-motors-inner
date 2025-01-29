/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: '#B22222', // Красный для акцентов (например, кнопки)
				secondary: '#4682B4', // Синий для заголовков и выделений
				background: '#F5F5F5', // Светло-серый для фона
				dark: '#333333', // Темно-серый для текста
				light: '#FFFFFF', // Белый для текста и фона
			},
		},
	},
	plugins: [],
}
