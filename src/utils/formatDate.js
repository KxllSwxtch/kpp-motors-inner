const formatDate = (date) => {
	if (date) return `${date.slice(0, 4)}.${date.slice(4, 6)}`
	return 'н.в.'
}

export default formatDate
