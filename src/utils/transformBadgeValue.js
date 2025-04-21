const transformBadgeValue = (value) => {
	if (!value) return value

	// Обновляем регулярное выражение, чтобы находить все вхождения X.Y в строке,
	// даже если после второй цифры идет буква или другой символ
	const regex = /(\d)\.(\d)/g
	return value.replace(regex, '$1_.$2')
}

export default transformBadgeValue
