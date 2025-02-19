import { useEffect } from 'react'

const InstagramFeed = () => {
	useEffect(() => {
		// Динамически загружаем платформу Elfsight
		const script = document.createElement('script')
		script.src = 'https://static.elfsight.com/platform/platform.js'
		script.async = true
		document.body.appendChild(script)
	}, [])

	return (
		<div className='container mx-auto mt-10 px-4 mb-20'>
			<h2 className='text-2xl font-bold text-center mb-6'>
				🕶️ Свежий контент не отходя от кассы
			</h2>
			<div
				className='elfsight-app-677129c1-c1fc-4c98-91f1-a19a984d5a61'
				data-elfsight-app-lazy
			></div>
		</div>
	)
}

export default InstagramFeed
