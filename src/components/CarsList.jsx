import axios from 'axios'
import { useEffect, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

// Local imports
import { parseXML } from '../utils'
import { CarsListItem, Loader, Filters } from '../components'

const CarsList = () => {
	const [cars, setCars] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [page, setPage] = useState(1)
	const [carType, setCarType] = useState('korean') // 'korean' или 'foreign'
	const [usdkrwRate, setUsdkrwRate] = useState(0)
	const [isExport, setIsExport] = useState(false)

	// Фильтры
	const [filters, setFilters] = useState({
		bm_no: '', // Марка
		bo_no: '', // Модель
		bs_no: '', // Тип двигателя и объём
		bd_no: '', // Комплектация
		c_carNum: '', // Номер автомобиля
		searchSY: '', // Год от
		searchEY: '', // Год до
		searchSMileage: '', // Пробег от
		searchEMileage: '', // Пробег до
		searchSPrice: '', // Цена от
		searchEPrice: '', // Цена до
		fuel: '', // Тип топлива
		gearbox: '', // Тип КПП
		colors: '', // Цвет(а)
		ordKey: '', // Сортировка
	})

	// Фильтры, которые применяются после нажатия "Применить фильтры"
	const [appliedFilters, setAppliedFilters] = useState({ ...filters })

	// Настройки пагинации
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

			// Формируем URL с параметрами фильтрации
			const params = new URLSearchParams({
				cho:
					appliedFilters.c_carNum.length > 0
						? '0'
						: appliedFilters.c_carNum.length === 0 && carType === 'korean'
						? '1'
						: '2',
				pageSize: 9,
				page: page,

				bm_no: appliedFilters.bm_no,
				bo_no: appliedFilters.bo_no,
				bs_no: appliedFilters.bs_no,
				bd_no: appliedFilters.bd_no,
				c_carNum: appliedFilters.c_carNum,
				searchSY: appliedFilters.searchSY ? appliedFilters.searchSY : '',
				searchEY: appliedFilters.searchEY ? appliedFilters.searchEY : '',
				searchSMileage: appliedFilters.searchSMileage,
				searchEMileage: appliedFilters.searchEMileage,
				searchSPrice: appliedFilters.searchSPrice / 10000,
				searchEPrice: appliedFilters.searchEPrice / 10000,
				fuel: appliedFilters.fuel,
				gearbox: appliedFilters.gearbox,
				colors: appliedFilters.colors,
				ordKey: appliedFilters.ordKey,
			})

			const url = `https://corsproxy.io/?https://www.carmodoo.com/app/market/_inc_car_list.html?mode=carList&${params.toString()}`

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
	}, [page, carType, appliedFilters])

	// Функция для обновления состояния фильтров
	const handleFilterChange = (newFilters) => {
		setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }))
	}

	// Применить фильтры (обновляем `appliedFilters`)
	const applyFilters = () => {
		setAppliedFilters(filters)
		setPage(1) // Сбрасываем страницу на первую
	}

	// Логика для показа страниц
	const getPageNumbers = () => {
		const startPage = Math.max(page - Math.floor(pageRange / 2), 1)
		const endPage = Math.min(startPage + pageRange - 1, totalPages)
		return Array.from(
			{ length: endPage - startPage + 1 },
			(_, i) => startPage + i,
		)
	}

	// Сброс фильтров
	const resetFilters = () => {
		const defaultFilters = {
			bm_no: '',
			bo_no: '',
			bs_no: '',
			bd_no: '',
			c_carNum: '',
			searchSY: '',
			searchEY: '',
			searchSMileage: '',
			searchEMileage: '',
			searchSPrice: '',
			searchEPrice: '',
			fuel: '',
			gearbox: '',
			colors: '',
			ordKey: '',
		}

		setFilters(defaultFilters) // Обновляем отображаемые фильтры
		setAppliedFilters(defaultFilters) // Сбрасываем применённые фильтры
		setPage(1) // Сбрасываем страницу на первую
	}

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
					onClick={() => {
						setCarType('korean')
						resetFilters({})
					}}
				>
					Корейские авто
				</button>
				<button
					className={`cursor-pointer px-6 py-2 mx-2 rounded-lg font-semibold transition-all duration-300 ${
						carType === 'foreign'
							? 'bg-secondary text-white'
							: 'bg-gray-100 hover:bg-gray-300'
					}`}
					onClick={() => {
						setCarType('foreign')
						resetFilters()
					}}
				>
					Иномарки
				</button>
			</div>

			<div className='flex justify-center gap-4 my-4'>
				<button
					className={`cursor-pointer px-4 py-2 rounded-lg ${
						!isExport ? 'bg-blue-500 text-white' : 'bg-gray-200'
					}`}
					onClick={() => setIsExport(false)}
				>
					Внутри Кореи
				</button>
				<button
					className={`cursor-pointer px-4 py-2 rounded-lg ${
						isExport ? 'bg-blue-500 text-white' : 'bg-gray-200'
					}`}
					onClick={() => setIsExport(true)}
				>
					Экспорт
				</button>
			</div>

			<Filters
				filters={filters}
				setFilters={handleFilterChange}
				carType={carType}
				resetFilters={resetFilters}
				applyFilters={applyFilters}
			/>

			{loading ? (
				<Loader />
			) : (
				<>
					{/* Список автомобилей */}
					{cars.length > 0 ? (
						<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
							{cars.map((car) => (
								<CarsListItem
									key={car.id}
									car={car}
									usdkrwRate={usdkrwRate}
									isExport={isExport}
								/>
							))}
						</div>
					) : (
						<h1>Автомобили не найдены</h1>
					)}

					{/* Пагинация */}
					{cars.length > 0 && (
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
								onClick={() =>
									setPage((prev) => Math.min(prev + 1, totalPages))
								}
							>
								<FaChevronRight className='ml-2' />
							</button>
						</div>
					)}
				</>
			)}
		</div>
	)
}

export default CarsList
