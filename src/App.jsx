import { Routes, Route } from 'react-router-dom'
import { ScrollToTop } from './components'

// Local imports
import { Header, Footer } from './components'
import { Home, Contacts, Cars, CarDetails, ErrorPage } from './pages'

const App = () => {
	return (
		<>
			<Header />
			<ScrollToTop />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/contacts' element={<Contacts />} />
				<Route path='/cars' element={<Cars />} />
				<Route path='/cars/:id' element={<CarDetails />} />
				<Route path='*' element={<ErrorPage />} />
			</Routes>
			<Footer />
		</>
	)
}

export default App
