import Slider from 'react-slick'
import PropTypes from 'prop-types'
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/solid'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useState, useRef, useEffect } from 'react'

// Кастомная стрелка для навигации
const CustomArrow = ({ className, onClick, icon }) => (
	<div
		className={`${className} flex items-center justify-center bg-gradient-to-r from-gray-100 via-white to-gray-100 text-gray-800 w-12 h-12 rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition-transform duration-300 border border-gray-300 cursor-pointer`}
		style={{ display: 'flex', position: 'absolute', opacity: 0.8 }}
		onClick={onClick}
	>
		{icon}
	</div>
)

const ImageSlider = ({ images }) => {
	// Состояние и ссылки для синхронизации слайдеров
	const [nav1, setNav1] = useState(null)
	const [nav2, setNav2] = useState(null)
	const mainSlider = useRef(null)
	const thumbSlider = useRef(null)

	useEffect(() => {
		setNav1(mainSlider.current)
		setNav2(thumbSlider.current)
	}, [])

	// Настройки для главного слайдера
	const mainSettings = {
		asNavFor: nav2,
		ref: mainSlider,
		autoplay: true,
		autoplaySpeed: 4000,
		dots: false,
		infinite: true,
		speed: 700,
		slidesToShow: 1,
		slidesToScroll: 1,
		className: 'rounded-lg relative z-50',
		lazyLoad: 'progressive',
		nextArrow: (
			<CustomArrow
				icon={<ChevronRightIcon className='w-8 h-8 text-gray-700' />}
				className='absolute top-1/2 right-4 transform -translate-y-1/2 z-50 hover:text-red-500 transition duration-300'
			/>
		),
		prevArrow: (
			<CustomArrow
				icon={<ChevronLeftIcon className='w-8 h-8 text-gray-700' />}
				className='absolute top-1/2 left-4 transform -translate-y-1/2 z-50 hover:text-red-500 transition duration-300'
			/>
		),
	}

	// Настройки для миниатюр
	const thumbSettings = {
		asNavFor: nav1,
		ref: thumbSlider,
		slidesToShow: images.length < 6 ? images.length : 5, // Показать максимум 5 миниатюр
		slidesToScroll: 1,
		focusOnSelect: true, // Обновление главного слайда при клике на миниатюру
		centerMode: false,
		arrows: false,
		dots: false,
		className: 'mt-4',
	}

	return (
		<div className='relative'>
			{/* Главный слайдер */}
			<Slider {...mainSettings} ref={mainSlider} className='mb-4'>
				{images.map((img, index) => (
					<div key={index} className='flex justify-center'>
						<img
							src={img.full}
							alt={`Car ${index}`}
							className='w-full max-h-[600px] object-contain rounded-lg'
						/>
					</div>
				))}
			</Slider>

			{/* Миниатюры */}
			<Slider {...thumbSettings} ref={thumbSlider} className='mb-6'>
				{images.map((img, index) => (
					<div
						key={index}
						className='px-1 cursor-pointer transition-transform duration-300 hover:scale-105'
					>
						<img
							src={img.full}
							alt={`Thumbnail ${index}`}
							className='w-20 h-20 object-cover rounded-md border border-gray-300 hover:border-red-500 transition-all duration-300'
						/>
					</div>
				))}
			</Slider>
		</div>
	)
}

CustomArrow.propTypes = {
	className: PropTypes.string,
	onClick: PropTypes.func,
	icon: PropTypes.node.isRequired,
}

ImageSlider.propTypes = {
	images: PropTypes.arrayOf(
		PropTypes.shape({
			full: PropTypes.string.isRequired,
		}),
	).isRequired,
}

export default ImageSlider
