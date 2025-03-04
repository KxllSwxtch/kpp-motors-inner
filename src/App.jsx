import { Routes, Route } from 'react-router-dom'
import { ScrollToTop } from './components'

// Local imports
import { Header, Footer } from './components'
import {
	Home,
	Contacts,
	CarDetails,
	ErrorPage,
	FAQ,
	AboutUs,
	Catalog,
	// Cars,
} from './pages'

const App = () => {
	return (
		<>
			<Header />
			<ScrollToTop />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/contacts' element={<Contacts />} />
				<Route path='/faq' element={<FAQ />} />
				<Route path='/about-us' element={<AboutUs />} />
				<Route path='/catalog' element={<Catalog />} />
				<Route path='/catalog/:carId' element={<CarDetails />} />
				<Route path='*' element={<ErrorPage />} />
			</Routes>
			<Footer />
		</>
	)
}

export default App
