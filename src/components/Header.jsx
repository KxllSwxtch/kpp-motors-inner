import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isScrolled, setIsScrolled] = useState(false)

	const location = useLocation()

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	useEffect(() => {
		const checkScroll = () => {
			if (location.pathname !== '/') {
				setIsScrolled(true) // На всех страницах, кроме главной, делаем фон чёрным
			} else {
				setIsScrolled(window.scrollY > 50)
			}
		}

		checkScroll() // Вызываем при монтировании, чтобы сразу обновить состояние

		window.addEventListener('scroll', checkScroll)
		return () => window.removeEventListener('scroll', checkScroll)
	}, [location.pathname])

	return (
		<header
			className={`fixed top-0 left-0 w-full p-4 flex justify-between items-center transition-all duration-300 z-50 ${
				isScrolled
					? 'bg-black shadow-lg py-3'
					: 'sm:bg-transparent py-4 bg-black'
			}`}
		>
			<div className='flex items-center'>
				<Link to='/'>
					<img
						src='https://res.cloudinary.com/pomegranitedesign/image/upload/v1738139100/kpp-motors/logo.png.png'
						alt='KPP Motors Logo'
						className='h-12'
					/>
				</Link>
			</div>
			{/* Desktop Navigation */}
			<nav className='hidden md:flex space-x-8 text-sm uppercase text-white'>
				<Link to='/' className='hover:text-secondary'>
					Главная
				</Link>
				<Link to='/cars' className='hover:text-secondary'>
					Автомобили в наличии
				</Link>
				<Link to='/cases' className='hover:text-secondary'>
					Кейсы
				</Link>
				<Link to='/reviews' className='hover:text-secondary'>
					Отзывы
				</Link>
				<Link to='/faq' className='hover:text-secondary'>
					Ответы на вопросы
				</Link>
				<Link to='/about' className='hover:text-secondary'>
					О нас
				</Link>
				<Link to='/contacts' className='hover:text-secondary'>
					Контакты
				</Link>
			</nav>
			{/* Mobile Menu Toggle */}
			<button
				className='block md:hidden text-white text-3xl'
				onClick={toggleMenu}
				aria-label='Toggle menu'
			>
				{isMenuOpen ? '✖' : '☰'}
			</button>
			{/* Mobile Menu */}
			{isMenuOpen && (
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					className='absolute top-16 left-0 w-full bg-black text-light p-4 space-y-4 z-50 md:hidden'
				>
					<Link to='/' className='block hover:text-secondary'>
						Главная
					</Link>
					<Link to='/cars' className='block hover:text-secondary'>
						Автомобили в наличии
					</Link>
					<Link to='/cases' className='block hover:text-secondary'>
						Кейсы
					</Link>
					<Link to='/reviews' className='block hover:text-secondary'>
						Отзывы
					</Link>
					<Link to='/faq' className='block hover:text-secondary'>
						Ответы на вопросы
					</Link>
					<Link to='/about' className='block hover:text-secondary'>
						О нас
					</Link>
					<Link to='/contact' className='block hover:text-secondary'>
						Контакты
					</Link>
				</motion.div>
			)}
		</header>
	)
}

export default Header
