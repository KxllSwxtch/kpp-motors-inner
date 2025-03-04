import PropTypes from 'prop-types'

const Message = ({ text, icon = '🚘' }) => {
	return (
		<div className='flex flex-col items-center justify-center text-center p-6 bg-gray-100 border border-gray-300 rounded-lg shadow-md max-w-md mx-auto'>
			<span className='text-4xl mb-2'>{icon}</span>
			<p className='text-gray-700 text-lg font-medium'>{text}</p>
		</div>
	)
}

// 🔹 PropTypes для проверки типов
Message.propTypes = {
	text: PropTypes.string.isRequired, // Текст сообщения (обязательный)
	icon: PropTypes.string, // Иконка (необязательный, по умолчанию будет 🚘)
}

// 🔹 Значения по умолчанию
Message.defaultProps = {
	icon: '🚘',
}

export default Message
