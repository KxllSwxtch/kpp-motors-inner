import axios from 'axios'
import { useEffect, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

// Local imports
import { parseXML } from '../utils'
import { CarsListItem, Loader } from '../components'

const CarsList = () => {
	const [cars, setCars] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [page, setPage] = useState(1)
	const [carType, setCarType] = useState('korean') // 'korean' или 'foreign'
	const [usdkrwRate, setUsdkrwRate] = useState(0)

	// Настройки пагинации
	const pageSize = 9
	const totalPages = 50 // Допустим, у нас 50 страниц (должно быть динамическим)
	const pageRange = 5 // Количество отображаемых страниц

	// Подтягиваем курс USD к KRW
	useEffect(() => {
		const fetchUSDKRWRate = async () => {
			const response = await axios.get(
				'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
			)
			const data = response.data
			setUsdkrwRate(data.usd.krw)
		}

		fetchUSDKRWRate()
	}, [])

	// Получаем список автомобилей
	useEffect(() => {
		const fetchCars = async () => {
			setLoading(true)
			window.scrollTo({ top: 0, behavior: 'smooth' }) // Прокрутка вверх при загрузке

			const url = `https://corsproxy.io/?https://www.carmodoo.com/app/market/_inc_car_list.html?mode=carList&cho=${
				carType === 'korean' ? '1' : '2'
			}&pageSize=${pageSize}&page=${page}`

			try {
				const response = await axios.get(url, { responseType: 'text' })
				const carsData = parseXML(response.data) // Используем новый парсер
				setCars(carsData)
			} catch (err) {
				console.error('Ошибка загрузки данных:', err)
				setError('Ошибка загрузки данных')
			} finally {
				setLoading(false)
			}
		}

		fetchCars()
	}, [page, carType])

	// Логика для показа страниц
	const getPageNumbers = () => {
		const startPage = Math.max(page - Math.floor(pageRange / 2), 1)
		const endPage = Math.min(startPage + pageRange - 1, totalPages)
		return Array.from(
			{ length: endPage - startPage + 1 },
			(_, i) => startPage + i,
		)
	}

	if (loading) return <Loader />
	if (error) return <p>{error}</p>

	return (
		<div className='container mx-auto mt-16 py-12 px-4'>
			<h2 className='text-3xl font-bold mb-6 text-center'>
				Список автомобилей
			</h2>
			{/* Переключение между категориями */}
			<div className='flex justify-center mb-6'>
				<button
					className={`cursor-pointer px-6 py-2 mx-2 rounded-lg font-semibold transition-all duration-300 ${
						carType === 'korean'
							? 'bg-secondary text-white'
							: 'bg-gray-100 hover:bg-gray-300'
					}`}
					onClick={() => setCarType('korean')}
				>
					Корейские авто
				</button>
				<button
					className={`cursor-pointer px-6 py-2 mx-2 rounded-lg font-semibold transition-all duration-300 ${
						carType === 'foreign'
							? 'bg-secondary text-white'
							: 'bg-gray-100 hover:bg-gray-300'
					}`}
					onClick={() => setCarType('foreign')}
				>
					Иномарки
				</button>
			</div>
			{/* Список автомобилей */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				{cars.map((car) => (
					<CarsListItem key={car.id} car={car} usdkrwRate={usdkrwRate} />
				))}
			</div>
			{/* Пагинация */}
			<div className='flex justify-center mt-8 space-x-2'>
				<button
					className={`flex items-center px-4 py-2 rounded-md font-semibold transition-all duration-300 ${
						page === 1
							? 'bg-gray-300 cursor-not-allowed'
							: 'bg-primary text-white hover:bg-secondary'
					}`}
					onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
					disabled={page === 1}
				>
					<FaChevronLeft className='mr-2' />
				</button>
				{getPageNumbers().map((pageNum) => (
					<button
						key={pageNum}
						className={`cursor-pointer px-4 py-2 rounded-md font-semibold transition-all duration-300 ${
							pageNum === page
								? 'bg-secondary text-white'
								: 'bg-gray-100 hover:bg-gray-300'
						}`}
						onClick={() => setPage(pageNum)}
					>
						{pageNum}
					</button>
				))}
				<button
					className='cursor-pointer flex items-center px-4 py-2 bg-primary text-white rounded-md font-semibold hover:bg-secondary transition-all duration-300'
					onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
				>
					<FaChevronRight className='ml-2' />
				</button>
			</div>
		</div>
	)
}

export default CarsList
