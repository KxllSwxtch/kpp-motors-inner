import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'

import { translateCarName } from '../utils'
import { carModelsTranslation } from '../translations'
import { ImageSlider, Loader, Calculator } from '../components'

const translations = {
	price: 'Цена в Корее (₩)',
	연식: 'Год выпуска',
	최초등록일: 'Дата первой регистрации',
	연료: 'Тип топлива',
	휘발유: 'Бензин',
	경유: 'Дизель',
	전기: 'Электро',
	하이브리드: 'Гибрид',
	변속기: 'Трансмиссия',
	오토: 'Автомат',
	수동: 'Механика',
	색상: 'Цвет',
	흰색: 'Белый',
	검정색: 'Чёрный',
	회색: 'Серый',
	파란색: 'Синий',
	빨간색: 'Красный',
	주행거리: 'Пробег',
	차량번호: 'Гос. номер',
	차대번호: 'VIN-номер',
	'압류｜저당': 'Был в ДТП',
	'0건｜0건': 'Нет',
	모델명: 'Модель',
	세금미납: 'Задолженность по налогам',
	없음: 'Отсутствует',
	제시번호: 'Номер предложения',
}

const API_BASE_URL = 'https://ark-motors-backend-3a002a527613.herokuapp.com'

const CarDetails = () => {
	const { carId } = useParams()
	const [carData, setCarData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [images, setImages] = useState([])
	const [carName, setCarName] = useState('')
	const [carHistoryURL, setCarHistoryURL] = useState('')
	const [showPopup, setShowPopup] = useState(false)

	useEffect(() => {
		const fetchCarDetails = async () => {
			try {
				const response = await axios.get(`${API_BASE_URL}/car-details`, {
					params: { carId },
				})
				// Сервер возвращает JSON с полями carName и carData
				setCarName(response.data.carName)
				setCarData(response.data.carData)
				const secureURL = response.data.carHistoryURL?.replace(
					/^http:\/\//i,
					'https://',
				)
				setCarHistoryURL(secureURL)
			} catch (error) {
				console.error('Ошибка при загрузке деталей автомобиля:', error)
			} finally {
				setLoading(false)
			}
		}

		const fetchCarImages = async () => {
			try {
				const response = await axios.get(`${API_BASE_URL}/car-images`, {
					params: { carId },
				})
				setImages(response.data.images)
			} catch (error) {
				console.error('Ошибка загрузки изображений:', error)
			}
		}

		fetchCarDetails()
		fetchCarImages()
	}, [carId])

	if (loading) return <Loader />

	return (
		<div className='container mx-auto p-4 max-w-6xl mt-30'>
			{/* Основной контейнер с фото слева и информацией справа */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-10'>
				{/* Фотографии автомобиля */}
				<div className='overflow-hidden'>
					{images.length > 0 ? (
						<ImageSlider images={images} />
					) : (
						<p className='text-center text-gray-500'>Фотографии отсутствуют</p>
					)}

					<div className='hidden md:block'>
						<Calculator />
					</div>
				</div>

				{/* Информация об автомобиле */}
				<div className='bg-white rounded-lg shadow-lg p-8'>
					<h2 className='text-2xl font-bold mb-6 text-gray-800 text-center'>
						{carName ? translateCarName(carName) : 'Модель не указана'}
					</h2>

					{/* Компактное расположение данных в табличном стиле */}
					<div className='border-t border-gray-200'>
						{carData ? (
							<table className='w-full text-left mt-4'>
								<tbody>
									{Object.entries(carData).map(([key, value], index) => (
										<tr
											key={index}
											className={`border-b border-gray-100 transition duration-300 hover:bg-gray-50 ${
												index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
											}`}
										>
											{/* Название характеристики */}
											<td className='py-3 px-2 text-sm font-medium text-gray-600 w-1/3 md:w-1/4'>
												{translations[key] || key}
											</td>
											{/* Значение характеристики */}
											<td className='py-3 px-2 text-sm text-gray-800 text-right'>
												<b>
													{translations[value] ||
														carModelsTranslation[value] ||
														value?.toLocaleString()}
												</b>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						) : (
							<p className='text-center text-gray-500'>Автомобиль не найден</p>
						)}
					</div>
				</div>
			</div>

			{carHistoryURL ? (
				<div className='mt-10'>
					<h2 className='text-xl font-bold text-gray-700 mb-4 text-center'>
						Техническая карта автомобиля
					</h2>
					<div className='relative'>
						<iframe
							src={carHistoryURL}
							title='Car History'
							className='w-full h-[80vh] border border-gray-300 rounded-lg shadow-md'
						/>
						<div className='text-center mt-2'>
							<a
								href={carHistoryURL}
								target='_blank'
								rel='noopener noreferrer'
								className='block text-sm text-white hover:text-gray-300 transition bg-black p-2 rounded mt-5 m-auto'
							>
								🔍 Открыть в новой вкладке
							</a>
						</div>
					</div>
				</div>
			) : (
				<p className='text-center text-gray-500'>Ссылка на карту не найдена</p>
			)}

			<div className='mt-10 md:hidden'>
				<Calculator />
			</div>

			<div className='mt-10 p-8 bg-white border border-gray-100'>
				<h3 className='text-4xl font-bold text-gray-800 mb-8 text-center'>
					Контакты для связи
				</h3>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					{/* Виталий */}
					<div className='p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200'>
						<p className='text-lg font-semibold text-gray-700 mb-1'>
							Константин
						</p>
						<a
							href='tel:+821093441782'
							className='block text-xl text-red-600 hover:text-red-500 transition duration-300'
						>
							+82 10-7650-3034
						</a>
					</div>
					<div className='p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200'>
						<p className='text-lg font-semibold text-gray-700 mb-1'>
							Константин
						</p>
						<a
							href='tel:+821093441782'
							className='block text-xl text-red-600 hover:text-red-500 transition duration-300'
						>
							+82 10-7291-1701
						</a>
					</div>
					<div className='p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200'>
						<p className='text-lg font-semibold text-gray-700 mb-1'>
							Елена (English, 한국어)
						</p>
						<a
							href='tel:+821093441782'
							className='block text-xl text-red-600 hover:text-red-500 transition duration-300'
						>
							+82 10-3504-1522
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}

export default CarDetails
