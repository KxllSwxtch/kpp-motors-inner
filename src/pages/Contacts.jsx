import {
	FaMapMarkerAlt,
	FaPhoneAlt,
	FaEnvelope,
	FaTelegramPlane,
	FaWhatsapp,
} from 'react-icons/fa'

const Contacts = () => {
	return (
		<div className='container mx-auto mt-15 py-12 px-4'>
			<h2 className='text-3xl font-bold mb-6 text-center'>
				Контакты Bazarish Auto
			</h2>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
				{/* Контактная информация */}
				<div className='space-y-6'>
					<div className='flex items-center gap-3'>
						<FaMapMarkerAlt className='text-red-500 text-2xl' />
						<p>경기도 수원시 권선구평동57-1(316-318호)</p>
					</div>
					<div className='flex items-center gap-3'>
						<FaPhoneAlt className='text-green-500 text-2xl' />
						<p>+82-10-7650-3034 (Константин)</p>
					</div>
					<div className='flex items-center gap-3'>
						<FaPhoneAlt className='text-green-500 text-2xl' />
						<p>+82-10-7291-1701 (Константин)</p>
					</div>
					<div className='flex items-center gap-3'>
						<FaPhoneAlt className='text-green-500 text-2xl' />
						<p>+82-10-3504-1522 (Елена) (English, 한국어)</p>
					</div>
					{/* <div className='flex items-center gap-3'>
						<FaMapMarkerAlt className='text-red-500 text-2xl' />
						<p>БЦ Мастер, ул. Галиаскара Камала, 41, Казань, Россия</p>
					</div>
					<div className='flex items-center gap-3'>
						<FaPhoneAlt className='text-green-500 text-2xl' />
						<p>+7-937-771-72-70 (менеджеры в РФ)</p>
					</div> */}
					<div className='flex items-center gap-3'>
						<FaEnvelope className='text-blue-500 text-2xl' />
						<p>Limko199810@gmail.com</p>
					</div>
					<button className='bg-primary text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-secondary transition-all duration-300 cursor-pointer'>
						Оставить заявку
					</button>
				</div>
				{/* Карта */}
				<div className='w-full h-80'>
					<iframe
						src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3175.5498550140696!2d126.99565837591646!3d37.25838634173794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357b4302211cc739%3A0x68f31d824e224bee!2s57-1%20Pyeong-dong%2C%20Gwonseon-gu%2C%20Suwon%2C%20Gyeonggi-do!5e0!3m2!1sen!2skr!4v1738208276892!5m2!1sen!2skr'
						width='100%'
						height='100%'
						style={{ border: 0 }}
						allowFullScreen=''
						loading='lazy'
						referrerPolicy='no-referrer-when-downgrade'
						title='Bazarish Auto Location'
					></iframe>
				</div>
			</div>
			{/* Соцсети */}
			<div className='mt-8 text-center'>
				<h3 className='text-xl font-semibold mb-4'>
					Подписывайтесь на нас в соцсетях:
				</h3>
				<div className='flex justify-center gap-6'>
					<a
						target='_blank'
						href='https://t.me/bazarish_auto'
						className='flex items-center gap-2 text-blue-500 hover:text-blue-700'
					>
						<FaTelegramPlane className='text-2xl' /> Telegram
					</a>
					<a
						target='_blank'
						href='https://wa.me/+821076503034'
						className='flex items-center gap-2 text-green-500 hover:text-green-700'
					>
						<FaWhatsapp className='text-2xl' /> WhatsApp
					</a>
				</div>
			</div>
		</div>
	)
}

export default Contacts
