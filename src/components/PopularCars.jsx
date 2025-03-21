const PopularCars = () => {
	return (
		<div className='py-12 px-4 text-center'>
			<h2 className='text-3xl font-bold mb-6'>Популярные автомобили</h2>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				{[
					{
						img: 'https://myshop-img.carmanager.co.kr/temp/photo/2025/20250228/2E4D501128908255998162485CCE9E4B589E84FB9FC2231B54FF6F12783CB2DA.jpg',
						name: 'BMW 5-Series 530i xDrive M Sport - 2025',
						price: '$53,000',
						link: 'https://bazarishauto.com/catalog/112193574',
					},
					{
						img: 'https://myshop-img.carmanager.co.kr/temp/photo/2025/20250312/4D02BCBC07BC0CA4D11CB8A3817AC531A338F7BD0AC8DC5677472764C5B3CEC4.jpg',
						name: 'Hyundai Grandeur (GN7) - 2025',
						price: '$28,000',
						link: 'https://bazarishauto.com/catalog/112136271',
					},
					{
						img: 'https://myshop-img.carmanager.co.kr/temp/photo/2025/20250304/B39AF7887E519C1596D312FE21426B66AAB471CD13B3B46006E92DA4F84E02E0.jpg',
						name: 'Genesis G90 2019',
						price: '$30,000',
						link: 'https://bazarishauto.com/catalog/112144557',
					},
				].map((car, index) => (
					<div
						key={index}
						className='p-6 bg-white shadow-lg rounded-lg transform transition duration-300 hover:scale-105'
					>
						<img
							src={car.img}
							alt={car.name}
							className='w-full h-60 object-cover mb-4 rounded-lg'
						/>
						<h3 className='text-xl font-semibold'>{car.name}</h3>
						<p className='text-gray-600'>{car.price}</p>
						<a
							href={car.link}
							target='_blank'
							rel='noopener noreferrer'
							className='block mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition duration-300 cursor-pointer'
						>
							Подробнее
						</a>
					</div>
				))}
			</div>
		</div>
	)
}

export default PopularCars
