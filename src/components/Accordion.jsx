import { useState } from 'react'
import PropTypes from 'prop-types'

const Accordion = ({ items }) => {
	const [openIndex, setOpenIndex] = useState(null)

	const toggleItem = (index) => {
		setOpenIndex(openIndex === index ? null : index)
	}

	return (
		<div className='w-full max-w-2xl mx-auto space-y-4'>
			{items.map((item, index) => (
				<div key={index} className='border rounded-lg shadow-sm'>
					<button
						className='w-full flex justify-between items-center p-4 text-left text-lg font-medium bg-gray-100 hover:bg-gray-200 transition'
						onClick={() => toggleItem(index)}
					>
						{item.question}
						<span
							className={`transform transition-transform ${
								openIndex === index ? 'rotate-180' : ''
							}`}
						>
							▼
						</span>
					</button>
					<div
						className={`overflow-hidden transition-all duration-300 ease-in-out ${
							openIndex === index ? 'max-h-40 p-4' : 'max-h-0 p-0'
						} bg-gray-50`}
					>
						<p className='text-gray-700'>{item.answer}</p>
					</div>
				</div>
			))}
		</div>
	)
}

Accordion.propTypes = {
	items: PropTypes.arrayOf(
		PropTypes.shape({
			question: PropTypes.string.isRequired,
			answer: PropTypes.string.isRequired,
		}),
	).isRequired,
}

export default Accordion
