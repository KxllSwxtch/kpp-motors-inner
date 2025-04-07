const transformBadgeValue = (value) => {
	if (!value) return value

	// Только если badge начинается с X.Y (например, 1.6 или 2.0)
	const regex = /^(\d)\.(\d)(?=\s|$)/
	return value.replace(regex, '$1_.$2')
}

export default transformBadgeValue
