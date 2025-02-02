import PropTypes from 'prop-types'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

export const CustomPrevArrow = ({ onClick }) => (
	<button
		className='absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition hidden md:flex'
		onClick={onClick}
	>
		<FaChevronLeft size={24} />
	</button>
)

export const CustomNextArrow = ({ onClick }) => (
	<button
		className='absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition hidden md:flex'
		onClick={onClick}
	>
		<FaChevronRight size={24} />
	</button>
)

CustomPrevArrow.propTypes = {
	onClick: PropTypes.func,
}

CustomNextArrow.propTypes = {
	onClick: PropTypes.func,
}
