import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const CarsListItem = ({ car, usdkrwRate }) => {
	const [translatedName, setTranslatedName] = useState(car.name)

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

	return (
		<div className='p-6 bg-white shadow-lg rounded-lg flex flex-col justify-between h-full'>
			<img
				src={car.image}
				alt={car.name}
				className='w-auto h-auto object-fill mb-4 rounded-lg'
			/>
			<h1 className='text-lg font-semibold'>{translatedName}</h1>

			<div className='mt-4'>
				<p className='text-gray-600 text-sm'>Год: {car.regDate}</p>
				<p className='text-gray-600 text-sm'>
					Цена в Корее: ₩{formattedCarPriceKrw} | ${formattedCarPriceUsd}
				</p>
				<p className='text-gray-600 text-sm'>
					Пробег: {formattedCarMileage} км
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
		regDate: PropTypes.string.isRequired,
	}).isRequired,
	usdkrwRate: PropTypes.number.isRequired,
}

export default CarsListItem
