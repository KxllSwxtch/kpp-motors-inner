import { Link } from 'react-router-dom'
import { FaTiktok, FaInstagram } from 'react-icons/fa'

const Footer = () => {
	return (
		<footer className='bg-black text-light py-8 px-4 text-center'>
			<div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
				{/* Логотип */}
				<div className='mb-4 md:mb-0'>
					<img
						className='h-25'
						src='https://res.cloudinary.com/pomegranitedesign/image/upload/v1738139100/kpp-motors/logo.jpeg'
						alt='KPP Motors Логотип'
					/>
				</div>
				{/* Навигация */}
				<nav className='mb-4 md:mb-0'>
					<ul className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6'>
						<li>
							<Link to='/' className='hover:text-secondary'>
								Главная
							</Link>
						</li>
						<li>
							<Link to='/cars' className='hover:text-secondary'>
								Каталог
							</Link>
						</li>
						<li>
							<Link to='/about' className='hover:text-secondary'>
								О нас
							</Link>
						</li>
						<li>
							<Link to='/contacts' className='hover:text-secondary'>
								Контакты
							</Link>
						</li>
					</ul>
				</nav>
				{/* Социальные сети */}
				<div className='flex space-x-4'>
					<a
						href='https://www.tiktok.com/@kpp_motors'
						target='_blank'
						rel='noopener noreferrer'
						className='flex items-center hover:text-secondary'
					>
						<FaTiktok className='mr-2 text-2xl' /> TikTok
					</a>
					<a
						href='https://www.instagram.com/kpp_motors'
						target='_blank'
						rel='noopener noreferrer'
						className='flex items-center hover:text-secondary'
					>
						<FaInstagram className='mr-2 text-2xl' /> Instagram
					</a>
				</div>
			</div>
			<p className='mt-6 text-sm text-gray-400'>
				© {new Date().getFullYear()} KPP Motors. Все права защищены.
			</p>
		</footer>
	)
}

export default Footer
