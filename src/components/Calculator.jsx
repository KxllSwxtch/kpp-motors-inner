import axios from 'axios'
import { useEffect, useState } from 'react'

const Calculator = ({
	carPrice: initialCarPrice,
	engineVolume: initialEngineVolume,
	carYear: initialCarYear,
	carMonth: initialCarMonth,
	engineType: initialEngineType,
}) => {
	const [carPrice, setCarPrice] = useState(
		initialCarPrice ? initialCarPrice.toString() : '',
	)
	const [formattedCarPrice, setFormattedCarPrice] = useState(
		initialCarPrice
			? new Intl.NumberFormat('en-US').format(initialCarPrice)
			: '',
	)
	const [engineVolume, setEngineVolume] = useState(
		initialEngineVolume ? initialEngineVolume.toString() : '',
	)
	const [carYear, setCarYear] = useState(
		initialCarYear ? initialCarYear.toString() : '',
	)
	const [carMonth, setCarMonth] = useState(
		initialCarMonth ? initialCarMonth.toString() : '1',
	)
	const [engineType, setEngineType] = useState(
		initialEngineType ? initialEngineType.toString() : '1',
	)
	const [result, setResult] = useState(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [errors, setErrors] = useState({})
	const [isFormValid, setIsFormValid] = useState(false)
	const [currencyRates, setCurrencyRates] = useState({
		usdRub: null,
		krwRub: null,
	})

	const months = [
		'Январь',
		'Февраль',
		'Март',
		'Апрель',
		'Май',
		'Июнь',
		'Июль',
		'Август',
		'Сентябрь',
		'Октябрь',
		'Ноябрь',
		'Декабрь',
	]

	// Fetch currency rates on component mount
	useEffect(() => {
		fetchCurrencyRates()
	}, [])

	// Проверка валидности формы
	useEffect(() => {
		const isValid =
			carPrice &&
			engineVolume &&
			carYear &&
			carMonth &&
			engineType &&
			!Object.values(errors).some((error) => error) &&
			!loading &&
			currencyRates.usdRub &&
			currencyRates.krwRub
		setIsFormValid(isValid)
	}, [
		carPrice,
		engineVolume,
		carYear,
		carMonth,
		engineType,
		errors,
		loading,
		currencyRates,
	])

	// Автоматический запуск расчета при наличии всех данных из пропсов
	useEffect(() => {
		if (
			initialCarPrice &&
			initialEngineVolume &&
			initialCarYear &&
			initialCarMonth &&
			initialEngineType &&
			currencyRates.usdRub &&
			currencyRates.krwRub &&
			!result &&
			!loading
		) {
			handleCalculate()
		}
	}, [currencyRates.usdRub, currencyRates.krwRub])

	const fetchCurrencyRates = async () => {
		try {
			// Fetch Central Bank rates to get proper RUB rates with dealer commission
			const cbResponse = await axios.get(
				'https://www.cbr-xml-daily.ru/daily_json.js',
			)

			const DEALER_COMMISSION = 0.02 // 2% commission as in the bot

			const usdRub =
				cbResponse.data.Valute.USD.Value +
				cbResponse.data.Valute.USD.Value * DEALER_COMMISSION
			const krwRub =
				(cbResponse.data.Valute.KRW.Value +
					cbResponse.data.Valute.KRW.Value * DEALER_COMMISSION) /
				cbResponse.data.Valute.KRW.Nominal

			setCurrencyRates({
				usdRub,
				krwRub,
				krwUsd: 1000 / 0.7, // примерное соотношение KRW к USD как в боте
			})

			console.log('Currency rates loaded:', { usdRub, krwRub })
		} catch (err) {
			console.error('Error fetching currency rates:', err)
			setError('Ошибка при загрузке курсов валют')
		}
	}

	const handleCalculate = async () => {
		setLoading(true)
		setError('')

		try {
			// Жестко заданные константы из телеграм-бота
			const AGENT_FEE_USD = 598
			const AGENT_FEE_KRW = 853898
			const AGENT_FEE_RUB = 50000

			const DEPOSIT_USD = 700
			const DEPOSIT_KRW = 1000000
			const DEPOSIT_RUB = 58554

			const DEALER_FEE_KRW = 440000
			const PAPERWORK_FEE_KRW = 100000
			const TRANSPORT_TO_PORT_KRW = 350000
			const FREIGHT_USD = 600
			const BROKER_FEE_USD = 346
			const STORAGE_FEE_RUB = 50000
			const LAB_FEE_RUB = 30000
			const REGISTRATION_FEE_RUB = 8000

			// Устанавливаем курсы валют как в телеграм-боте
			const usdRub = 83.55 // Курс доллара к рублю с учетом комиссии дилера
			const krwRub = 0.05855 // Курс воны к рублю (1000 вон = 58.55 руб)

			// First, fetch base customs duty data from the external calculator
			const customsResponse = await axios.post(
				'https://corsproxy.io/?key=28174bc7&url=https://calcus.ru/calculate/Customs',
				new URLSearchParams({
					owner: 1,
					age: calculateAge(carYear, carMonth),
					engine: engineType,
					power: 1,
					power_unit: 1,
					value: engineVolume,
					price: carPrice,
					curr: 'KRW',
				}).toString(),
				{
					withCredentials: false,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				},
			)

			if (customsResponse.status !== 200)
				throw new Error('Ошибка при расчёте таможенных платежей')

			const customsData = customsResponse.data

			// Парсим значения из ответа сервиса calcus.ru
			const customsDutyStr = customsData.tax
				.replace(/\s/g, '')
				.replace(',', '.')
			const customsFeeStr = customsData.sbor
				.replace(/\s/g, '')
				.replace(',', '.')
			const recyclingFeeStr = customsData.util
				.replace(/\s/g, '')
				.replace(',', '.')

			const customsDuty = Math.round(parseFloat(customsDutyStr))
			const customsFee = Math.round(parseFloat(customsFeeStr))
			const recyclingFee = Math.round(parseFloat(recyclingFeeStr))

			// Convert car price to different currencies
			const carPriceKRW = parseInt(carPrice)
			const carPriceUSD = Math.round(carPriceKRW / (1000 / 0.7))
			const carPriceRUB = Math.round(carPriceKRW * krwRub)

			// KOREA FIRST PAYMENT
			const agentFee = {
				usd: AGENT_FEE_USD,
				krw: AGENT_FEE_KRW,
				rub: AGENT_FEE_RUB,
			}

			const deposit = {
				usd: DEPOSIT_USD,
				krw: DEPOSIT_KRW,
				rub: DEPOSIT_RUB,
			}

			// KOREA SECOND PAYMENT
			const dealerFee = {
				usd: Math.round((DEALER_FEE_KRW * krwRub) / usdRub),
				krw: DEALER_FEE_KRW,
				rub: Math.round(DEALER_FEE_KRW * krwRub),
			}

			const paperworkFee = {
				usd: Math.round((PAPERWORK_FEE_KRW * krwRub) / usdRub),
				krw: PAPERWORK_FEE_KRW,
				rub: Math.round(PAPERWORK_FEE_KRW * krwRub),
			}

			const transportToPortFee = {
				usd: Math.round((TRANSPORT_TO_PORT_KRW * krwRub) / usdRub),
				krw: TRANSPORT_TO_PORT_KRW,
				rub: Math.round(TRANSPORT_TO_PORT_KRW * krwRub),
			}

			const shipToVladivostokFee = {
				usd: FREIGHT_USD,
				krw: Math.round((FREIGHT_USD * usdRub) / krwRub),
				rub: Math.round(FREIGHT_USD * usdRub),
			}

			// Calculate total Korean expenses
			const koreaExpensesTotal = {
				usd:
					agentFee.usd +
					dealerFee.usd +
					paperworkFee.usd +
					transportToPortFee.usd +
					shipToVladivostokFee.usd,
				krw:
					agentFee.krw +
					dealerFee.krw +
					paperworkFee.krw +
					transportToPortFee.krw +
					shipToVladivostokFee.krw,
				rub:
					agentFee.rub +
					dealerFee.rub +
					paperworkFee.rub +
					transportToPortFee.rub +
					shipToVladivostokFee.rub,
			}

			const koreaTotal = {
				usd: carPriceUSD + koreaExpensesTotal.usd,
				krw: carPriceKRW + koreaExpensesTotal.krw,
				rub: carPriceRUB + koreaExpensesTotal.rub,
			}

			// RUSSIA EXPENSES
			const customsDutyObj = {
				usd: Math.round(customsDuty / usdRub),
				krw: Math.round(customsDuty / krwRub),
				rub: customsDuty,
			}

			const customsPaperwork = {
				usd: 140,
				krw: Math.round((140 * usdRub) / krwRub),
				rub: Math.round(140 * usdRub),
			}

			const utilizationFee = {
				usd: 62,
				krw: Math.round((62 * usdRub) / krwRub),
				rub: recyclingFee,
			}

			const brokerFee = {
				usd: BROKER_FEE_USD,
				krw: Math.round((BROKER_FEE_USD * usdRub) / krwRub),
				rub: Math.round(BROKER_FEE_USD * usdRub),
			}

			const storageFee = {
				usd: Math.round(STORAGE_FEE_RUB / usdRub),
				krw: Math.round(STORAGE_FEE_RUB / krwRub),
				rub: STORAGE_FEE_RUB,
			}

			const labFee = {
				usd: Math.round(LAB_FEE_RUB / usdRub),
				krw: Math.round(LAB_FEE_RUB / krwRub),
				rub: LAB_FEE_RUB,
			}

			const tempRegistrationFee = {
				usd: Math.round(REGISTRATION_FEE_RUB / usdRub),
				krw: Math.round(REGISTRATION_FEE_RUB / krwRub),
				rub: REGISTRATION_FEE_RUB,
			}

			// Используем ТОЧНО ТАКУЮ ЖЕ формулу, как в телеграм-боте
			// Расчет итоговой стоимости автомобиля в рублях
			const total_cost =
				AGENT_FEE_RUB +
				carPriceKRW * krwRub +
				DEALER_FEE_KRW * krwRub +
				PAPERWORK_FEE_KRW * krwRub +
				TRANSPORT_TO_PORT_KRW * krwRub +
				FREIGHT_USD * usdRub +
				customsDuty +
				customsFee +
				recyclingFee +
				BROKER_FEE_USD * usdRub +
				STORAGE_FEE_RUB +
				LAB_FEE_RUB +
				REGISTRATION_FEE_RUB

			const total_cost_krw =
				AGENT_FEE_RUB / krwRub +
				carPriceKRW +
				DEALER_FEE_KRW +
				PAPERWORK_FEE_KRW +
				TRANSPORT_TO_PORT_KRW +
				(FREIGHT_USD * usdRub) / krwRub +
				customsDuty / krwRub +
				customsFee / krwRub +
				recyclingFee / krwRub +
				(BROKER_FEE_USD * usdRub) / krwRub +
				STORAGE_FEE_RUB / krwRub +
				LAB_FEE_RUB / krwRub +
				REGISTRATION_FEE_RUB / krwRub

			const total_cost_usd = total_cost / usdRub

			// Calculate total Russian expenses
			const russiaExpensesTotal = {
				usd:
					customsDutyObj.usd +
					customsPaperwork.usd +
					utilizationFee.usd +
					brokerFee.usd +
					storageFee.usd +
					labFee.usd +
					tempRegistrationFee.usd,
				krw:
					customsDutyObj.krw +
					customsPaperwork.krw +
					utilizationFee.krw +
					brokerFee.krw +
					storageFee.krw +
					labFee.krw +
					tempRegistrationFee.krw,
				rub:
					customsDutyObj.rub +
					customsPaperwork.rub +
					utilizationFee.rub +
					brokerFee.rub +
					storageFee.rub +
					labFee.rub +
					tempRegistrationFee.rub,
			}

			// Итоговая стоимость из формулы телеграм-бота
			const grandTotal = {
				usd: Math.round(total_cost_usd),
				krw: Math.round(total_cost_krw),
				rub: Math.round(total_cost),
			}

			// Prepare complete results
			const completeResults = {
				// KOREA FIRST PAYMENT
				agentFee,
				deposit,

				// KOREA SECOND PAYMENT
				dealerFee,
				paperworkFee,
				transportToPortFee,
				shipToVladivostokFee,

				// KOREA TOTAL
				koreaExpensesTotal,
				carPrice: {
					usd: carPriceUSD,
					krw: carPriceKRW,
					rub: carPriceRUB,
				},
				koreaTotal,

				// RUSSIA EXPENSES
				customsDuty: customsDutyObj,
				customsPaperwork,
				utilizationFee,
				brokerFee,
				storageFee,
				labFee,
				tempRegistrationFee,
				russiaExpensesTotal,

				// GRAND TOTAL
				grandTotal,

				// Exchange rates
				rates: {
					usdRub,
					krwRub,
					krwUsd: 1000 / 0.7, // Примерное соотношение
				},
			}

			setResult(completeResults)
		} catch (err) {
			console.error('Calculation error:', err)
			setError(err.message || 'Ошибка при расчёте')
		} finally {
			setLoading(false)
		}
	}

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

	const handleCarPriceChange = (e) => {
		let rawValue = e.target.value.replace(/[^0-9]/g, '') // Убираем всё, кроме цифр
		let formattedValue = new Intl.NumberFormat('en-US').format(rawValue) // Форматируем число с запятыми
		setCarPrice(rawValue) // Сохраняем чистое число
		setFormattedCarPrice(formattedValue) // Отображаем отформатированное

		if (rawValue < 0) {
			setErrors((prev) => ({
				...prev,
				carPrice: 'Цена не может быть отрицательной',
			}))
		} else if (rawValue > 1000000000) {
			setErrors((prev) => ({
				...prev,
				carPrice: 'Слишком высокая цена, проверьте ввод',
			}))
		} else {
			setErrors((prev) => ({ ...prev, carPrice: '' }))
		}
	}

	const handleEngineVolumeChange = (e) => {
		let value = e.target.value
		setEngineVolume(value)

		if (value < 100) {
			setErrors((prev) => ({ ...prev, engineVolume: 'Объём слишком мал' }))
		} else if (value > 20000) {
			setErrors((prev) => ({ ...prev, engineVolume: 'Объём слишком большой' }))
		} else {
			setErrors((prev) => ({ ...prev, engineVolume: '' }))
		}
	}

	const handleCarYearChange = (e) => {
		let value = e.target.value
		const currentYear = new Date().getFullYear()
		setCarYear(value)

		if (value < 1900) {
			setErrors((prev) => ({ ...prev, carYear: 'Слишком старый год выпуска' }))
		} else if (value > currentYear) {
			setErrors((prev) => ({
				...prev,
				carYear: 'Год выпуска не может быть больше текущего',
			}))
		} else {
			setErrors((prev) => ({ ...prev, carYear: '' }))
		}
	}

	const handleCarMonthChange = (e) => {
		let value = e.target.value
		setCarMonth(value)

		if (!value) {
			setErrors((prev) => ({ ...prev, carMonth: 'Выберите месяц' }))
		} else {
			setErrors((prev) => ({ ...prev, carMonth: '' }))
		}
	}

	const handleEngineTypeChange = (e) => {
		setEngineType(e.target.value)
	}

	// Helper function to format currency values
	const formatCurrency = (value, currency) => {
		if (value === null || value === undefined) return '—'

		switch (currency) {
			case 'usd':
				return `$${Math.round(value).toLocaleString()}`
			case 'krw':
				return `₩${Math.round(value).toLocaleString()}`
			case 'rub':
				return `${Math.round(value).toLocaleString()} ₽`
			default:
				return Math.round(value).toLocaleString()
		}
	}

	return (
		<div className='bg-white rounded-xl shadow-lg p-6'>
			<h2 className='text-xl font-bold mb-4'>
				Калькулятор таможенных платежей во Владивостоке
			</h2>

			{!initialCarPrice && (
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Цена (KRW)
						</label>
						<input
							type='text'
							placeholder='Введите цену'
							className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
							value={formattedCarPrice}
							required
							onChange={handleCarPriceChange}
						/>
						{errors.carPrice && (
							<p className='text-red-500 text-sm mt-1'>{errors.carPrice}</p>
						)}
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Объем двигателя (см³)
						</label>
						<input
							type='number'
							placeholder='Введите объем'
							className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
							value={engineVolume}
							required
							onChange={handleEngineVolumeChange}
						/>
						{errors.engineVolume && (
							<p className='text-red-500 text-sm mt-1'>{errors.engineVolume}</p>
						)}
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Год выпуска
						</label>
						<input
							type='number'
							placeholder='Введите год'
							className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
							value={carYear}
							required
							onChange={handleCarYearChange}
						/>
						{errors.carYear && (
							<p className='text-red-500 text-sm mt-1'>{errors.carYear}</p>
						)}
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Месяц выпуска
						</label>
						<select
							required
							className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
							value={carMonth}
							onChange={handleCarMonthChange}
						>
							{months.map((month, index) => (
								<option key={index + 1} value={index + 1}>
									{month}
								</option>
							))}
						</select>
						{errors.carMonth && (
							<p className='text-red-500 text-sm mt-1'>{errors.carMonth}</p>
						)}
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Тип двигателя
						</label>
						<select
							className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
							value={engineType}
							onChange={handleEngineTypeChange}
						>
							<option value='1'>Бензин</option>
							<option value='2'>Дизель</option>
							<option value='3'>Гибрид</option>
							<option value='4'>Электро</option>
						</select>
					</div>
				</div>
			)}

			{!initialCarPrice && (
				<button
					className={`bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 w-full transition-all duration-300 ${
						isFormValid
							? 'hover:bg-blue-700 cursor-pointer'
							: 'opacity-50 cursor-not-allowed'
					}`}
					onClick={handleCalculate}
					disabled={!isFormValid}
				>
					{loading ? 'Считаем...' : 'Рассчитать'}
				</button>
			)}

			{error && <p className='text-red-500 mt-2'>{error}</p>}

			{loading && !result && (
				<div className='flex justify-center items-center py-10'>
					<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
					<p className='ml-4 text-lg font-medium'>Выполняем расчет...</p>
				</div>
			)}

			{result && (
				<div className='mt-4 p-6 border rounded-lg bg-gray-50 shadow-sm'>
					<h3 className='text-xl font-bold mb-4'>Расчёт стоимости под ключ</h3>

					<div className='space-y-6'>
						<div>
							<h4 className='text-lg font-semibold text-blue-800 border-b pb-1 mb-3'>
								ПЕРВАЯ ЧАСТЬ ОПЛАТЫ:
							</h4>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
								<p>
									<span className='font-semibold'>
										Агентские услуги по договору:
									</span>
									<br />
									{formatCurrency(result?.agentFee?.usd, 'usd')} |{' '}
									{formatCurrency(result?.agentFee?.krw, 'krw')} |{' '}
									{formatCurrency(result?.agentFee?.rub, 'rub')}
								</p>
								<p>
									<span className='font-semibold'>Задаток (бронь авто):</span>
									<br />
									{formatCurrency(result?.deposit?.usd, 'usd')} |{' '}
									{formatCurrency(result?.deposit?.krw, 'krw')} |{' '}
									{formatCurrency(result?.deposit?.rub, 'rub')}
								</p>
							</div>
						</div>

						<div>
							<h4 className='text-lg font-semibold text-blue-800 border-b pb-1 mb-3'>
								ВТОРАЯ ЧАСТЬ ОПЛАТЫ:
							</h4>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
								<p>
									<span className='font-semibold'>Диллерский сбор:</span>
									<br />
									{formatCurrency(result?.dealerFee?.usd, 'usd')} |{' '}
									{formatCurrency(result?.dealerFee?.krw, 'krw')} |{' '}
									{formatCurrency(result?.dealerFee?.rub, 'rub')}
								</p>
								<p>
									<span className='font-semibold'>
										Доставка, снятие с учёта, оформление:
									</span>
									<br />
									{formatCurrency(result?.paperworkFee?.usd, 'usd')} |{' '}
									{formatCurrency(result?.paperworkFee?.krw, 'krw')} |{' '}
									{formatCurrency(result?.paperworkFee?.rub, 'rub')}
								</p>
								<p>
									<span className='font-semibold'>
										Транспортировка авто в порт:
									</span>
									<br />
									{formatCurrency(
										result?.transportToPortFee?.usd,
										'usd',
									)} | {formatCurrency(result?.transportToPortFee?.krw, 'krw')}{' '}
									| {formatCurrency(result?.transportToPortFee?.rub, 'rub')}
								</p>
								<p>
									<span className='font-semibold'>
										Фрахт (Паром до Владивостока):
									</span>
									<br />
									{formatCurrency(
										result?.shipToVladivostokFee?.usd,
										'usd',
									)} |{' '}
									{formatCurrency(result?.shipToVladivostokFee?.krw, 'krw')} |{' '}
									{formatCurrency(result?.shipToVladivostokFee?.rub, 'rub')}
								</p>
							</div>
						</div>

						<div>
							<h4 className='text-lg font-semibold text-blue-800 border-b pb-1 mb-3'>
								ИТОГО ПО КОРЕЕ:
							</h4>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
								<p>
									<span className='font-semibold'>
										Итого расходов по Корее:
									</span>
									<br />
									{formatCurrency(
										result?.koreaExpensesTotal?.usd,
										'usd',
									)} | {formatCurrency(result?.koreaExpensesTotal?.krw, 'krw')}{' '}
									| {formatCurrency(result?.koreaExpensesTotal?.rub, 'rub')}
								</p>
								<p>
									<span className='font-semibold'>Стоимость автомобиля:</span>
									<br />
									{formatCurrency(result?.carPrice?.usd, 'usd')} |{' '}
									{formatCurrency(result?.carPrice?.krw, 'krw')} |{' '}
									{formatCurrency(result?.carPrice?.rub, 'rub')}
								</p>
								<p className='font-bold text-lg'>
									<span className='font-semibold'>Итого:</span>
									<br />
									{formatCurrency(result?.koreaTotal?.usd, 'usd')} |{' '}
									{formatCurrency(result?.koreaTotal?.krw, 'krw')} |{' '}
									{formatCurrency(result?.koreaTotal?.rub, 'rub')}
								</p>
							</div>
						</div>

						<div>
							<h4 className='text-lg font-semibold text-blue-800 border-b pb-1 mb-3'>
								РАСХОДЫ РОССИЯ:
							</h4>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
								<p>
									<span className='font-semibold'>
										Единая таможенная ставка:
									</span>
									<br />
									{formatCurrency(result?.customsDuty?.usd, 'usd')} |{' '}
									{formatCurrency(result?.customsDuty?.krw, 'krw')} |{' '}
									{formatCurrency(result?.customsDuty?.rub, 'rub')}
								</p>
								<p>
									<span className='font-semibold'>Таможенное оформление:</span>
									<br />
									{formatCurrency(result?.customsPaperwork?.usd, 'usd')} |{' '}
									{formatCurrency(result?.customsPaperwork?.krw, 'krw')} |{' '}
									{formatCurrency(result?.customsPaperwork?.rub, 'rub')}
								</p>
								<p>
									<span className='font-semibold'>Утилизационный сбор:</span>
									<br />
									{formatCurrency(result?.utilizationFee?.usd, 'usd')} |{' '}
									{formatCurrency(result?.utilizationFee?.krw, 'krw')} |{' '}
									{formatCurrency(result?.utilizationFee?.rub, 'rub')}
								</p>
								<p>
									<span className='font-semibold'>Брокер-Владивосток:</span>
									<br />
									{formatCurrency(result?.brokerFee?.usd, 'usd')} |{' '}
									{formatCurrency(result?.brokerFee?.krw, 'krw')} |{' '}
									{formatCurrency(result?.brokerFee?.rub, 'rub')}
								</p>
								<p>
									<span className='font-semibold'>СВХ-Владивосток:</span>
									<br />
									{formatCurrency(result?.storageFee?.usd, 'usd')} |{' '}
									{formatCurrency(result?.storageFee?.krw, 'krw')} |{' '}
									{formatCurrency(result?.storageFee?.rub, 'rub')}
								</p>
								<p>
									<span className='font-semibold'>
										Лаборатория, СБКТС, ЭПТС:
									</span>
									<br />
									{formatCurrency(result?.labFee?.usd, 'usd')} |{' '}
									{formatCurrency(result?.labFee?.krw, 'krw')} |{' '}
									{formatCurrency(result?.labFee?.rub, 'rub')}
								</p>
								<p>
									<span className='font-semibold'>
										Временная регистрация-Владивосток:
									</span>
									<br />
									{formatCurrency(
										result?.tempRegistrationFee?.usd,
										'usd',
									)} | {formatCurrency(result?.tempRegistrationFee?.krw, 'krw')}{' '}
									| {formatCurrency(result?.tempRegistrationFee?.rub, 'rub')}
								</p>
							</div>

							<p className='mt-4 font-semibold'>
								<span className='font-semibold'>Итого расходов по России:</span>
								<br />
								{formatCurrency(result?.russiaExpensesTotal?.usd, 'usd')} |{' '}
								{formatCurrency(result?.russiaExpensesTotal?.krw, 'krw')} |{' '}
								{formatCurrency(result?.russiaExpensesTotal?.rub, 'rub')}
							</p>
						</div>

						<div className='mt-6 pt-4 border-t border-gray-300'>
							<p className='text-xl font-bold text-blue-900'>
								Итого под ключ во Владивостоке:
								<br />
								{formatCurrency(result?.grandTotal?.usd, 'usd')} |{' '}
								{formatCurrency(result?.grandTotal?.krw, 'krw')} |{' '}
								{formatCurrency(result?.grandTotal?.rub, 'rub')}
							</p>

							<div className='mt-4 text-sm text-gray-500'>
								<p>
									Текущий курс: 1 USD = {result?.rates?.usdRub?.toFixed(2)} ₽ |
									1000 KRW = {(result?.rates?.krwRub * 1000)?.toFixed(2)} ₽
								</p>
								<p>
									Расчёт приблизительный и может отличаться от фактических
									затрат.
								</p>
							</div>
						</div>
					</div>

					{!initialCarPrice && (
						<button
							onClick={() => setResult(null)}
							className='bg-red-500 p-2 rounded-lg w-full mt-5 text-white hover:bg-red-600 cursor-pointer transition-colors duration-300'
						>
							Закрыть
						</button>
					)}
				</div>
			)}
		</div>
	)
}

export default Calculator
