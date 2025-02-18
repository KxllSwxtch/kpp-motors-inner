import axios from 'axios'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const CarsListItem = ({ car, usdkrwRate, isExport }) => {
	const [translatedName, setTranslatedName] = useState(car.name)
	const [engineVolume, setEngineVolume] = useState(null)
	const [fuelType, setFuelType] = useState(null)
	const [customsFees, setCustomsFees] = useState(null)
	const [loadingFees, setLoadingFees] = useState(false)

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

	const translateFuelType = (fuel) => {
		const fuelMap = {
			가솔린: 'Gasoline',
			디젤: 'Diesel',
			하이브리드: 'Hybrid',
			전기: 'Electric',
		}

		return fuelMap[fuel] || fuel // Если топлива нет в списке, возвращаем оригинал
	}

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
						price: price,
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

		if (isExport && engineVolume) {
			fetchCustomsFees(engineVolume, car?.price, fuelType, car?.ym)
		}
	}, [car?.price, engineVolume, car?.ym, fuelType, isExport])

	// Получаем данные по автомобилю (объём, тип двс)
	useEffect(() => {
		const fetchEngineSpecs = async (carId) => {
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

					// Ищем тип топлива (연료)
					if (labelText.includes('연료')) {
						const p = td.querySelector('p')
						if (p) {
							setFuelType(translateFuelType(p.textContent.trim()))
						}
					}
				})
			} catch (error) {
				console.error('Ошибка получения характеристик двигателя:', error)
			}
			return null
		}

		fetchEngineSpecs(car.id)
	}, [car.id, isExport])

	// Для перевода car.name
	useEffect(() => {
		const translateName = async () => {
			try {
				const response = await fetch(
					`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ko&tl=en&dt=t&q=${encodeURIComponent(
						car?.name,
					)}`,
				)
				const result = await response.json()
				setTranslatedName(result[0][0][0])
			} catch (error) {
				console.error('Ошибка перевода:', error)
			}
		}

		translateName()
	}, [car.name])

	const formattedCarMileage = parseInt(
		car?.mileage.replace(/\D+/gm, ''),
	).toLocaleString()

	// Цена авто
	const formattedCarPriceKrw = parseInt(car?.price).toLocaleString()
	const formattedCarPriceUsd = Math.round(
		parseInt(car?.price) / usdkrwRate,
	).toLocaleString()

	// Расчёт цены на экспорт
	const exportPriceKrw = car?.price * 10000 + 3500000 // Примерная наценка для экспорта
	const exportPriceRub = Math.round(exportPriceKrw / 13) // Конвертация в рубли (примерный курс)
	const exportPriceUsd = Math.round(exportPriceRub / 92) // Конвертация в USD (примерный курс)

	return (
		<div className='p-6 bg-white shadow-lg rounded-lg flex flex-col justify-between h-full'>
			<img
				src={car.image}
				alt={car.name}
				className='w-auto h-auto object-fill mb-4 rounded-lg'
			/>
			<h1 className='text-lg font-semibold'>{translatedName}</h1>

			<div className='mt-4'>
				<p className='text-gray-600 text-sm'>Год: 20{car.ym}</p>
				<p className='text-gray-600 text-sm'>
					Пробег: {formattedCarMileage} км
				</p>
				{engineVolume && (
					<p className='text-gray-600 text-sm'>Объём: {engineVolume} cc</p>
				)}
				<p className='text-gray-600 text-sm'>
					Цена в Корее: ₩{formattedCarPriceKrw} | ${formattedCarPriceUsd}
					{isExport &&
						(loadingFees ? (
							<>
								<br />
								Загрузка расчёта...
							</>
						) : customsFees ? (
							<>
								<br />
								<br />
								Таможенный Сбор: {customsFees?.sbor} ₽
								<br />
								Таможенная Пошлина: {customsFees?.tax} ₽
								<br />
								Утильсбор: {customsFees?.util} ₽
								<br />
								Итог: {customsFees.total} ₽
							</>
						) : (
							<>
								<br />
								Нет данных по таможне
								<a
									href='/#calculator'
									className='mt-3 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition'
								>
									Перейти к калькулятору
								</a>
							</>
						))}
				</p>
			</div>

			<Link
				to={`/cars/${car.id}`}
				className='mt-10 inline-block bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-secondary transition-all duration-300 text-center'
			>
				Подробнее
			</Link>
		</div>
	)
}

CarsListItem.propTypes = {
	car: PropTypes.shape({
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		maker: PropTypes.string.isRequired,
		model: PropTypes.string.isRequired,
		price: PropTypes.string.isRequired,
		year: PropTypes.string.isRequired,
		mileage: PropTypes.string.isRequired,
		gearbox: PropTypes.string.isRequired,
		image: PropTypes.string.isRequired,
		ym: PropTypes.string.isRequired,
	}).isRequired,
	usdkrwRate: PropTypes.number.isRequired,
	isExport: PropTypes.bool.isRequired,
}

export default CarsListItem
