const PopularCars = () => {
	return (
		<div className='py-12 px-4 text-center'>
			<h2 className='text-3xl font-bold mb-6'>Популярные автомобили</h2>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				{[
					{
						img: 'https://ci.encar.com/carpicture/carpicture03/pic3873/38732268_001.jpg?impolicy=heightRate&rh=696&cw=1160&ch=696&cg=Center&wtmk=https://ci.encar.com/wt_mark/w_mark_04.png&t=20241218152253',
						name: 'BMW 5-Series 530i xDrive M Sport - 2025',
						price: '$53,000',
						link: 'https://fem.encar.com/cars/detail/38732268',
					},
					{
						img: 'https://ci.encar.com/carpicture/carpicture07/pic3887/38870305_001.jpg?impolicy=heightRate&rh=696&cw=1160&ch=696&cg=Center&wtmk=https://ci.encar.com/wt_mark/w_mark_04.png&t=20250113144751',
						name: 'Hyundai Grandeur - 2025',
						price: '$28,000',
						link: 'https://fem.encar.com/cars/detail/38870305',
					},
					{
						img: 'https://ci.encar.com/carpicture/carpicture07/pic3887/38873612_001.jpg?impolicy=heightRate&rh=696&cw=1160&ch=696&cg=Center&wtmk=https://ci.encar.com/wt_mark/w_mark_04.png&t=20250114145441',
						name: 'Genesis G80 2022',
						price: '$47,000',
						link: 'https://fem.encar.com/cars/detail/38873612',
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
