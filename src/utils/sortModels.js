const sortModels = (models) => {
	// Упорядочиваем префиксы по приоритету
	const prefixPriority = {
		'': 0,
		New: 1,
		'The New': 2,
		'All-New': 3,
		'The All-New': 4,
	}

	return models.sort((a, b) => {
		// 1. Определяем "чистое" название модели (без префикса)
		const extractBaseName = (name) => {
			return name.replace(/^(The All-New|The New|All-New|New)\s*/, '').trim()
		}

		const baseA = extractBaseName(a.name)
		const baseB = extractBaseName(b.name)

		// 2. Сортируем по "чистому" названию (алфавитно)
		if (baseA !== baseB) {
			return baseA.localeCompare(baseB)
		}

		// 3. Если модели одной серии → сортируем по приоритету префиксов
		const prefixA = a.name.replace(baseA, '').trim()
		const prefixB = b.name.replace(baseB, '').trim()

		const prefixOrderA = prefixPriority[prefixA] || 0
		const prefixOrderB = prefixPriority[prefixB] || 0

		if (prefixOrderA !== prefixOrderB) {
			return prefixOrderA - prefixOrderB // Префиксы в правильном порядке
		}

		// 4. Если префиксы одинаковые → сортируем по году (новые выше)
		const getStartYear = (model) => parseInt(model.years.split(' - ')[0]) || 0
		return getStartYear(b) - getStartYear(a)
	})
}

export default sortModels
