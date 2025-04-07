/**
 * Функция для преобразования корейских строк в формат, который ожидает Encar API
 * Для известных проблемных значений использует проверенные закодированные строки,
 * для остальных применяет стандартную URI-кодировку с заменой десятичных чисел
 */
const encodeKoreanForApi = (text) => {
	if (!text) return text

	// Для известных проблемных значений возвращаем готовое закодированное значение
	const knownValues = {
		'가솔린 2.5T 4WD 7인승':
			'%EA%B0%80%EC%86%94%EB%A6%B0%202_.5T%204WD%207%EC%9D%B8%EC%8A%B9',
		'가솔린 2.5T 2WD 7인승':
			'%EA%B0%80%EC%86%94%EB%A6%B0%202_.5T%202WD%207%EC%9D%B8%EC%8A%B9',
		'3.5 가솔린 4WD': '3_.5%20%EA%B0%80%EC%86%94%EB%A6%B0%204WD',
		// Добавьте другие известные проблемные бейджи по мере необходимости
	}

	if (knownValues[text]) {
		console.log(`Using known encoding for "${text}": ${knownValues[text]}`)
		return knownValues[text]
	}

	// Заменяем все десятичные числа (например, 2.5) на формат с подчеркиванием (2_.5)
	let modifiedText = text.replace(/(\d+)\.(\d+)/g, '$1_.$2')

	// Для отладки показываем что было заменено
	if (modifiedText !== text) {
		console.log(`Replaced decimal in "${text}" to "${modifiedText}"`)
	}

	// Кодируем результат
	return encodeURIComponent(modifiedText)
}

export default encodeKoreanForApi
