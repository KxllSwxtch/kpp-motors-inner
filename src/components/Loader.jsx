import { motion } from 'framer-motion'

const Loader = () => {
	return (
		<div className='flex justify-center items-center h-screen'>
			<motion.div
				className='w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
			></motion.div>
		</div>
	)
}

export default Loader
