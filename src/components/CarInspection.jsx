import axios from 'axios'
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

const CarInspection = ({ car }) => {
	const [inspectionData, setInspectionData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [showAllAccidents, setShowAllAccidents] = useState(false)

	useEffect(() => {
		const fetchInspectionData = async () => {
			try {
				if (!car?.vehicleId || !car?.vehicleNo) {
					setError('Нет данных об автомобиле')
					setLoading(false)
					return
				}

				const url = `https://api.encar.com/v1/readside/record/vehicle/${
					car.vehicleId
				}/open?vehicleNo=${encodeURIComponent(car.vehicleNo)}`
				const response = await axios.get(url)

				setInspectionData(response.data)
				setError(null)
			} catch (err) {
				setError('Ошибка при загрузке данных')
				console.error(err)
			} finally {
				setLoading(false)
			}
		}

		fetchInspectionData()
	}, [car])

	if (loading)
		return <p className='text-center text-gray-500'>Загрузка данных...</p>
	if (error || !inspectionData)
		return (
			<p className='text-center text-gray-600 mt-10'>
				Нет данных о страховых выплатах
			</p>
		)

	const {
		year,
		maker,
		carShape,
		displacement,
		firstDate,
		myAccidentCnt,
		otherAccidentCnt,
		myAccidentCost,
		otherAccidentCost,
		ownerChangeCnt,
		accidentCnt,
		accidents = [],
	} = inspectionData

	const AccidentModal = () =>
		createPortal(
			<AnimatePresence>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
					className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'
					onClick={(e) => {
						if (e.target === e.currentTarget) {
							setShowAllAccidents(false)
						}
					}}
				>
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{ duration: 0.3 }}
						className='bg-white max-h-[80vh] overflow-y-auto w-full max-w-2xl p-6 rounded-lg shadow-lg relative'
					>
						<button
							onClick={() => setShowAllAccidents(false)}
							className='absolute top-3 right-3 text-gray-600 hover:text-black text-2xl'
						>
							&times;
						</button>
						<h3 className='text-xl font-bold mb-4'>Все ДТП</h3>
						<div className='space-y-4'>
							{accidents.map((acc, index) => (
								<div
									key={index}
									className='p-4 bg-gray-100 rounded-lg border shadow'
								>
									<div className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-800'>
										<p>
											<strong>Дата ДТП:</strong> {acc.date}
										</p>
										<p>
											<strong>Страховая выплата:</strong> ₩
											{acc.insuranceBenefit.toLocaleString()}
										</p>
										<p>
											<strong>Ремонтные работы:</strong> ₩
											{acc.partCost.toLocaleString()}
										</p>
										<p>
											<strong>Стоимость работ:</strong> ₩
											{acc.laborCost.toLocaleString()}
										</p>
										<p>
											<strong>Покраска:</strong> ₩
											{acc.paintingCost.toLocaleString()}
										</p>
									</div>
								</div>
							))}
						</div>
					</motion.div>
				</motion.div>
			</AnimatePresence>,
			document.body,
		)

	return (
		<div className='p-1 mt-4'>
			<h2 className='text-xl font-semibold mb-4'>Страховая история</h2>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<p className='text-gray-700'>
					<strong>Количество владельцев:</strong> {ownerChangeCnt}
				</p>
				<p className='text-gray-700'>
					<strong>Количество ДТП:</strong> {accidentCnt}
				</p>
				<p className='text-gray-700'>
					<strong>Cтраховые выплаты (по этому авто):</strong> {myAccidentCnt}{' '}
					раз
				</p>
				<p className='text-gray-700'>
					<strong>Страховые выплаты (по другому авто):</strong>{' '}
					{otherAccidentCnt} раз
				</p>
				<p className='text-gray-700'>
					<strong>Общая сумма выплат (по этому авто):</strong> ₩
					{myAccidentCost.toLocaleString()}
				</p>
				<p className='text-gray-700'>
					<strong>Общая сумма выплат (по другому авто):</strong> ₩
					{otherAccidentCost.toLocaleString()}
				</p>
			</div>

			{/* Детализация ДТП */}
			{accidents.length > 0 && (
				<div className='mt-6'>
					<h3 className='text-lg font-semibold mb-4'>Детализация ДТП:</h3>

					<div className='space-y-4'>
						{accidents.slice(0, 3).map((acc, index) => (
							<div
								key={index}
								className='p-4 bg-white border rounded-lg shadow hover:shadow-md transition'
							>
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700'>
									<p>
										<span className='font-black'>
											Дата ДТП{' '}
											<span className='text-xs font-light'>
												(Год.Месяц.День)
											</span>
											:
										</span>{' '}
										{acc.date?.replaceAll('-', '.')}
									</p>
									<p>
										<span className='font-medium'>Страховая выплата:</span> ₩
										{acc.insuranceBenefit.toLocaleString()}
									</p>
									<p>
										<span className='font-medium'>Ремонтные работы:</span> ₩
										{acc.partCost.toLocaleString()}
									</p>
									<p>
										<span className='font-medium'>Стоимость работ:</span> ₩
										{acc.laborCost.toLocaleString()}
									</p>
									<p>
										<span className='font-medium'>Покраска:</span> ₩
										{acc.paintingCost.toLocaleString()}
									</p>
								</div>
							</div>
						))}
					</div>

					{accidents.length > 3 && (
						<div className='mt-4 text-center'>
							<button
								className='px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer'
								onClick={() => setShowAllAccidents(true)}
							>
								Показать все ({accidents.length})
							</button>
						</div>
					)}
				</div>
			)}
			{showAllAccidents && <AccidentModal />}
		</div>
	)
}

CarInspection.propTypes = {
	car: PropTypes.shape({
		vehicleId: PropTypes.string,
		vehicleNo: PropTypes.string,
	}),
}

export default CarInspection
