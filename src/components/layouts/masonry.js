// https://pbs.twimg.com/media/FttCpp1aAAA4UaY?format=jpg&name=large
import { loadImageFromUrl, resizeImage, resizeToAspectRatio } from "../utils";

class MasonryTemplate {
	constructor({ canvas, callback, images }) {
		this.inset = 30;
		this.images = images;
		this.callback = callback;
		this.canvas = canvas;
		this.canvas.width = (this.canvas.height * 16) / 9;
		this.ctx = canvas.getContext("2d");

		callback();
	}

	drawCard(img, userOptions, callback) {
		const userOptionsIsCallback = typeof userOptions == "function";
		if (userOptionsIsCallback) callback = userOptions;

		const { inset, width, height } = {
			width: this.canvas.width / 2.5,
			height: this.canvas.height / 2,
			inset: this.inset,
			...(!userOptions || userOptionsIsCallback ? {} : userOptions),
		};

		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext("2d");

		const innerWidth = width - inset * 2;
		const innerHeight = height - inset * 2 - 60;

		ctx.drawImage(
			resizeImage(resizeToAspectRatio(img, innerWidth / innerHeight), {
				width: innerWidth,
				height: innerHeight,
			}),
			inset * 1.5,
			inset * 1.5
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
				ctx.drawImage(
					cardTopLeft,
					-cardTopLeft.width / 4,
					height / 2 - cardTopLeft.height + this.inset
				);
				this.callback();
			}
		);

		this.drawCard(
			this.images[5],
			{ height: height / 1.5 },
			(cardBottomLeft) => {
				ctx.drawImage(
					cardBottomLeft,
					-cardBottomLeft.width / 4,
					height / 2 - this.inset
				);
				this.callback();
			}
		);

		this.drawCard(this.images[1], {}, (cardTopCenter) => {
			ctx.drawImage(
				cardTopCenter,
				(width - cardTopCenter.width) / 2,
				-cardTopCenter.height * 0.44
			);
			this.callback();
		});

		this.drawCard(this.images[3], {}, (cardCenterCenter) => {
			ctx.drawImage(
				cardCenterCenter,
				(width - cardCenterCenter.width) / 2,
				(height - cardCenterCenter.height) / 2
			);
			this.callback();
		});

		this.drawCard(this.images[6], {}, (cardBottomCenter) => {
			ctx.drawImage(
				cardBottomCenter,
				(width - cardBottomCenter.width) / 2,
				height / 2 + cardBottomCenter.height / 2.2
			);
			this.callback();
		});

		this.drawCard(
			this.images[2],
			{ height: height / 1.6 },
			(cardTopRight) => {
				ctx.drawImage(
					cardTopRight,
					width - (cardTopRight.width * 3) / 4,
					-cardTopRight.height / 1.53
				);
				this.callback();
			}
		);

		this.drawCard(
			this.images[4],
			{ height: height / 1.6 },
			(cardCenterRight) => {
				ctx.drawImage(
					cardCenterRight,
					width - (cardCenterRight.width * 3) / 4,
					(height - cardCenterRight.height) / 2
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
					width - (cardBottomRight.width * 3) / 4,
					height / 2 + cardBottomRight.height / 2.2
				);
				this.callback();
			}
		);
	}
}

export default MasonryTemplate;
