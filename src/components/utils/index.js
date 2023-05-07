import tinyColor from "./tinycolor";

export { tinyColor as tinyColor };

export function shuffle(array) {
	return [...array].sort((_) => Math.random() - 0.5);
}

export function camelCaseToSentenceCase(text) {
	if (!text || !text.length) return "";
	const result = text.replace(/([A-Z]{1,})/g, " $1").trim();
	return result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
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

export const resizeImage = (input, { width, height } = {}) => {
	const isImage = input?.nodeName == "IMG";
	const inputWidth = isImage ? input.naturalWidth : input.width;
	const inputHeight = isImage ? input.naturalHeight : input.height;
	const inputAspectRatio = inputWidth / inputHeight;
	const outputAspectRatio = width / height;

	var canvas = document.createElement("canvas"),
		ctx = canvas.getContext("2d"),
		oc = document.createElement("canvas"),
		octx = oc.getContext("2d");

	canvas.width = width;
	canvas.height = (canvas.width * inputHeight) / inputWidth;

	var cur = {
		width: Math.floor(inputWidth * 0.5),
		height: Math.floor(inputHeight * 0.5),
	};

	oc.width = cur.width;
	oc.height = cur.height;

	octx.drawImage(input, 0, 0, cur.width, cur.height);

	ctx.drawImage(
		oc,
		0,
		0,
		cur.width,
		cur.height,
		0,
		0,
		canvas.width,
		canvas.height
	);

	return canvas;
};

export const resizeToAspectRatio = (input, aspectRatio = 1) => {
	const isImage = input?.nodeName == "IMG";
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

export const getGradientFill = (canvas, colors = ["#d53369", "#daae51"]) => {
	const ctx = canvas.getContext("2d");
	const gradient = ctx.createLinearGradient(
		0,
		0,
		canvas.width,
		canvas.height
	);

	colors.map((color, index) =>
		gradient.addColorStop(index / Math.max(colors.length - 1, 1), color)
	);

	return gradient;
};

export const solidGradientBg = (canvas, background) => {
	if (!canvas || !background) return;

	const ctx = canvas.getContext("2d");
	let fillStyle = background.color;

	if (background.type == "gradient" && background.gradient)
		fillStyle = getGradientFill(canvas, background.gradient);

	return fillStyle;
};

export const solidGradientImageBg = async (source, background) => {
	if (!source || !background) return;

	const { width, height } = source;
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");

	if (background.type == "image") {
		if (!background.image) return;

		const image = await loadImageFromUrl(background.image);
		ctx.drawImage(
			resizeImage(resizeToAspectRatio(image, width / height), {
				width,
				height,
			}),
			0,
			0
		);
	} else {
		ctx.fillStyle = solidGradientBg(source, background);
		ctx.fillRect(0, 0, width, height);
	}

	return canvas;
};

export const backgroundSpec = ({
	imageAsOption = false,
	imageProps = {},
	gradientProps,
	colorProps,
	defaultType = "color",
	...backgroundProps
} = {}) => {
	return {
		type: "background",
		...backgroundProps,
		meta: {
			defaultType,
			colorProps,
			gradientProps,
			imageProps,
		},
		defaultValue: {
			type: defaultType,
			color: "#ffc107",
			gradient: ["#E233FF", "#FF6B00"],
		},
	};
};

export const hexAverage = (...args) => {
	return args
		.map((arg) => new tinyColor(arg).toHex())
		.reduce(
			function (previousValue, currentValue) {
				return currentValue
					.replace(/^#/, "")
					.match(/.{2}/g)
					.map(function (value, index) {
						return previousValue[index] + parseInt(value, 16);
					});
			},
			[0, 0, 0]
		)
		.reduce(function (previousValue, currentValue) {
			return (
				previousValue +
				Math.floor(currentValue / args.length)
					.toString(16)
					.padStart(2, "0")
			);
		}, "#");
};
