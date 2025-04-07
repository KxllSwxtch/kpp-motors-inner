/**
 * Создает URL для запроса к Encar API с правильно закодированными параметрами
 */
const createEncarApiUrl = {
	/**
	 * Создает URL для запроса списка бейджей
	 */
	forBadgesList: (manufacturer, modelGroup, model, badgeGroup) => {
		// BMW 그랜저 특별 처리 (Особая обработка для BMW Grandeur)
		if (manufacturer === 'BMW' && modelGroup === '그랜저') {
			return `https://api.encar.com/search/car/list/general?count=true&q=(And.Hidden.N._.SellType.%EC%9D%BC%EB%B0%98._.(C.CarType.A._.(C.Manufacturer.${encodeURIComponent(
				manufacturer,
			)}._.(C.ModelGroup.${encodeURIComponent(
				modelGroup,
			)}._.(C.Model.${encodeURIComponent(
				model,
			)}._.BadgeGroup.${encodeURIComponent(
				badgeGroup,
			)}.)))))&inav=%7CMetadata%7CSort`
		}

		// Используем заранее подготовленный URL для известных проблемных случаев
		if (
			manufacturer === '현대' &&
			modelGroup === '팰리세이드' &&
			model.includes('LX3') &&
			badgeGroup === '가솔린 4WD'
		) {
			return 'https://api.encar.com/search/car/list/general?count=true&q=(And.Hidden.N._.SellType.%EC%9D%BC%EB%B0%98._.(C.CarType.A._.(C.Manufacturer.%ED%98%84%EB%8C%80._.(C.ModelGroup.%ED%8C%B0%EB%A6%AC%EC%84%B8%EC%9D%B4%EB%93%9C._.(C.Model.%ED%8C%B0%EB%A6%AC%EC%84%B8%EC%9D%B4%EB%93%9C%20(LX3_)._.BadgeGroup.%EA%B0%80%EC%86%94%EB%A6%B0%204WD.)))))&inav=%7CMetadata%7CSort'
		}

		if (
			manufacturer === '현대' &&
			modelGroup === '팰리세이드' &&
			model.includes('LX3') &&
			badgeGroup === '가솔린 2WD'
		) {
			return 'https://api.encar.com/search/car/list/general?count=true&q=(And.Hidden.N._.SellType.%EC%9D%BC%EB%B0%98._.(C.CarType.A._.(C.Manufacturer.%ED%98%84%EB%8C%80._.(C.ModelGroup.%ED%8C%B0%EB%A6%AC%EC%84%B8%EC%9D%B4%EB%93%9C._.(C.Model.%ED%8C%B0%EB%A6%AC%EC%84%B8%EC%9D%B4%EB%93%9C%20(LX3_)._.BadgeGroup.%EA%B0%80%EC%86%94%EB%A6%B0%202WD.)))))&inav=%7CMetadata%7CSort'
		}

		// Для остальных случаев используем заранее закодированную строку запроса
		return `https://api.encar.com/search/car/list/general?count=true&q=(And.Hidden.N._.SellType.%EC%9D%BC%EB%B0%98._.(C.CarType.A._.(C.Manufacturer.${encodeURIComponent(
			manufacturer,
		)}._.(C.ModelGroup.${encodeURIComponent(
			modelGroup,
		)}._.(C.Model.${encodeURIComponent(
			model,
		)}._.BadgeGroup.${encodeURIComponent(
			badgeGroup,
		)}.)))))&inav=%7CMetadata%7CSort`
	},

	/**
	 * Создает URL для запроса деталей бейджа
	 */
	forBadgeDetails: (manufacturer, modelGroup, model, badgeGroup, badge) => {
		// Особая обработка для BMW с десятичным числом в Badge
		if (manufacturer === 'BMW' && badge.includes('.')) {
			// Заменяем десятичные числа на формат с подчеркиванием
			let formattedBadge = badge.replace(/(\d+)\.(\d+)/g, '$1_.$2')
			console.log(
				`Special BMW badge handling: "${badge}" -> "${formattedBadge}"`,
			)

			return `https://api.encar.com/search/car/list/general?count=true&q=(And.Hidden.N._.SellType.%EC%9D%BC%EB%B0%98._.(C.CarType.A._.(C.Manufacturer.${encodeURIComponent(
				manufacturer,
			)}._.(C.ModelGroup.${encodeURIComponent(
				modelGroup,
			)}._.(C.Model.${encodeURIComponent(
				model,
			)}._.(C.BadgeGroup.${encodeURIComponent(
				badgeGroup,
			)}._.Badge.${encodeURIComponent(
				formattedBadge,
			)}.))))))&inav=%7CMetadata%7CSort`
		}

		// Используем заранее подготовленный URL для известных проблемных случаев
		if (
			manufacturer === '현대' &&
			modelGroup === '팰리세이드' &&
			model.includes('LX3') &&
			badgeGroup === '가솔린 4WD' &&
			badge.includes('7인승')
		) {
			return 'https://api.encar.com/search/car/list/general?count=true&q=(And.Hidden.N._.SellType.%EC%9D%BC%EB%B0%98._.(C.CarType.A._.(C.Manufacturer.%ED%98%84%EB%8C%80._.(C.ModelGroup.%ED%8C%B0%EB%A6%AC%EC%84%B8%EC%9D%B4%EB%93%9C._.(C.Model.%ED%8C%B0%EB%A6%AC%EC%84%B8%EC%9D%B4%EB%93%9C%20(LX3_)._.(C.BadgeGroup.%EA%B0%80%EC%86%94%EB%A6%B0%204WD._.Badge.%EA%B0%80%EC%86%94%EB%A6%B0%202_.5T%204WD%207%EC%9D%B8%EC%8A%B9.))))))&inav=%7CMetadata%7CSort'
		}

		if (
			manufacturer === '현대' &&
			modelGroup === '팰리세이드' &&
			model.includes('LX3') &&
			badgeGroup === '가솔린 2WD' &&
			badge.includes('7인승')
		) {
			return 'https://api.encar.com/search/car/list/general?count=true&q=(And.Hidden.N._.SellType.%EC%9D%BC%EB%B0%98._.(C.CarType.A._.(C.Manufacturer.%ED%98%84%EB%8C%80._.(C.ModelGroup.%ED%8C%B0%EB%A6%AC%EC%84%B8%EC%9D%B4%EB%93%9C._.(C.Model.%ED%8C%B0%EB%A6%AC%EC%84%B8%EC%9D%B4%EB%93%9C%20(LX3_)._.(C.BadgeGroup.%EA%B0%80%EC%86%94%EB%A6%B0%202WD._.Badge.%EA%B0%80%EC%86%94%EB%A6%B0%202_.5T%202WD%207%EC%9D%B8%EC%8A%B9.))))))&inav=%7CMetadata%7CSort'
		}

		// Для остальных случаев проверяем и заменяем десятичные числа
		if (badge && badge.includes('.')) {
			let formattedBadge = badge.replace(/(\d+)\.(\d+)/g, '$1_.$2')
			if (formattedBadge !== badge) {
				console.log(
					`Badge contains decimal, replacing: "${badge}" -> "${formattedBadge}"`,
				)
				badge = formattedBadge
			}
		}

		// badge содержит уже закодированное значение из encodeKoreanForApi
		return `https://api.encar.com/search/car/list/general?count=true&q=(And.Hidden.N._.SellType.%EC%9D%BC%EB%B0%98._.(C.CarType.A._.(C.Manufacturer.${encodeURIComponent(
			manufacturer,
		)}._.(C.ModelGroup.${encodeURIComponent(
			modelGroup,
		)}._.(C.Model.${encodeURIComponent(
			model,
		)}._.(C.BadgeGroup.${encodeURIComponent(
			badgeGroup,
		)}._.Badge.${badge}.))))))&inav=%7CMetadata%7CSort`
	},

	/**
	 * Создает URL для запроса списка автомобилей
	 */
	forCarsList: (
		manufacturer,
		modelGroup,
		model,
		badgeGroup,
		badge,
		badgeDetail,
		currentPage,
	) => {
		const itemsPerPage = 20
		const offset = (currentPage - 1) * itemsPerPage

		// Особая обработка для BMW
		if (manufacturer === 'BMW' && badge && badge.includes('.')) {
			// Заменяем десятичные числа на формат с подчеркиванием
			let formattedBadge = badge.replace(/(\d+)\.(\d+)/g, '$1_.$2')
			console.log(
				`Special BMW badge handling in forCarsList: "${badge}" -> "${formattedBadge}"`,
			)
			badge = formattedBadge
		}

		// Используем заранее подготовленный URL для известных проблемных случаев
		if (
			manufacturer === '현대' &&
			modelGroup === '팰리세이드' &&
			model.includes('LX3') &&
			badgeGroup === '가솔린 4WD' &&
			badge.includes('7인승') &&
			badgeDetail
		) {
			return `https://api.encar.com/search/car/list/premium?count=true&q=(And.Hidden.N._.SellType.%EC%9D%BC%EB%B0%98._.(C.CarType.A._.(C.Manufacturer.%ED%98%84%EB%8C%80._.(C.ModelGroup.%ED%8C%B0%EB%A6%AC%EC%84%B8%EC%9D%B4%EB%93%9C._.(C.Model.%ED%8C%B0%EB%A6%AC%EC%84%B8%EC%9D%B4%EB%93%9C%20(LX3_)._.(C.BadgeGroup.%EA%B0%80%EC%86%94%EB%A6%B0%204WD._.(C.Badge.%EA%B0%80%EC%86%94%EB%A6%B0%202_.5T%204WD%207%EC%9D%B8%EC%8A%B9._.BadgeDetail.${badgeDetail}.)))))))&sr=|ModifiedDate|${offset}|${itemsPerPage}`
		}

		// Для всех случаев с десятичными числами в бейдже
		if (badge && badge.includes('.')) {
			let formattedBadge = badge.replace(/(\d+)\.(\d+)/g, '$1_.$2')
			if (formattedBadge !== badge) {
				console.log(
					`Badge in forCarsList contains decimal, replacing: "${badge}" -> "${formattedBadge}"`,
				)
				badge = formattedBadge
			}
		}

		// badge и badgeDetail содержат уже закодированные значения из encodeKoreanForApi
		return `https://api.encar.com/search/car/list/premium?count=true&q=(And.Hidden.N._.SellType.%EC%9D%BC%EB%B0%98._.(C.CarType.A._.(C.Manufacturer.${encodeURIComponent(
			manufacturer,
		)}._.(C.ModelGroup.${encodeURIComponent(
			modelGroup,
		)}._.(C.Model.${encodeURIComponent(
			model,
		)}._.(C.BadgeGroup.${encodeURIComponent(
			badgeGroup,
		)}._.(C.Badge.${badge}._.BadgeDetail.${badgeDetail}.)))))))&sr=|ModifiedDate|${offset}|${itemsPerPage}`
	},
}

export default createEncarApiUrl
