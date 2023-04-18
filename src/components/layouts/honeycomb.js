// https://ipf-website.s3.amazonaws.com/1600w-TAkc3vQu6rc-1.webp
import { loadImageFromUrl, resizeImage, resizeToAspectRatio } from "../utils";

class HoneyCombTemplate {
	constructor({ canvas, callback, images, hideCenterCard = false }) {
		this.inset = 60;
		this.images = images;
		this.callback = callback;
		this.canvas = canvas;
		this.hideCenterCard = hideCenterCard;
		this.canvas.width = (this.canvas.height * 16) / 9;
		this.ctx = canvas.getContext("2d");

		callback();
	}

	drawCard(img, userOptions, callback) {
		const userOptionsIsCallback = typeof userOptions == "function";
		if (userOptionsIsCallback) callback = userOptions;

		const { inset, width, height } = {
			width: this.canvas.width / 3,
			height: this.canvas.width / 3.5,
			inset: this.inset,
			// ...(!userOptions || userOptionsIsCallback ? {} : userOptions),
		};

		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext("2d");

		if (!img) return canvas;

		const innerWidth = width - inset * 2;
		const innerHeight = height - inset * 2 - 60;

		ctx.save();
		ctx.translate(0, 0);
		const dip = 250;
		ctx.beginPath();
		ctx.moveTo(dip, inset);
		ctx.lineTo(innerWidth - dip, inset);
		ctx.lineTo(innerWidth - inset / 1.5, innerHeight / 2);
		ctx.lineTo(innerWidth - dip, innerHeight);
		ctx.lineTo(dip, innerHeight);
		ctx.lineTo(inset, innerHeight / 2);
		ctx.closePath();
		ctx.restore();
		ctx.lineWidth = inset;

		ctx.strokeStyle = "#fff";
		ctx.lineJoin = "round";

		ctx.stroke();
		ctx.clip();

		ctx.drawImage(
			resizeImage(resizeToAspectRatio(img, innerWidth / innerHeight), {
				width: innerWidth,
				height: innerHeight,
			}),
			inset * 1.5,
			0
		);

		setTimeout(() => {
			callback(canvas);
		});
	}

	draw() {
		const width = this.canvas.width;
		const height = this.canvas.height;
		const ctx = this.ctx;

		this.drawCard(
			this.images[0],
			{
				height: height / 1.5,
			},
			(cardTopLeft) => {
				ctx.drawImage(cardTopLeft, this.inset * 2, this.inset);
				this.callback();
			}
		);

		this.drawCard(
			this.images[5],
			{ height: height / 1.5 },
			(cardBottomLeft) => {
				ctx.drawImage(cardBottomLeft, this.inset * 2, height / 2);
				this.callback();
			}
		);

		this.drawCard(
			this.images[1],
			{ height: height / 1.6 },
			(cardTopCenter) => {
				ctx.drawImage(
					cardTopCenter,
					(width - cardTopCenter.width) / 2,
					-cardTopCenter.height / 2
				);
				this.callback();
			}
		);

		if (!this.hideCenterCard) {
			this.drawCard(this.images[3], {}, (cardCenterCenter) => {
				ctx.drawImage(
					cardCenterCenter,
					(width - cardCenterCenter.width) / 2,
					(height - cardCenterCenter.height) / 2
				);
				this.callback();
			});
		}

		this.drawCard(
			this.images[6],
			{ height: height / 1.6 },
			(cardBottomCenter) => {
				ctx.drawImage(
					cardBottomCenter,
					(width - cardBottomCenter.width) / 2,
					height / 2 + cardBottomCenter.height / 2
				);
				this.callback();
			}
		);

		this.drawCard(
			this.images[2],
			{ height: height / 1.6 },
			(cardTopRight) => {
				ctx.drawImage(
					cardTopRight,
					width / 2 + cardTopRight.width / 2.2,
					this.inset
				);
				this.callback();
			}
		);

		this.drawCard(
			this.images[7],
			{ height: height / 1.6 },
			(cardBottomRight) => {
				ctx.drawImage(
					cardBottomRight,
					width / 2 + cardBottomRight.width / 2.5,
					height / 2
				);
				this.callback();
			}
		);
	}
}

export default HoneyCombTemplate;
