import {
	BuyingProcessSection,
	ContactSection,
	HeroSection,
	PopularCars,
	ServiceVideoSection,
	WhyUsSection,
} from '../components'

const Home = () => {
	return (
		<>
			<HeroSection />
			<WhyUsSection />
			<PopularCars />
			<div className='bg-background'>
				<ServiceVideoSection />
				<BuyingProcessSection />
			</div>
			<ContactSection />
		</>
	)
}
export default Home
