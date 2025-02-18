import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import {
	BuyingProcessSection,
	ContactSection,
	HeroSection,
	PopularCars,
	ServiceVideoSection,
	WhyUsSection,
	CostCalculatorSection,
} from '../components'

const Home = () => {
	const location = useLocation()

	useEffect(() => {
		// Запускаем скролл только если URL содержит #calculator
		if (location.hash === '#calculator') {
			setTimeout(() => {
				const element = document.getElementById('calculator')
				if (element) {
					element.scrollIntoView({ behavior: 'smooth' })
				}
			}, 500) // Небольшая задержка
		}
	}, [location])

	return (
		<>
			<HeroSection />
			<WhyUsSection />
			<PopularCars />
			<div id='calculator'>
				<CostCalculatorSection />
			</div>
			<div className='bg-background'>
				<ServiceVideoSection />
				<BuyingProcessSection />
			</div>
			<ContactSection />
		</>
	)
}
export default Home
