import {
	carBrandsTranslation,
	carModelsTranslation,
	carTrimsTranslation,
	carDetailedModelsTranslation,
} from '../translations'

const translateCarName = (name) => {
	if (!name) return ''

	// Объединяем словари
	const combinedDict = {
		...carBrandsTranslation,
		...carModelsTranslation,
		...carDetailedModelsTranslation,
		...carTrimsTranslation,
	}

	// Сортируем ключи по длине, чтобы более длинные совпадения обрабатывались первыми
	const keys = Object.keys(combinedDict).sort((a, b) => b.length - a.length)

	// Функция для экранирования специальных символов в ключах
	const escapeRegex = (str) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')

	// Создаем регулярное выражение, которое ищет все ключи
	const regex = new RegExp(keys.map(escapeRegex).join('|'), 'g')

	// Заменяем найденные ключи на соответствующие переводы
	return name.replace(regex, (match) => combinedDict[match] || match)
}

export default translateCarName
