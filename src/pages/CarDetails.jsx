import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

// Local imports
import { Loader } from '../components'

const CarDetails = () => {
	const { id } = useParams()
	const [carDetails, setCarDetails] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchCarDetails = async () => {
			setLoading(true)
			try {
				console.log(`Fetching car details for ID: ${id}`)

				// Загружаем HTML-страницу
				const response = await axios.get(
					`https://corsproxy.io/?https://www.carmodoo.com/app/market/car_detail_tab.html?m_no=${id}&tab=1`,
					{ responseType: 'text' },
				)

				console.log('Raw HTML Response:', response.data) // Проверяем HTML-ответ

				// Создаём временный div для парсинга HTML
				const tempDiv = document.createElement('div')
				tempDiv.innerHTML = response.data

				// Извлекаем данные из .carinfo-list
				const carInfoList =
					tempDiv.querySelector('.article-list.carinfo-list')?.innerHTML ||
					'Нет данных'

				console.log('Extracted carInfoList:', carInfoList)

				setCarDetails(carInfoList)
			} catch (err) {
				console.error('Ошибка загрузки данных:', err)
				setError('Ошибка загрузки данных')
			} finally {
				setLoading(false)
			}
		}

		fetchCarDetails()
	}, [id])

	if (loading) return <Loader />
	if (error) return <p className='text-red-500'>{error}</p>

	return (
		<div className='container mx-auto mt-16 py-12 px-4'>
			<h2 className='text-3xl font-bold mb-6 text-center'>Детали автомобиля</h2>
			<div className='bg-white shadow-lg p-6 rounded-lg'>
				<div dangerouslySetInnerHTML={{ __html: carDetails }} />
			</div>
		</div>
	)
}

export default CarDetails
