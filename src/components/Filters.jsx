import PropTypes from 'prop-types'
import { useState } from 'react'
import { FaFilter, FaTimes } from 'react-icons/fa'
import Select from 'react-select'

// Local imports
import { koreanBrands, koreanModels, foreignBrands } from '../utils'

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

	// Список цветов
	const colorOptions = [
		{ value: '1', label: 'Белый' },
		{ value: '2', label: 'Серебристый' },
		{ value: '3', label: 'Серый' },
		{ value: '4', label: 'Черный' },
		{ value: '5', label: 'Красный' },
		{ value: '6', label: 'Оранжевый' },
		{ value: '7', label: 'Желтый' },
		{ value: '8', label: 'Зеленый' },
		{ value: '9', label: 'Голубой' },
		{ value: '10', label: 'Синий' },
		{ value: '11', label: 'Фиолетовый' },
		{ value: '12', label: 'Коричневый' },
		{ value: '13', label: 'Бежевый' },
		{ value: '14', label: 'Розовый' },
		{ value: '15', label: 'Бордовый' },
		{ value: '16', label: 'Золотой' },
		{ value: '17', label: 'Темно-зеленый' },
		{ value: '18', label: 'Темно-синий' },
		{ value: '19', label: 'Бирюзовый' },
		{ value: '20', label: 'Хаки' },
		{ value: '21', label: 'Медный' },
		{ value: '22', label: 'Светло-зеленый' },
		{ value: '23', label: 'Темно-фиолетовый' },
		{ value: '24', label: 'Светло-голубой' },
		{ value: '25', label: 'Оливковый' },
		{ value: '26', label: 'Лавандовый' },
		{ value: '27', label: 'Лаймовый' },
		{ value: '28', label: 'Светло-розовый' },
		{ value: '29', label: 'Графитовый' },
		{ value: '30', label: 'Песочный' },
		{ value: '31', label: 'Перламутровый' },
		{ value: '32', label: 'Светло-коричневый' },
		{ value: '33', label: 'Мятный' },
		{ value: '34', label: 'Шампань' },
		{ value: '35', label: 'Коралловый' },
		{ value: '36', label: 'Темно-красный' },
		{ value: '37', label: 'Темно-серый' },
		{ value: '38', label: 'Темно-бежевый' },
		{ value: '39', label: 'Светло-серый' },
		{ value: '40', label: 'Темно-бордовый' },
		{ value: '41', label: 'Темно-оранжевый' },
		{ value: '42', label: 'Серебристо-серый' },
		{ value: '43', label: 'Светло-фиолетовый' },
		{ value: '44', label: 'Серебристо-голубой' },
		{ value: '45', label: 'Светло-желтый' },
		{ value: '46', label: 'Светло-бежевый' },
		{ value: '47', label: 'Светло-красный' },
		{ value: '48', label: 'Темно-золотой' },
		{ value: '49', label: 'Бронзовый' },
		{ value: '50', label: 'Глянцевый черный' },
	]

	const handleColorChange = (selectedOptions) => {
		const selectedColors = selectedOptions.map((option) => option.value)
		setFilters({ colors: selectedColors.join(',') })
	}

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
				className={`overflow-scroll lg:overflow-visible fixed md:static top-0 left-0 h-full md:h-auto w-3/3 md:w-full bg-white shadow-lg p-6 md:rounded-lg md:mb-6 transform ${
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
					<select
						name='bo_no'
						value={filters.bo_no}
						onChange={handleInputChange}
						className='border rounded px-3 py-2'
						disabled={!filters.bm_no} // Отключаем, если марка не выбрана
					>
						<option value=''>Выберите модель</option>
						{koreanModels
							.find((brand) => brand.bm_no === parseInt(filters.bm_no))
							?.models.sort((a, b) => (a.years > b.years ? -1 : 1))
							.map((model) => (
								<option key={model.bo_no} value={model.bo_no}>
									{model.name} ({model.years})
								</option>
							))}
					</select>

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
						name='fuel'
						value={filters.fuel}
						onChange={handleInputChange}
						className='border rounded px-3 py-2'
					>
						<option value=''>Выберите топливо</option>
						<option value='%ED%9C%98%EB%B0%9C%EC%9C%A0'>Бензин</option>{' '}
						{/* 휘발유 */}
						<option value='%EA%B2%BD%EC%9C%A0'>Дизель</option> {/* 경유 */}
						<option value='LPG'>Газ (LPG)</option>
						<option value='%EA%B2%B8%EC%9A%A9'>Гибрид</option> {/* 겸용 */}
						<option value='%EC%A0%84%EA%B8%B0'>Электро</option> {/* 전기 */}
						<option value='CNG'>Cжатый природный газ (CNG)</option>
						<option value='%ED%95%98%EC%9D%B4%EB%B8%8C%EB%A6%AC%EB%93%9C'>
							Гибрид
						</option>{' '}
						{/* 하이브리드 */}
					</select>

					{/* Коробка передач */}
					<select
						name='gearbox'
						value={filters.gearbox}
						onChange={handleInputChange}
						className='border rounded px-3 py-2'
					>
						<option value=''>Выберите передачу</option>
						<option value='%BF%C0%C5%E4'>Автомат</option>
						<option value='%EC%88%98%EB%8F%99'>Механика</option>
						<option value='%EC%84%B8%EB%AF%B8%EC%98%A4%ED%86%A0'>
							Семи-автомат
						</option>
						<option value='CVT'>Вариатор</option>
					</select>

					{/* Цвет (Multiselect) */}
					<Select
						name='colors'
						isMulti
						options={colorOptions}
						value={colorOptions.filter((option) =>
							filters.colors?.split(',').includes(option.value),
						)}
						onChange={handleColorChange}
						className='rounded px-3 py-1 w-full'
						placeholder='Выберите до 4 цветов'
						isOptionDisabled={() => filters.colors?.split(',').length >= 4}
					/>

					{/* Сортировка */}
					<select
						name='ordKey'
						value={filters.ordKey}
						onChange={handleInputChange}
						className='border rounded px-3 py-2'
					>
						<option value=''>Сортировка</option>
						<option value='c_editDate'>По дате модификации</option>
						<option value='c_inNumber'>По номеру автомобиля</option>
						<option value='c_dPrice'>Цена (по возрастанию)</option>
						<option value='c_dPriceUp'>Цена (по убыванию)</option>
						<option value='c_year'>Год выпуска (по возрастанию)</option>
						<option value='c_yearUp'>Год выпуска (по убыванию)</option>
						<option value='c_mileage'>Пробег (по возрастанию)</option>
						<option value='c_mileageUp'>Пробег (по убыванию)</option>
						<option value='c_carNum'>По номеру транспортного средства</option>
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
