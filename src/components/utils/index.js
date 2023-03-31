export { default as tinyColor } from "./tinycolor";

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

export const loadImageFromUrl = (url) => {
	return new Promise((resolve) => {
		try {
			const img = new Image();
			img.crossOrigin = "anonymous";
			img.onload = async () => {
				resolve(img);
			};
			img.src = url;
		} catch (error) {
			console.log("Error loading image: ", error);
		}
	});
};

export const loadImage = async (
	instance,
	src,
	{ updateDimensions = true } = {}
) => {
	instance.src = src;

	const img = await loadImageFromUrl(src);

	instance.img = img;

	if (updateDimensions) {
		instance.canvas.width = img.naturalWidth;
		instance.canvas.height = img.naturalHeight;
	}

	return instance;
};

export const pathFromPoints = (points) =>
	new Path2D(
		points
			.map(
				(entry, index) => `${index == 0 ? "M" : "L"}${entry.join(",")}`
			)
			.join("") + "Z"
	);

export const showPreview = (url) => {
	const previewer = document.querySelector("#previewStuff img");
	if (previewer) previewer.src = url;
};

export const resizeToAspectRatio = (input, aspectRatio = 1) => {
	const isImage = input?.nodeName != "IMG";
	const inputWidth = isImage ? input.naturalWidth : input.width;
	const inputHeight = isImage ? input.naturalHeight : input.height;
	const inputAspectRatio = inputWidth / inputHeight;
	let outputWidth = inputWidth;
	let outputHeight = inputHeight;
	if (inputAspectRatio > aspectRatio) outputWidth = inputHeight * aspectRatio;
	else if (inputAspectRatio < aspectRatio)
		outputHeight = inputWidth / aspectRatio;

	const output = document.createElement("canvas");
	output.width = outputWidth;
	output.height = outputHeight;

	const ctx = output.getContext("2d");
	ctx.drawImage(input, 0, 0);

	return output;
};
