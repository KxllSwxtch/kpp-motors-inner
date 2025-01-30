import { motion } from 'framer-motion'

const BuyingProcessSection = () => {
	return (
		<motion.div
			className='py-12 px-4 text-center'
			initial={{ opacity: 0, y: 50 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
			viewport={{ once: true }}
		>
			<h2 className='text-3xl font-bold mb-6'>Как мы работаем?</h2>
			<div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
				{[
					{
						icon: '🔍',
						title: 'Поиск авто',
						text: 'Выбираете подходящий автомобиль.',
					},
					{
						icon: '📄',
						title: 'Проверка',
						text: 'Проводим диагностику и проверяем документы.',
					},
					{
						icon: '💰',
						title: 'Оплата',
						text: 'Вы оплачиваете и мы оформляем сделку.',
					},
					{
						icon: '🚢',
						title: 'Доставка',
						text: 'Доставляем авто в ваш город.',
					},
				].map((step, index) => (
					<motion.div
						key={index}
						className='p-6 bg-white shadow-lg rounded-lg transform transition duration-300 hover:scale-105'
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: index * 0.2 }}
						viewport={{ once: true }}
					>
						<h3 className='text-4xl mb-2'>{step.icon}</h3>
						<h3 className='text-xl font-semibold mb-2'>{step.title}</h3>
						<p>{step.text}</p>
					</motion.div>
				))}
			</div>
		</motion.div>
	)
}

export default BuyingProcessSection
