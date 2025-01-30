import { Routes, Route } from 'react-router-dom'
import { ScrollToTop } from './components'

// Local imports
import { Header, Footer } from './components'
import { Home, Contacts } from './pages'

const App = () => {
	return (
		<>
			<Header />
			<ScrollToTop />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/contacts' element={<Contacts />} />
			</Routes>
			<Footer />
		</>
	)
}

export default App
