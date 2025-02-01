import { Link } from 'react-router-dom'

const ErrorPage = () => {
	return (
		<div className='flex flex-col items-center justify-center h-screen bg-gray-900 text-white text-center px-4 animate-fade-in'>
			<h1 className='text-6xl font-bold mb-4'>404</h1>
			<p className='text-xl mb-6'>Страница не найдена</p>
			<Link
				to='/'
				className='bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold transition-all duration-300'
			>
				Вернуться на главную
			</Link>
		</div>
	)
}

export default ErrorPage
