import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

// Local imports
import { Loader } from '../components'

const CarDetails = () => {
	const { id } = useParams()
	const [carDetails, setCarDetails] = useState([])
	const [carImages, setCarImages] = useState([])
	const [dealerInfo, setDealerInfo] = useState({})
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const BASE_IMAGE_URL = 'https://www.carmodoo.com'

	useEffect(() => {
		const fetchCarDetails = async () => {
			setLoading(true)
			try {
				// Запрос данных
				const response = await axios.get(
					`https://corsproxy.io/?https://www.carmodoo.com/app/market/car_detail_tab.html?m_no=${id}&tab=1`,
					{ responseType: 'text' },
				)

				// Создаём временный div для парсинга HTML
				const tempDiv = document.createElement('div')
				tempDiv.innerHTML = response.data

				// 🔹 Извлекаем ссылки на фото 🔹
				const imageElements = tempDiv.querySelectorAll('.car-album li')
				const images = Array.from(imageElements)
					.map(
						(li) =>
							li.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/)?.[1],
					)
					.filter(Boolean)
					.map((src) => (src.startsWith('/data') ? BASE_IMAGE_URL + src : src)) // Формируем абсолютные URL

				setCarImages(images)

				// 🔹 Извлекаем данные об автомобиле 🔹
				const carInfo = Array.from(
					tempDiv.querySelectorAll('.article-list.carinfo-list li'),
				)
					.map((li) => ({
						label: li.querySelector('.article-tag')?.innerText.trim(),
						value: li.querySelector('.article-content')?.innerText.trim(),
					}))
					.filter((item) => item.label && item.value)

				setCarDetails(carInfo)

				// 🔹 Извлекаем данные о продавце 🔹
				const dealer = {
					name:
						tempDiv.querySelector('.dealer-info span')?.innerText ||
						'Неизвестно',
					phone:
						tempDiv.querySelector('.dealer-info p')?.innerText || 'Нет данных',
					address:
						tempDiv.querySelector('.article-content[style*="padding:8px"]')
							?.innerText || 'Нет данных',
				}
				setDealerInfo(dealer)
			} catch (err) {
				console.error('❌ Ошибка загрузки данных:', err)
				setError('Ошибка загрузки данных')
			} finally {
				setLoading(false)
			}
		}

		fetchCarDetails()
	}, [id])

	if (loading) return <Loader />
	if (error) return <p className='text-red-500'>{error}</p>

	const CustomPrevArrow = ({ onClick }) => (
		<button
			className='absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition hidden md:flex'
			onClick={onClick}
		>
			<FaChevronLeft size={24} />
		</button>
	)

	const CustomNextArrow = ({ onClick }) => (
		<button
			className='absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition hidden md:flex'
			onClick={onClick}
		>
			<FaChevronRight size={24} />
		</button>
	)

	// 🔹 Настройки слайдера 🔹
	const sliderSettings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		prevArrow: <CustomPrevArrow />,
		nextArrow: <CustomNextArrow />,
	}

	return (
		<div className='container mx-auto mt-16 py-12 px-4'>
			<h2 className='text-3xl font-bold mb-6 text-center'>Детали автомобиля</h2>

			{/* 🔹 Галерея изображений 🔹 */}
			{carImages.length > 0 ? (
				<div className='w-full flex justify-center'>
					<div className='w-full max-w-4xl mb-10'>
						<Slider {...sliderSettings}>
							{carImages.map((img, index) => (
								<div key={index} className='flex justify-center'>
									<img
										src={img}
										alt={`Car ${index}`}
										className='w-full h-auto max-h-[400px] object-contain'
									/>
								</div>
							))}
						</Slider>
					</div>
				</div>
			) : (
				<p className='text-gray-500 text-center mb-6'>Фото отсутствуют</p>
			)}

			{/* 🔹 Данные автомобиля 🔹 */}
			<div className='bg-white shadow-lg p-6 rounded-lg mb-6'>
				<h3 className='text-2xl font-semibold mb-4'>Основная информация</h3>
				<ul className='space-y-2 text-lg'>
					{carDetails.map((item, index) => (
						<li key={index} className='flex justify-between border-b pb-2'>
							<span className='font-semibold text-gray-700'>{item.label}</span>
							<span className='text-gray-900'>{item.value}</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

export default CarDetails
