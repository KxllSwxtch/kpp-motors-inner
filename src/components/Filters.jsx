import PropTypes from 'prop-types'
import { koreanBrands } from '../utils'

const Filters = ({ filters, setFilters }) => {
	const handleInputChange = (e) => {
		const { name, value } = e.target
		setFilters({ [name]: value }) // Передаем только измененное поле
	}

	return (
		<div className='bg-white shadow-md p-6 rounded-lg mb-6'>
			<h3 className='text-xl font-semibold mb-4'>Фильтры</h3>

			{/* Основные фильтры */}
			<div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
				{/* Выбор марки */}
				<select
					name='bm_no'
					value={filters.bm_no}
					onChange={handleInputChange}
					className='border rounded px-3 py-2'
				>
					<option value=''>Выберите марку</option>
					{koreanBrands.map((brand) => (
						<option key={brand.id} value={brand.id}>
							{brand.name}
						</option>
					))}
				</select>

				{/* Поля для модели и поколения (пока без логики) */}
				<input
					type='text'
					name='model'
					placeholder='Модель'
					value={filters.model}
					onChange={handleInputChange}
					className='border rounded px-3 py-2'
				/>
				<input
					type='text'
					name='generation'
					placeholder='Поколение'
					value={filters.generation}
					onChange={handleInputChange}
					className='border rounded px-3 py-2'
				/>
			</div>
		</div>
	)
}

Filters.propTypes = {
	filters: PropTypes.object.isRequired,
	setFilters: PropTypes.func.isRequired,
}

export default Filters
