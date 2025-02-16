import { motion } from 'framer-motion'

const WhyUsSection = () => {
	return (
		<div className='bg-background py-12 px-4 text-center'>
			<motion.h2
				className='text-3xl font-bold mb-6'
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				Почему Bazarish Auto?
			</motion.h2>
			<div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
				{[
					{
						icon: '🚗',
						title: 'Прямые поставки',
						text: 'Только проверенные авто из Южной Кореи.',
					},
					{
						icon: '✅',
						title: 'Проверенные авто',
						text: 'Технический осмотр перед покупкой.',
					},
					{
						icon: '💰',
						title: 'Прозрачные цены',
						text: 'Никаких скрытых платежей, всё по-честному.',
					},
					{
						icon: '📦',
						title: 'Полное сопровождение',
						text: 'От выбора до доставки автомобиля.',
					},
				].map((item, index) => (
					<motion.div
						key={index}
						className='p-6 bg-white shadow-lg rounded-lg'
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: index * 0.2 }}
						viewport={{ once: true }}
					>
						<h3 className='text-3xl mb-2'>{item.icon}</h3>
						<h3 className='text-xl font-semibold mb-2'>{item.title}</h3>
						<p>{item.text}</p>
					</motion.div>
				))}
			</div>
		</div>
	)
}

export default WhyUsSection
