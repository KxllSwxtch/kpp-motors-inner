import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const CarsListItem = ({ car }) => {
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

	const formattedCarPrice = parseInt(car?.price).toLocaleString()
	const formattedCarMileage = parseInt(
		car?.mileage.replace(/\D+/gm, ''),
	).toLocaleString()

	return (
		<div className='p-6 bg-white shadow-lg rounded-lg flex flex-col justify-between h-full'>
			<img
				src={car.image}
				alt={car.name}
				className='w-auto h-auto object-fill mb-4 rounded-lg'
			/>
			<h3 className='text-xl font-semibold'>{translatedName}</h3>
			<p className='text-gray-600'>Год: {car.year}</p>
			<p className='text-gray-600'>Цена в Корее: {formattedCarPrice} ₩</p>
			<p className='text-gray-600'>Пробег: {formattedCarMileage} км</p>

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
	}).isRequired,
}

export default CarsListItem
