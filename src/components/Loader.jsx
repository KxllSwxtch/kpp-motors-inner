import { motion } from 'framer-motion'

const Loader = () => {
	return (
		<div className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 z-50'>
			<motion.div
				className='relative flex justify-center items-center'
				initial={{ scale: 0, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0, opacity: 0 }}
				transition={{ duration: 0.8, ease: 'easeInOut' }}
			>
				{/* Внешний кольцевой эффект */}
				<motion.div
					className='absolute w-32 h-32 border-4 border-t-transparent border-white rounded-full'
					animate={{ rotate: 360 }}
					transition={{
						repeat: Infinity,
						duration: 1.5,
						ease: 'linear',
					}}
				></motion.div>

				{/* Внутренний вращающийся элемент */}
				<motion.div
					className='absolute w-20 h-20 border-4 border-b-transparent border-white rounded-full'
					animate={{ rotate: -360 }}
					transition={{
						repeat: Infinity,
						duration: 1.2,
						ease: 'linear',
					}}
				></motion.div>

				{/* Эффект вспышки */}
				<motion.div
					className='absolute w-12 h-12 bg-white rounded-full'
					initial={{ scale: 1, opacity: 0.6 }}
					animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0.1, 0.6] }}
					transition={{
						repeat: Infinity,
						duration: 1.8,
						ease: 'easeInOut',
					}}
				></motion.div>
			</motion.div>
		</div>
	)
}

export default Loader
