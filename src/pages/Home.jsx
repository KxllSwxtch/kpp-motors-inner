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
	return (
		<>
			<HeroSection />
			<WhyUsSection />
			<PopularCars />
			<CostCalculatorSection />
			<div className='bg-background'>
				<ServiceVideoSection />
				<BuyingProcessSection />
			</div>
			<ContactSection />
		</>
	)
}
export default Home
