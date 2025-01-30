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

	// Настройки пагинации
	const pageSize = 9
	const totalPages = 50 // Допустим, у нас 50 страниц (должно быть динамическим)
	const pageRange = 5 // Количество отображаемых страниц

	useEffect(() => {
		const fetchCars = async () => {
			setLoading(true)
			window.scrollTo({ top: 0, behavior: 'smooth' }) // Прокрутка вверх при загрузке

			try {
				const response = await axios.get(
					`http://www.carmodoo.com/app/market/_inc_car_list.html?mode=carList&searchField=cho=0&bm_no=0&bo_no=0&bs_no=0&bd_no=0&searchSY=&searchEY=&searchSPrice=&searchEPrice=&searchSMileage=&searchEMileage=&fuel=&gearbox=&colors=&tons=&yong=&area=%EA%B2%BD%EA%B8%B0&gugun=%EC%88%98%EC%9B%90&areaGroup=&complex=&c_carNum=&c_regName=&c_dealerName=&c_sangsaName=&c_dealerHp=&optFlag1=&optFlag2=&optFlag3=&extFlag3=&extFlag4=&extFlag5=&extFlag6=&ordKey=&pageSize=${pageSize}&page=${page}`,
					{ responseType: 'text' },
				)

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
	}, [page])

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
			{/* Список автомобилей */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				{cars.map((car) => (
					<CarsListItem key={car.id} car={car} />
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
