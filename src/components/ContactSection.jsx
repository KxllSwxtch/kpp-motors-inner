import {
	FaTelegramPlane,
	FaWhatsapp,
	FaPhoneAlt,
	FaMapMarkerAlt,
	FaEnvelope,
} from 'react-icons/fa'

const ContactSection = () => {
	return (
		<div className='bg-gray-800 text-white py-12 px-4 text-center'>
			<h2 className='text-3xl font-bold mb-6'>Bazarish Auto всегда на связи</h2>
			<div className='flex flex-col md:flex-row justify-center items-center gap-8'>
				{/* Телефоны */}
				<div className='flex flex-col items-start gap-3'>
					{[
						{ number: '+82 10-7650-3034', name: 'Константин' },
						{ number: '+82 10-7219-1701', name: 'Константин' },
						{ number: '+82 10-3504-1522', name: 'Елена (English, 한국어)' },
					].map((contact, index) => (
						<div key={index} className='flex items-center gap-3 w-64'>
							<FaPhoneAlt className='text-green-500 text-2xl flex-shrink-0' />
							<p className='flex-grow text-left'>
								{contact.number} ({contact.name})
							</p>
						</div>
					))}
				</div>

				<div className='flex items-center gap-3 w-64'>
					<FaEnvelope className='text-blue-500 text-2xl flex-shrink-0' />
					<p className='text-left'>Limko199810@gmail.com</p>
				</div>
				<div className='flex items-center gap-3'>
					<FaMapMarkerAlt className='text-red-500 text-2xl' />
					<p>경기도 수원시 권선구 평동 57-1</p>
				</div>
			</div>

			<div className='mt-6 flex justify-center gap-6'>
				<a
					href='https://t.me/KPP_Motorss'
					target='_blank'
					className='flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-md text-white hover:bg-blue-700 transition-all'
				>
					<FaTelegramPlane className='text-xl' /> Telegram
				</a>
				<a
					target='_blank'
					href='https://wa.me/+821076503034'
					className='flex items-center gap-2 bg-green-500 px-4 py-2 rounded-md text-white hover:bg-green-600 transition-all'
				>
					<FaWhatsapp className='text-xl' /> WhatsApp
				</a>
			</div>
		</div>
	)
}

export default ContactSection
