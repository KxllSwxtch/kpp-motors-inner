import { motion } from 'framer-motion'

const ServiceVideoSection = () => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
			viewport={{ once: true }}
			className='relative pt-12 text-center'
		>
			<div className='relative w-full max-w-4xl mx-auto overflow-hidden rounded-lg shadow-lg'>
				<video
					className='w-full h-full object-cover'
					src='https://res.cloudinary.com/pomegranitedesign/video/upload/v1738204996/kpp-motors/video_10.42.50_AM.mp4'
					playsInline
					controls
					controlsList='nodownload'
				/>
			</div>
		</motion.div>
	)
}

export default ServiceVideoSection
