export function shuffle(array) {
	return [...array].sort((_) => Math.random() - 0.5);
}

export function camelCaseToSentenceCase(text) {
	if (!text || !text.length) return "";
	const result = text.replace(/([A-Z]{1,})/g, " $1");
	return result.charAt(0).toUpperCase() + result.slice(1);
}

export function someTime(duration = 10) {
	return new Promise((res) => {
		setTimeout(res, duration);
	});
}
