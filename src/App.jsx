import { Routes, Route } from 'react-router-dom'

// Local imports
import { Header, Footer } from './components'
import { Home } from './pages'

const App = () => {
	return (
		<>
			<Header />
			<Routes>
				<Route path='/' element={<Home />} />
			</Routes>
			<Footer />
		</>
	)
}

export default App
