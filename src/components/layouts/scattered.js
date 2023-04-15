// https://ipf-website.s3.amazonaws.com/1600w-ajpB3QBEsUo.webp
import { loadImageFromUrl, resizeImage, resizeToAspectRatio } from "../utils";

class ScatteredTemplate {
	constructor({ canvas, callback, images }) {
		this.images = images;
		this.callback = callback;
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.canvas.width = this.canvas.height;

		callback();
	}

	drawCard(img, userOptions, callback) {
		const userOptionsIsCallback = typeof userOptions == "function";
		if (userOptionsIsCallback) callback = userOptions;

		// return new Promise((resolve) => {
		// loadImageFromUrl(imageUrl).then((img) => {
		const { rotate, inset, width, height } = {
			width: 900,
			height: 900,
			inset: 30,
			...(!userOptions || userOptionsIsCallback ? {} : userOptions),
		};

		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext("2d");

		const shadowOffset = 8;
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
		ctx.shadowOffsetX = 0.5;
		ctx.shadowOffsetY = 0.5;
		ctx.beginPath();
		ctx.lineWidth = inset;
		ctx.rect(inset, inset, width - inset, height - inset);
		ctx.fill();
		ctx.stroke();
		ctx.restore();
		ctx.clip();

		ctx.fillRect(0, 0, width, height);

		let innerWidth = width - inset * 2;
		let innerHeight = height - inset * 2 - 60;

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

		this.drawCard(this.images[0], { rotate: 20 }, (cardTopLeft) => {
			ctx.drawImage(cardTopLeft, 0, 0);
			this.callback();
		});

		this.drawCard(this.images[5], { rotate: -2 }, (cardBottomLeft) => {
			ctx.drawImage(cardBottomLeft, 0, height - cardBottomLeft.height);
			this.callback();
		});

		this.drawCard(
			this.images[3],
			{
				rotate: -15,
				width: 1000,
				height: 1000,
			},
			(cardCenterLeft) => {
				ctx.drawImage(
					cardCenterLeft,
					-cardCenterLeft.width * 0.2,
					(height - cardCenterLeft.height) / 2
				);
				this.callback();
			}
		);

		this.drawCard(this.images[2], (cardTopRight) => {
			ctx.drawImage(cardTopRight, width - cardTopRight.width, 0);
			this.callback();
		});

		this.drawCard(this.images[7], { rotate: 30 }, (cardBottomRight) => {
			ctx.drawImage(
				cardBottomRight,
				width - cardBottomRight.width,
				height - cardBottomRight.height
			);
			this.callback();
		});

		this.drawCard(
			this.images[4],
			{
				rotate: 15,
				width: 1000,
				height: 1000,
			},
			(cardCenterRight) => {
				ctx.drawImage(
					cardCenterRight,
					width - cardCenterRight.width * 0.8,
					(height - cardCenterRight.height) / 2
				);
				this.callback();
			}
		);

		this.drawCard(
			this.images[1],
			{
				rotate: -10,
				width: 1000,
				height: 900,
			},
			(cardTopCenter) => {
				ctx.drawImage(
					cardTopCenter,
					(width - cardTopCenter.width) / 2,
					-cardTopCenter.height * 0.2
				);
				this.callback();
			}
		);

		this.drawCard(
			this.images[6],
			{
				rotate: -20,
				width: 1000,
				height: 900,
			},
			(cardBottomCenter) => {
				ctx.drawImage(
					cardBottomCenter,
					(width - cardBottomCenter.width) / 2,
					height - cardBottomCenter.height * 0.8
				);
				this.callback();
			}
		);
	}
}

export default ScatteredTemplate;
