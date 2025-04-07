/**
 * Properly formats model names for Encar API
 * Ensures model names with parentheses have the correct underscore format
 * e.g. "팰리세이드 (LX3)" -> "팰리세이드 (LX3_)"
 */
const formatModelName = (modelName) => {
	if (!modelName) return modelName

	// If the model name contains a parenthesis pattern like (XXX) add underscore
	// Only if it doesn't already have an underscore
	const regex = /\(([\w\d]+)\)(?!_)/
	if (regex.test(modelName)) {
		return modelName.replace(regex, '($1_)')
	}

	return modelName
}

export default formatModelName
