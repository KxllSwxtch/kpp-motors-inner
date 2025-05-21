import { Link } from 'react-router-dom'

const HeroSection = () => {
	return (
		<div className='relative w-full h-screen md:h-[90vh] lg:h-screen'>
			<video
				className='absolute top-0 left-0 w-full h-full object-cover'
				src='/bg_video.mp4'
				autoPlay
				playsInline
				muted
				loop
			></video>
			<div className='absolute inset-0 bg-black opacity-60'></div>
			<div className='absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4'>
				<h1 className='text-4xl md:text-6xl font-bold mb-4 animate-fade-in'>
					Найдите свой идеальный автомобиль
				</h1>
				<p className='text-lg md:text-xl mb-6 max-w-2xl'>
					Прямые поставки авто из Кореи. Проверенные автомобили по лучшим ценам.
				</p>
				<Link
					to='/catalog'
					className='bg-secondary text-light py-3 px-6 rounded-lg text-lg font-semibold hover:bg-primary transition-all duration-300'
				>
					Каталог Автомобилей
				</Link>
			</div>
		</div>
	)
}

export default HeroSection
