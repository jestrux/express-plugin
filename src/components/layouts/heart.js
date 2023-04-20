// https://ipf-website.s3.amazonaws.com/1600w-ajpB3QBEsUo.webp
import { loadImageFromUrl, resizeImage, resizeToAspectRatio } from "../utils";

class HeartTemplate {
	constructor({ canvas, callback, images }) {
		this.images = images;
		this.callback = callback;
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.canvas.width = 2200;
		this.canvas.height = 2200;

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

		if (!img) return canvas;

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

		const path = new Path2D(
			"M 1705.02 1485.24 C 1445.79 1695.42 1131.93 1802.08 857.412 1996.48 C 765.157 1706.98 567.523 1569.29 349.372 1374.77 C 57.414 1114.44 -225.259 400.599 360.264 291.362 C 516.345 262.281 672.958 343.276 794.158 445.85 C 908.096 542.385 1003.19 659.173 1074.62 790.312 C 1143.61 470.852 1445.67 217.247 1772.25 204.599 C 1830.15 200.226 1888.29 209.211 1942.17 230.862 C 1990.61 254.246 2032.79 288.812 2065.25 331.708 C 2204.49 506.346 2211.92 761.408 2124.78 966.993 C 2037.47 1173.01 1883.53 1342.6 1705.08 1485.28"
		);
		ctx.stroke(path);
		ctx.clip(path);

		this.drawCard(
			this.images[4],
			{
				rotate: 5,
				width: 1000,
				height: 800,
			},
			(cardCenterLeft) => {
				ctx.drawImage(
					cardCenterLeft,
					-cardCenterLeft.width * 0.1,
					(height - cardCenterLeft.height) / 3
				);
				this.callback();
			}
		);

		this.drawCard(this.images[0], { rotate: 20 }, (cardTopLeft) => {
			ctx.drawImage(cardTopLeft, -cardTopLeft.width * 0.1, 0);
			this.callback();
		});

		this.drawCard(
			this.images[6],
			{ rotate: 1, width: 1000, height: 800 },
			(cardBottomLeft) => {
				ctx.save();
				ctx.globalCompositeOperation = "destination-over";
				ctx.drawImage(
					cardBottomLeft,
					cardBottomLeft.width * 0.05,
					height - cardBottomLeft.height * 1.5
				);
				ctx.restore()
				this.callback();
			}
		);

		this.drawCard(
			this.images[5],
			{ rotate: -2, width: 1000, height: 1000 },
			(cardBottomRight) => {
				ctx.drawImage(
					cardBottomRight,
					width - cardBottomRight.width * 0.9,
					height - cardBottomRight.height * 1.26
				);
				this.callback();
			}
		);

		this.drawCard(
			this.images[1],
			{
				rotate: -5,
				width: 1000,
				height: 1000,
			},
			(cardTopCenter) => {
				ctx.drawImage(
					cardTopCenter,
					(width - cardTopCenter.width) / 1.8,
					cardTopCenter.height * 0.63
				);
				this.callback();
			}
		);

		this.drawCard(
			this.images[7],
			{
				rotate: -5,
				width: 1200,
				height: 900,
			},
			(cardBottomCenter) => {
				ctx.save();
				ctx.globalCompositeOperation = "destination-over";
				ctx.drawImage(
					cardBottomCenter,
					(width - cardBottomCenter.width) / 1.6,
					height - cardBottomCenter.height * 0.9
				);
				ctx.restore();
				this.callback();
			}
		);

		this.drawCard(
			this.images[3],
			{
				rotate: -1,
				width: 1200,
				height: 1300,
			},
			(cardCenterRight) => {
				ctx.save();
				ctx.globalCompositeOperation = "destination-over";
				ctx.drawImage(
					cardCenterRight,
					width - cardCenterRight.width * 0.7,
					-cardCenterRight.height * 0.05
				);
				ctx.restore();
				this.callback();
			}
		);

		this.drawCard(
			this.images[2],
			{ rotate: -5, width: 1100, height: 1000 },
			(cardTopRight) => {
				ctx.drawImage(
					cardTopRight,
					width - cardTopRight.width * 1.5,
					-cardTopRight.height * 0.12
				);
				this.callback();
			}
		);
	}
}

export default HeartTemplate;
