import { Routes, Route } from 'react-router-dom'
import { ScrollToTop } from './components'

// Local imports
import { Header, Footer } from './components'
import {
	Home,
	Contacts,
	// CarDetails,
	ErrorPage,
	FAQ,
	AboutUs,
	Catalog,
	ExportCarDetails,
	// Cars,
} from './pages'

const App = () => {
	return (
		<div className='flex flex-col min-h-screen'>
			<Header />
			<ScrollToTop />
			<main className='flex-grow'>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/contacts' element={<Contacts />} />
					<Route path='/faq' element={<FAQ />} />
					<Route path='/about-us' element={<AboutUs />} />
					<Route path='/catalog' element={<Catalog />} />
					<Route path='/catalog/:carId' element={<ExportCarDetails />} />
					<Route path='*' element={<ErrorPage />} />
				</Routes>
			</main>
			<Footer />
		</div>
	)
}

export default App
