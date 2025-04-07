import { useState } from 'react'

const KyrgyzstanCalculator = ({ usdEurRate }) => {
	const [fuelType, setFuelType] = useState('petrol')
	const [year, setYear] = useState(new Date().getFullYear())
	const [engineVolume, setEngineVolume] = useState('')
	const [carPrice, setCarPrice] = useState('')
	const [result, setResult] = useState(null)

	const EURO_RATE = usdEurRate // Примерный курс евро в сомах (обновляется вручную)
	const NDS = 12 // Процент НДС

	// Таблица ставок
	const rates = {
		petrol: [
			{ minY: 0, maxY: 1, percent: 15, rate: 0 },
			{
				minY: 2,
				maxY: 6,
				percent: 20,
				rateTable: [0.36, 0.4, 0.36, 0.44, 0.44, 0.8],
			},
			{
				minY: 7,
				maxY: 100,
				percent: 0,
				rateTable: [1.4, 1.5, 1.6, 2.2, 2.2, 3.2],
			},
		],
		diesel: [
			{ minY: 0, maxY: 1, percent: 15, rate: 0 },
			{ minY: 2, maxY: 6, percent: 20, rateTable: [0.32, 0.32, 0.4, 0.8] },
			{ minY: 7, maxY: 100, percent: 0, rateTable: [1.5, 1.5, 2.2, 3.2] },
		],
		gibrid: [
			{ minY: 0, maxY: 1, percent: 15, rate: 0 },
			{
				minY: 2,
				maxY: 6,
				percent: 20,
				rateTable: [0.36, 0.4, 0.36, 0.44, 0.44, 0.8],
			},
			{
				minY: 7,
				maxY: 100,
				percent: 0,
				rateTable: [1.4, 1.5, 1.6, 2.2, 2.2, 3.2],
			},
		],
		electro: [{ minY: 0, maxY: 100, percent: 0, rate: 0 }],
	}

	const calculateCustoms = () => {
		if (!carPrice || !engineVolume) {
			alert('Введите цену и объем двигателя!')
			return
		}

		const carYear = new Date().getFullYear() - year
		const fuelData = rates[fuelType]

		let duty = 0
		let vat = 0
		let total = 0

		for (let row of fuelData) {
			const minYear = new Date().getFullYear() - row.minY
			const maxYear = new Date().getFullYear() - row.maxY

			if (year >= maxYear && year <= minYear) {
				let volumeRate = row.rate
				let customsByPercent = (carPrice * row.percent) / 100
				let customsByVolume = 0

				if (row.rateTable) {
					const rateIndex =
						engineVolume <= 1000
							? 0
							: engineVolume <= 1500
							? 1
							: engineVolume <= 1800
							? 2
							: engineVolume <= 2300
							? 3
							: engineVolume <= 3000
							? 4
							: 5

					volumeRate = row.rateTable[rateIndex]
					customsByVolume = engineVolume * volumeRate
				}

				duty = Math.max(customsByPercent, customsByVolume)
				vat = ((carPrice + duty) * NDS) / 100
				total = duty + vat
				break
			}
		}

		setResult({
			carPrice,
			duty,
			vat,
			total,
			totalSom: total * EURO_RATE,
		})
	}

	return (
		<div className='container mx-auto mt-6 p-6 bg-white shadow-lg rounded-lg'>
			<h2 className='text-2xl font-bold text-center mb-6'>
				🇰🇬 Калькулятор растаможки Кыргызстана
			</h2>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<div>
					<label className='block text-gray-700 font-semibold mb-2'>
						Тип топлива
					</label>
					<select
						value={fuelType}
						onChange={(e) => setFuelType(e.target.value)}
						className='w-full border p-2 rounded'
					>
						<option value='petrol'>Бензин</option>
						<option value='diesel'>Дизель</option>
						<option value='gibrid'>Гибрид</option>
						<option value='electro'>Электро</option>
					</select>
				</div>

				<div>
					<label className='block text-gray-700 font-semibold mb-2'>
						Год выпуска
					</label>
					<input
						type='number'
						value={year}
						onChange={(e) => setYear(parseInt(e.target.value))}
						className='w-full border p-2 rounded'
						min={2000}
						max={new Date().getFullYear()}
					/>
				</div>

				<div>
					<label className='block text-gray-700 font-semibold mb-2'>
						Объем двигателя (см³)
					</label>
					<input
						type='number'
						value={engineVolume}
						onChange={(e) => setEngineVolume(parseInt(e.target.value))}
						className='w-full border p-2 rounded'
					/>
				</div>

				<div>
					<label className='block text-gray-700 font-semibold mb-2'>
						Стоимость авто ($)
					</label>
					<input
						type='number'
						value={carPrice}
						onChange={(e) => setCarPrice(parseInt(e.target.value))}
						className='w-full border p-2 rounded'
					/>
				</div>
			</div>

			<button
				onClick={calculateCustoms}
				className='cursor-pointer mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300'
			>
				📊 Рассчитать
			</button>

			{result && (
				<div className='mt-6 p-6 bg-gray-100 shadow-md rounded-lg text-center'>
					<h3 className='text-xl font-bold mb-4'>
						📊 Таможенные платежи в Бишкеке
					</h3>
					<p>Таможенная ставка: {Math.round(result.duty).toLocaleString()} €</p>
					<p>НДС (12%): {Math.round(result.vat).toLocaleString()} €</p>
					<p className='font-semibold text-lg mt-2'>
						Сумма к оплате: {Math.round(result.total).toLocaleString()} € | $
						{Math.round(result.totalSom).toLocaleString()}
					</p>
				</div>
			)}
		</div>
	)
}

export default KyrgyzstanCalculator
