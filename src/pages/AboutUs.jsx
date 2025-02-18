import { FaCar, FaHandshake, FaGlobe } from 'react-icons/fa'

const AboutUs = () => {
	return (
		<div className='container mx-auto px-4 py-12 mt-20'>
			<h1 className='text-4xl font-bold text-center mb-6'>О Нас</h1>
			<p className='text-lg text-gray-700 text-center max-w-3xl mx-auto mb-8'>
				Добро пожаловать в <strong>Bazarish Auto</strong> – ведущую компанию по
				импорту автомобилей из Южной Кореи. Мы предоставляем полный цикл услуг:
				от подбора и проверки автомобиля до доставки и таможенного оформления.
			</p>

			{/* Блоки информации */}
			<div className='grid md:grid-cols-3 gap-8 text-center'>
				<div className='p-6 bg-gray-100 rounded-lg shadow-md'>
					<FaCar className='text-5xl text-blue-500 mx-auto mb-4' />
					<h2 className='text-xl font-semibold mb-2'>Большой выбор</h2>
					<p className='text-gray-600'>
						Мы работаем с проверенными автодилерами и предоставляем лучшие
						предложения по цене и качеству.
					</p>
				</div>

				<div className='p-6 bg-gray-100 rounded-lg shadow-md'>
					<FaHandshake className='text-5xl text-green-500 mx-auto mb-4' />
					<h2 className='text-xl font-semibold mb-2'>Честность и доверие</h2>
					<p className='text-gray-600'>
						Мы заботимся о наших клиентах, обеспечивая прозрачность сделок и
						полное сопровождение на каждом этапе.
					</p>
				</div>

				<div className='p-6 bg-gray-100 rounded-lg shadow-md'>
					<FaGlobe className='text-5xl text-orange-500 mx-auto mb-4' />
					<h2 className='text-xl font-semibold mb-2'>Международные поставки</h2>
					<p className='text-gray-600'>
						Осуществляем доставку автомобилей в Россию, Казахстан и Кыргызстан с
						гарантией надежности.
					</p>
				</div>
			</div>
		</div>
	)
}

export default AboutUs
