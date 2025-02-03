import PropTypes from 'prop-types'
import { useState } from 'react'
import { FaFilter, FaTimes } from 'react-icons/fa'

// Local imports
import { koreanBrands, foreignBrands } from '../utils'

const Filters = ({
	filters,
	setFilters,
	applyFilters,
	resetFilters,
	carType,
}) => {
	const [isOpen, setIsOpen] = useState(false) // Состояние для мобильных устройств

	const handleInputChange = (e) => {
		const { name, value } = e.target
		setFilters({ [name]: value })
	}

	const toggleFilters = () => setIsOpen(!isOpen) // Переключение состояния

	const currentCarType = carType === 'korean' ? koreanBrands : foreignBrands

	// Генерация значений для "Пробег", "Год", "Цена"
	const generateRange = (start, end, step) =>
		Array.from(
			{ length: Math.floor((end - start) / step) + 1 },
			(_, i) => start + i * step,
		)

	const mileageOptions = generateRange(1000, 300000, 1000)
	const yearOptions = generateRange(2005, 2025, 1)
	const priceOptions = generateRange(1000000, 500000000, 1000000)

	return (
		<>
			{/* Кнопка для открытия фильтров на мобильных устройствах */}
			<button
				className='cursor-pointer md:hidden flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-secondary transition-all'
				onClick={toggleFilters}
			>
				<FaFilter />
				Фильтры
			</button>

			{/* Затемненный фон при открытых фильтрах */}
			{isOpen && (
				<div
					className='fixed inset-0 bg-black bg-opacity-50 z-40'
					onClick={toggleFilters}
				></div>
			)}

			<div
				className={`overflow-scroll fixed md:static top-0 left-0 h-full md:h-auto w-3/3 md:w-full bg-white shadow-lg p-6 md:rounded-lg md:mb-6 transform ${
					isOpen ? 'translate-x-0' : '-translate-x-full'
				} md:translate-x-0 transition-transform duration-300 z-50 md:z-auto`}
			>
				{/* Кнопка закрытия для мобильных */}
				<div className='md:hidden flex justify-end'>
					<button onClick={toggleFilters} className='text-gray-500 text-2xl'>
						<FaTimes />
					</button>
				</div>

				<h3 className='text-xl font-semibold mb-4'>Фильтры</h3>

				{/* Основные фильтры */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{/* Марка */}
					<select
						name='bm_no'
						value={filters.bm_no}
						onChange={handleInputChange}
						className='border rounded px-3 py-2'
					>
						<option value=''>Выберите марку</option>
						{currentCarType.map((brand) => (
							<option key={brand.id} value={brand.id}>
								{brand.name}
							</option>
						))}
					</select>

					{/* Модель */}
					<input
						type='text'
						name='model'
						placeholder='Модель'
						value={filters.model}
						onChange={handleInputChange}
						className='border rounded px-3 py-2'
					/>

					{/* Поколение */}
					<input
						type='text'
						name='generation'
						placeholder='Поколение'
						value={filters.generation}
						onChange={handleInputChange}
						className='border rounded px-3 py-2'
					/>

					{/* Комплектация */}
					<select
						name='trim'
						value={filters.trim}
						onChange={handleInputChange}
						className='border rounded px-3 py-2'
					>
						<option value=''>Выберите комплектацию</option>
						{/* Опции будут добавляться динамически */}
					</select>

					{/* Детальная комплектация */}
					<select
						name='detailed_trim'
						value={filters.detailed_trim}
						onChange={handleInputChange}
						className='border rounded px-3 py-2'
					>
						<option value=''>Выберите детальную комплектацию</option>
						{/* Опции будут добавляться динамически */}
					</select>

					{/* Поиск по номеру авто */}
					<input
						type='text'
						name='c_carNum'
						placeholder='Поиск по номеру авто'
						value={filters.c_carNum}
						onChange={handleInputChange}
						className='border rounded px-3 py-2'
					/>
				</div>

				{/* Детальный поиск */}
				<h3 className='text-xl font-semibold mt-6 mb-4'>Детальный поиск</h3>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{/* Пробег */}
					<div className='flex space-x-2'>
						<select
							name='searchSMileage'
							value={filters.searchSMileage}
							onChange={handleInputChange}
							className='border rounded px-3 py-2 w-full'
						>
							<option value=''>Пробег (от)</option>
							{mileageOptions.map((km) => (
								<option key={km} value={km}>
									{km.toLocaleString()} км
								</option>
							))}
						</select>
						<select
							name='searchEMileage'
							value={filters.searchEMileage}
							onChange={handleInputChange}
							className='border rounded px-3 py-2 w-full'
						>
							<option value=''>Пробег (до)</option>
							{mileageOptions
								.filter((km) => km >= (filters.mileageMin || 0))
								.map((km) => (
									<option key={km} value={km}>
										{km.toLocaleString()} км
									</option>
								))}
						</select>
					</div>

					{/* Год */}
					<div className='flex space-x-2'>
						<select
							name='searchSY'
							value={filters.searchSY}
							onChange={handleInputChange}
							className='border rounded px-3 py-2 w-full'
						>
							<option value=''>Год (от)</option>
							{yearOptions
								.reverse()
								.filter((year) => !filters.searchEY || year <= filters.searchEY) // Ограничение для "Год от"
								.map((year) => (
									<option key={year} value={`${year}.01`}>
										{year}
									</option>
								))}
						</select>
						<select
							name='searchEY'
							value={filters.searchEY}
							onChange={handleInputChange}
							className='border rounded px-3 py-2 w-full'
						>
							<option value=''>Год (до)</option>
							{yearOptions
								.filter(
									(year) =>
										!filters.searchSY || year >= parseInt(filters.searchSY),
								) // Ограничение для "Год до"
								.map((year) => (
									<option key={year} value={`${year}.12`}>
										{year}
									</option>
								))}
						</select>
					</div>

					{/* Цена */}
					<div className='flex space-x-2'>
						<select
							name='searchSPrice'
							value={filters.searchSPrice}
							onChange={handleInputChange}
							className='border rounded px-3 py-2 w-full'
						>
							<option value=''>Цена (от)</option>
							{priceOptions
								.filter(
									(price) =>
										!filters.searchEPrice || price <= filters.searchEPrice,
								) // Ограничиваем макс. значение
								.map((price) => (
									<option key={price} value={price}>
										₩{price.toLocaleString()}
									</option>
								))}
						</select>
						<select
							name='searchEPrice'
							value={filters.searchEPrice}
							onChange={handleInputChange}
							className='border rounded px-3 py-2 w-full'
						>
							<option value=''>Цена (до)</option>
							{priceOptions
								.filter(
									(price) =>
										!filters.searchSPrice || price >= filters.searchSPrice,
								) // Ограничиваем мин. значение
								.map((price) => (
									<option key={price} value={price}>
										₩{price.toLocaleString()}
									</option>
								))}
						</select>
					</div>

					{/* Топливо */}
					<select
						name='fuelType'
						value={filters.fuelType}
						onChange={handleInputChange}
						className='border rounded px-3 py-2'
					>
						<option value=''>Выберите топливо</option>
						<option value='gasoline'>Бензин</option>
						<option value='diesel'>Дизель</option>
						<option value='hybrid'>Гибрид</option>
						<option value='electric'>Электро</option>
					</select>

					{/* Коробка передач */}
					<select
						name='gearbox'
						value={filters.gearbox}
						onChange={handleInputChange}
						className='border rounded px-3 py-2'
					>
						<option value=''>Выберите передачу</option>
						<option value='auto'>Автомат</option>
						<option value='manual'>Механика</option>
					</select>

					{/* Цвет */}
					<input
						type='text'
						name='color'
						placeholder='Цвет'
						value={filters.color}
						onChange={handleInputChange}
						className='border rounded px-3 py-2'
					/>

					{/* Сортировка */}
					<select
						name='sortBy'
						value={filters.sortBy}
						onChange={handleInputChange}
						className='border rounded px-3 py-2'
					>
						<option value=''>Сортировка</option>
						<option value='price_asc'>Цена (по возрастанию)</option>
						<option value='price_desc'>Цена (по убыванию)</option>
						<option value='mileage_asc'>Пробег (по возрастанию)</option>
						<option value='mileage_desc'>Пробег (по убыванию)</option>
						<option value='models_asc'>Старые модели</option>
						<option value='models_desc'>Свежие модели</option>
						<option value='recently_registered'>
							Недавно зарегистрированные
						</option>
					</select>
				</div>

				{/* Кнопки Применить / Сбросить */}
				<div className='mt-4 flex justify-end gap-4'>
					<button
						onClick={resetFilters}
						className='bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-400 transition-all cursor-pointer'
					>
						Сбросить
					</button>
					<button
						onClick={() => {
							applyFilters()
							setIsOpen(false) // Закрываем меню после применения фильтров
						}}
						className='bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-secondary transition-all cursor-pointer'
					>
						Применить фильтры
					</button>
				</div>
			</div>
		</>
	)
}

Filters.propTypes = {
	filters: PropTypes.object.isRequired,
	setFilters: PropTypes.func.isRequired,
	applyFilters: PropTypes.func.isRequired,
	resetFilters: PropTypes.func.isRequired,
	carType: PropTypes.string.isRequired,
}

export default Filters
