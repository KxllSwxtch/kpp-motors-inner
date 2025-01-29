import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	return (
		<header className='bg-dark text-light p-4 flex justify-between items-center'>
			<div className='flex items-center'>
				<img
					src='https://res.cloudinary.com/pomegranitedesign/image/upload/v1738139100/kpp-motors/logo.png.png'
					alt='KPP Motors Logo'
					className='h-8'
				/>
			</div>
			{/* Desktop Navigation */}
			<nav className='hidden md:flex space-x-8 text-sm uppercase'>
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
				<Link to='/contact' className='hover:text-secondary'>
					Контакты
				</Link>
			</nav>
			{/* Mobile Menu Toggle */}
			<button
				className='block md:hidden text-light'
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
					className='absolute top-16 left-0 w-full bg-dark text-light p-4 space-y-4 z-50 md:hidden'
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
