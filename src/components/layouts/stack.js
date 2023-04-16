// https://ipf-website.s3.amazonaws.com/1600w-ajpB3QBEsUo.webp
import { loadImageFromUrl, resizeImage, resizeToAspectRatio } from "../utils";

class StackTemplate {
	constructor({ canvas, callback, images }) {
		this.images = images;
		this.callback = callback;
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.inset = this.canvas.height * 0.016;
		// this.canvas.height = 1000;
		this.canvas.width = this.canvas.height / 1.5;

		callback();
	}

	drawCard(img, userOptions, callback) {
		const userOptionsIsCallback = typeof userOptions == "function";
		if (userOptionsIsCallback) callback = userOptions;

		// return new Promise((resolve) => {
		// loadImageFromUrl(imageUrl).then((img) => {
		const { rotate, inset, width, height } = {
			width: this.canvas.width,
			height: this.canvas.height / 2,
			inset: this.inset,
			...(!userOptions || userOptionsIsCallback ? {} : userOptions),
		};

		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext("2d");

		const shadowOffset = 12;
		ctx.fillStyle = "white";
		ctx.strokeStyle = "white";

		if (rotate) {
			const rx = width / 2;
			const ry = height / 2;
			ctx.translate(rx, ry);
			ctx.rotate((rotate * Math.PI) / 180);
			ctx.translate(-rx, -ry);
		}

		if (rotate) ctx.transform(0.7, 0, 0, 0.7, width * 0.15, height * 0.15);
		else ctx.transform(0.85, 0, 0, 0.85, width * 0.1, height * 0.08);

		ctx.save();
		ctx.fillStyle = "white";
		ctx.strokeStyle = "white";
		ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
		ctx.shadowBlur = shadowOffset / 2;
		ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = 2;
		ctx.beginPath();
		ctx.lineWidth = inset;
		ctx.rect(inset, inset, width - inset, height - inset);
		ctx.fill();
		ctx.stroke();
		ctx.restore();
		ctx.clip();

		ctx.fillRect(0, 0, width, height);

		let innerWidth = width - inset * 2;
		let innerHeight = height - inset * 2;

		ctx.drawImage(
			resizeImage(resizeToAspectRatio(img, innerWidth / innerHeight), {
				width: innerWidth,
				height: innerHeight,
			}),
			inset * 1.5,
			inset * 1.5
		);

		// resolve(canvas);
		// });
		// });

		setTimeout(() => {
			callback(canvas);
		});

		return canvas;
	}

	draw() {
		const width = this.canvas.width;
		const height = this.canvas.height;
		const ctx = this.ctx;

		this.drawCard(
			this.images[0],
			{
				rotate: 6,
				width: width * 1.05,
				height: (width * 1.05 * 9) / 14,
			},
			(cardTop) => {
				ctx.drawImage(
					cardTop,
					-cardTop.width / 12,
					-cardTop.height / 20
				);
				this.callback();
			}
		);

		this.drawCard(
			this.images[2],
			{ rotate: 1.5, height: (height * 2) / 3.5, width: width / 1.4 },
			(cardBottom) => {
				ctx.drawImage(
					cardBottom,
					-cardBottom.width / 14,
					height - cardBottom.height * 0.92
				);
				this.callback();
			}
		);

		this.drawCard(
			this.images[1],
			{
				rotate: -4,
				height: (height * 2) / 3.5,
				width: width * 0.9,
			},
			(cardCenter) => {
				ctx.drawImage(
					cardCenter,
					width - cardCenter.width * 0.75,
					height / 2 - cardCenter.height / 2
				);
				this.callback();
			}
		);
	}
}

export default StackTemplate;
