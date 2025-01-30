import { DOMParser } from 'xmldom' // Установи npm пакет xmldom

const parseXML = (xmlString) => {
	try {
		const parser = new DOMParser()
		const xmlDoc = parser.parseFromString(xmlString, 'text/xml')

		const cars = Array.from(xmlDoc.getElementsByTagName('cars')).map((car) => ({
			id: car.getElementsByTagName('no')[0]?.textContent || 'N/A',
			name:
				car.getElementsByTagName('carName')[0]?.textContent || 'Нет названия',
			maker:
				car.getElementsByTagName('makerName')[0]?.textContent || 'Нет марки',
			model:
				car.getElementsByTagName('modelName')[0]?.textContent || 'Нет модели',
			price: car.getElementsByTagName('c_price')[0]?.textContent || 'N/A',
			year: car.getElementsByTagName('c_year')[0]?.textContent || 'N/A',
			mileage: car.getElementsByTagName('mileageStr')[0]?.textContent || 'N/A',
			gearbox: car.getElementsByTagName('c_gearbox')[0]?.textContent || 'N/A',
			image: `http://www.carmodoo.com${
				car.getElementsByTagName('mainImage')[0]?.textContent || ''
			}`,
		}))

		return cars
	} catch (error) {
		console.error('Ошибка парсинга XML:', error)
		return []
	}
}

export default parseXML
