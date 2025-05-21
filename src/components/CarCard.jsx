import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { translateSmartly, translations } from '../translations'

const CarCard = ({ car, usdKrwRate }) => {
	// Конвертация цены
	const carPriceKrw = car?.Price * 10000
	const carPriceUsd = Math.round(carPriceKrw / usdKrwRate).toLocaleString()

	return (
		<div className='rounded-2xl shadow-xl bg-white overflow-hidden border border-gray-200 flex flex-col'>
			<img
				src={`https://ci.encar.com${car.Photo}001.jpg`}
				alt={`${car.Manufacturer} ${car.Model}`}
				className='w-full md:h-50 h-auto object-cover'
			/>

			<div className='p-6 flex flex-col flex-grow justify-between'>
				<div>
					<h2 className='text-lg font-bold text-center text-gray-900 mb-4'>
						{translateSmartly(car.Manufacturer)} {translateSmartly(car.Model)}{' '}
						{translateSmartly(car?.Badge)} {translateSmartly(car?.BadgeDetail)}
					</h2>
					<div className='text-gray-600 text-base space-y-2'>
						<div className='flex justify-between border-b border-dotted pb-1'>
							<span>Год</span>
							<span className='font-medium'>
								{String(car.Year).slice(0, 4)}.{String(car.Year).slice(4)} г.
							</span>
						</div>
						<div className='flex justify-between border-b border-dotted pb-1'>
							<span>Пробег</span>
							<span className='font-medium'>
								{car.Mileage.toLocaleString()} км
							</span>
						</div>
						<div className='flex justify-between border-b border-dotted pb-1'>
							<span>Тип топлива</span>
							<span className='font-medium'>{translations[car.FuelType]}</span>
						</div>
					</div>
				</div>

				<div className='mt-4 pt-4'>
					<p className='text-lg font-bold text-center text-black'>
						₩{carPriceKrw.toLocaleString()}
					</p>
					<hr />
					<p className='text-center text-gray-700 font-semibold text-lg'>
						${carPriceUsd}
					</p>
				</div>

				<Link
					to={`/catalog/${car.Id}`}
					target='_blank'
					rel='noopener noreferrer'
					className='mt-6 bg-black text-white font-semibold text-center py-2 rounded-md hover:bg-gray-900 transition'
				>
					Узнать подробнее
				</Link>
			</div>
		</div>
	)
}

CarCard.propTypes = {
	car: PropTypes.shape({
		Price: PropTypes.number.isRequired,
		FINISH: PropTypes.number,
		Photo: PropTypes.string,
		Manufacturer: PropTypes.string,
		Model: PropTypes.string,
		Year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		Mileage: PropTypes.number,
		FuelType: PropTypes.string,
		Id: PropTypes.string,
		Badge: PropTypes.string,
		BadgeDetail: PropTypes.string,
	}).isRequired,
	usdKrwRate: PropTypes.number.isRequired,
}

export default CarCard
