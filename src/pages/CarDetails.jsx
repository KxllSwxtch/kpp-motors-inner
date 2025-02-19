import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { FaWhatsapp, FaInstagram, FaTiktok, FaFacebook } from 'react-icons/fa'

// Local imports
import { Loader, CustomNextArrow, CustomPrevArrow } from '../components'

const CarDetails = () => {
	const { id } = useParams()
	const [carDetails, setCarDetails] = useState([])
	const [carImages, setCarImages] = useState([])
	const [dealerInfo, setDealerInfo] = useState({})
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [engineVolume, setEngineVolume] = useState(null)
	const [customsFees, setCustomsFees] = useState(null)
	const [loadingFees, setLoadingFees] = useState(false)

	const BASE_IMAGE_URL = 'https://www.carmodoo.com'

	const calculateAge = (year, month) => {
		const currentDate = new Date()
		const carDate = new Date(year, month - 1, 1) // Указываем 1-е число месяца

		// Вычисляем возраст в месяцах
		const ageInMonths =
			(currentDate.getFullYear() - carDate.getFullYear()) * 12 +
			(currentDate.getMonth() - carDate.getMonth())

		if (ageInMonths < 36) {
			return '0-3'
		} else if (ageInMonths < 60) {
			return '3-5'
		} else if (ageInMonths < 84) {
			return '5-7'
		} else {
			return '7-0'
		}
	}

	// Получаем данные по объёму двс
	useEffect(() => {
		const fetchCarEngineVolume = async (carId) => {
			try {
				const response = await axios.get(
					`https://corsproxy.io/?https://www.carmodoo.com/app/market/car_detail_tab.html?m_no=${carId}&tab=4`,
					{ responseType: 'text' },
				)

				const parser = new DOMParser()
				const doc = parser.parseFromString(response.data, 'text/html')

				// Ищем все `td`, у которых внутри `label`
				const rows = Array.from(doc.querySelectorAll('td'))

				rows.forEach((td) => {
					const label = td.querySelector('label')
					if (!label) return

					const labelText = label.textContent.trim()

					// Ищем объем двигателя (배기량 (cc))
					if (labelText.includes('배기량(cc)')) {
						const p = td.querySelector('p')
						if (p) {
							setEngineVolume(parseInt(p.textContent.trim(), 10))
						}
					}
				})
			} catch (error) {
				console.error('Ошибка получения характеристик двигателя:', error)
			}
			return null
		}

		fetchCarEngineVolume(id)
	}, [id])

	// Вывод базовой информации по автомобилю
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
				if (images.length === 0) {
					setCarImages(['/placeholder.jpg']) // Заглушка
				} else {
					setCarImages(images)
				}

				const carInfo = []

				// 🔹 Извлекаем стандартные данные (где есть .article-tag и .article-content)
				Array.from(
					tempDiv.querySelectorAll('.article-list.carinfo-list li'),
				).forEach((li) => {
					const label = li.querySelector('.article-tag')?.innerText?.trim()
					const value = li.querySelector('.article-content')?.innerText?.trim()

					if (label && value) {
						carInfo.push({ label, value })
					}
				})

				// 🔹 Извлекаем дополнительные данные из <p> внутри <li>
				Array.from(
					tempDiv.querySelectorAll('.article-list.carinfo-list li p'),
				).forEach((p) => {
					const label = p.querySelector('.article-tag')?.innerText?.trim()
					const value = p.querySelector('.article-content')?.innerText?.trim()

					if (label && value) {
						carInfo.push({ label, value })
					}
				})

				if (carInfo.length === 0) {
					throw new Error('Данные об автомобиле отсутствуют')
				}
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
				setTimeout(() => {
					window.location.href = '/404'
				}, 2000)
			} finally {
				setLoading(false)
			}
		}

		fetchCarDetails()
	}, [id])

	// Расчёт таможенных платежей по авто
	useEffect(() => {
		const fetchCustomsFees = async (volume, price, fuelType, yearMonth) => {
			setLoadingFees(true)

			const carYear = `20${yearMonth.split('/')[0]}`
			const carMonth = yearMonth.split('/')[1]
			const carAge = calculateAge(carYear, carMonth)

			try {
				const response = await axios.post(
					'https://corsproxy.io/?key=28174bc7&url=https://calcus.ru/calculate/Customs',
					new URLSearchParams({
						owner: 1,
						age: carAge,
						engine: 1,
						power: 1,
						power_unit: 1,
						value: volume,
						price: parseInt(price.replace(/\D+/gm, '')) * 10000,
						curr: 'KRW',
					}).toString(),
					{
						withCredentials: false,
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
						},
					},
				)

				setCustomsFees(response.data)
			} catch (error) {
				console.error('Ошибка расчёта таможенных платежей:', error)
			}
			setLoadingFees(false)
		}

		const formattedCarDate = `${
			carDetails
				?.filter((item) => item.label === '최초등록일')[0]
				?.value.split('.')[0]
		}/${
			carDetails
				?.filter((item) => item.label === '최초등록일')[0]
				?.value.split('.')[1]
		}`

		fetchCustomsFees(engineVolume, carDetails[0]?.value, 1, formattedCarDate)
	}, [carDetails, engineVolume])

	if (loading) return <Loader />
	if (error) {
		return (
			<div className='text-center mt-40 h-full flex items-center justify-center flex-col'>
				<h2 className='text-3xl font-bold text-red-600'>
					Ошибка загрузки автомобиля
				</h2>
				<p className='text-gray-500 mt-2'>{error}</p>
				<a
					href='/'
					className='mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition'
				>
					Вернуться на главную
				</a>
			</div>
		)
	}

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

	// Форматированные данные об автомобиле
	const formattedCarPrice = (
		parseInt(carDetails[0].value.replace(/\D+/gm, '')) * 10000
	).toLocaleString()

	const formattedCarDate = `${
		carDetails
			?.filter((item) => item.label === '최초등록일')[0]
			?.value.split('.')[0]
	}/${
		carDetails
			?.filter((item) => item.label === '최초등록일')[0]
			?.value.split('.')[1]
	}`

	const formattedCarMileage = parseInt(
		carDetails
			.filter((item) => item.label === '주행거리')[0]
			.value.replace(/\D+/gm, ''),
	).toLocaleString()

	const formattedFuelType =
		carDetails.filter((item) => item.label === '연료')[0].value === '휘발유' ||
		carDetails.filter((item) => item.label === '연료')[0].value === '가솔린'
			? 'Бензин'
			: carDetails.filter((item) => item.label === '연료')[0].value ===
					'디젤' ||
			  carDetails.filter((item) => item.label === '연료')[0].value === '경유'
			? 'Дизель'
			: carDetails.filter((item) => item.label === '연료')[0].value === 'LPG' ||
			  carDetails.filter((item) => item.label === '연료')[0].value === 'LPi'
			? 'Газ'
			: carDetails.filter((item) => item.label === '연료')[0].value === '겸용'
			? 'Гибрид'
			: carDetails.filter((item) => item.label === '연료')[0].value === '전기'
			? 'Электро'
			: ''

	const formattedTransmissionType =
		carDetails.filter((item) => item.label === '변속기')[0].value === '오토'
			? 'Автоматическая'
			: 'Механика'

	return (
		<div className='container mx-auto mt-16 py-12 px-4'>
			{/* <h2 className='text-3xl font-bold mb-6 text-center'>{}</h2> */}

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
					<li className='flex justify-between border-b pb-2'>
						{/* Цена автомобиля */}
						<span className='font-semibold text-gray-700'>Цена автомобиля</span>
						<span className='text-gray-900'>₩{formattedCarPrice}</span>
					</li>
					<li className='flex justify-between border-b pb-2'>
						{/* Номер автомобиля */}
						<span className='font-semibold text-gray-700'>
							Номер автомобиля
						</span>
						<span className='text-gray-900'>{carDetails[1].value}</span>
					</li>
					<li className='flex justify-between border-b pb-2'>
						{/* Год выпуска */}
						<span className='font-semibold text-gray-700'>Год выпуска</span>
						<span className='text-gray-900'>{formattedCarDate}</span>
					</li>
					<li className='flex justify-between border-b pb-2'>
						{/* Пробег */}
						<span className='font-semibold text-gray-700'>Пробег</span>
						<span className='text-gray-900'>{formattedCarMileage} км</span>
					</li>
					<li className='flex justify-between border-b pb-2'>
						{/* Объём */}
						<span className='font-semibold text-gray-700'>Объём</span>
						<span className='text-gray-900'>
							{engineVolume?.toLocaleString()} cc
						</span>
					</li>
					<li className='flex justify-between border-b pb-2'>
						{/* Топливо */}
						<span className='font-semibold text-gray-700'>Топливо</span>
						<span className='text-gray-900'>{formattedFuelType}</span>
					</li>
					<li className='flex justify-between border-b pb-2'>
						{/* КПП */}
						<span className='font-semibold text-gray-700'>Коробка передач</span>
						<span className='text-gray-900'>{formattedTransmissionType}</span>
					</li>
				</ul>

				{/* 🔹 Расчёты таможенных платежей 🔹 */}
				{loadingFees ? (
					<Loader />
				) : (
					customsFees && (
						<div className='bg-white shadow-lg p-6 rounded-lg mb-6'>
							<h3 className='text-2xl font-semibold mb-4'>
								Таможенные платежи во Владивостоке
							</h3>
							<ul className='space-y-2 text-lg'>
								<li className='flex justify-between border-b pb-2'>
									<span className='font-semibold text-gray-700'>
										Таможенная пошлина
									</span>
									<span className='text-gray-900'>
										{customsFees?.tax || '—'} ₽
									</span>
								</li>
								<li className='flex justify-between border-b pb-2'>
									<span className='font-semibold text-gray-700'>
										Таможенный Сбор
									</span>
									<span className='text-gray-900'>
										{customsFees?.sbor || '—'} ₽
									</span>
								</li>
								<li className='flex justify-between border-b pb-2'>
									<span className='font-semibold text-gray-700'>
										Утилизационный сбор
									</span>
									<span className='text-gray-900'>
										{customsFees?.util || '—'} ₽
									</span>
								</li>
								<li className='flex justify-between border-b pb-2 text-xl font-bold'>
									<span className='font-semibold text-gray-700'>Итого</span>
									<span className='text-red-600'>
										{customsFees?.total || '—'} ₽
									</span>
								</li>
							</ul>
						</div>
					)
				)}

				{/* 🔹 Контактная информация 🔹 */}
				<div className='bg-white shadow-lg p-6 rounded-lg mb-6 mt-5 text-center'>
					<h3 className='text-2xl font-semibold mb-4 text-center'>Контакты</h3>
					<div className='text-lg text-center space-y-2'>
						<p>
							📞 <strong>Константин:</strong> +82 10-7650-3034
						</p>
						<p>
							📞 <strong>Константин:</strong> +82 10-7291-1701
						</p>
						<p>
							📞 <strong>Елена (English, 한국어):</strong> +82 10-3504-1522
						</p>
					</div>

					<div className='mt-10'>
						<h3 className='text-xl font-bold'>KPP Motors в соц. сетях</h3>
						<a
							href='https://www.instagram.com/bazarish_auto/'
							target='_blank'
							rel='noopener noreferrer'
							className='flex items-center justify-center mt-3 mb-3'
						>
							<FaInstagram
								size={30}
								className='text-pink-500 hover:text-pink-600 transition mr-1'
							/>{' '}
							Instagram
						</a>
						<a
							href='https://www.facebook.com/share/1D8bg2xL1i/?mibextid=wwXIfr'
							target='_blank'
							rel='noopener noreferrer'
							className='flex items-center justify-center mt-3 mb-3'
						>
							<FaFacebook
								size={30}
								className='text-blue-600 hover:text-blue-700 transition mr-1'
							/>
							Facebook
						</a>
						<a
							href='https://www.tiktok.com/@kpp_motors'
							target='_blank'
							rel='noopener noreferrer'
							className='flex items-center justify-center mt-3 mb-3'
						>
							<FaTiktok
								size={30}
								className='text-black hover:text-gray-700 transition mr-1'
							/>{' '}
							TikTok
						</a>
					</div>
				</div>

				{/* 🔹 Кнопка связи 🔹 */}
				<div className='mt-6 flex justify-center'>
					<a
						href='https://wa.me/821076503034'
						target='_blank'
						rel='noopener noreferrer'
						className='bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 shadow-md transition-all'
					>
						<FaWhatsapp size={24} />
						<span>Связаться с менеджером</span>
					</a>
				</div>
			</div>
		</div>
	)
}

export default CarDetails
