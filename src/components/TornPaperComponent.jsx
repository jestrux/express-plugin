import React, { useRef } from "react";
import useDataSchema from "../hooks/useDataSchema";
import staticImages from "../staticImages";
import ComponentFields from "./tokens/ComponentFields";
import InfoCard from "./tokens/InfoCard";
import DraggableImage from "./tokens/DraggableImage";
import useImage from "../hooks/useImage";
import { backgroundSpec, showPreview, solidGradientBg } from "./utils";

class TornPaperDrawer {
	cornerRadius = 20;
	constructor() {
		const canvas = document.createElement("canvas");
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}

	cropToFit(canvas, aspectRatio) {
		const inputWidth = canvas.width;
		const inputHeight = canvas.height;
		const inputImageAspectRatio = inputWidth / inputHeight;
		let outputWidth = inputWidth;
		let outputHeight = inputHeight;
		if (inputImageAspectRatio > aspectRatio)
			outputWidth = inputHeight * aspectRatio;
		else if (inputImageAspectRatio < aspectRatio)
			outputHeight = inputWidth / aspectRatio;

		const outputImage = document.createElement("canvas");
		outputImage.width = outputWidth;
		outputImage.height = outputHeight;

		const ctx = outputImage.getContext("2d");
		ctx.drawImage(canvas, 0, 0);

		return outputImage;
	}

	getPath(canvas, img) {
		const { width, height } = img;
		canvas.width = width;
		canvas.height = height;

		const randX = () => (Math.floor(Math.random() * 7.5) / 100) * width;
		const randY = () =>
			((Math.floor(Math.random() * 5) + 95) / 100) * height;

		let points = this.cropPoints;

		if (!points) {
			points = [];
			let lastX = 0;
			while (lastX <= width) {
				lastX = lastX + randX();
				points.push([lastX, randY()]);
			}

			this.cropPoints = points;
		}

		const path = new Path2D();
		path.moveTo(0, 0);
		path.lineTo(0, randY() * this.cropPercent);

		const closingPoints = [
			[width, this.cornerRadius],
			[width - this.cornerRadius, 0, width, 0],
			[this.cornerRadius, 0],
			[0, this.cornerRadius, 0, 0],
		];

		[...points, ...closingPoints].forEach(([x, y, qx, qy]) => {
			if (qx != undefined) path.quadraticCurveTo(qx, qy, x, y);
			else path.lineTo(x, y * this.cropPercent);
		});

		return path;
	}

	tornPaper(img) {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");

		ctx.clip(this.getPath(canvas, img));
		ctx.drawImage(img, 0, 0);
		ctx.restore();

		return canvas;
	}

	draw(props = {}) {
		if (props.img?.src != this.img?.src) this.cropPoints = null;

		if (props.img)
			this.cornerRadius =
				Math.max(props.img.height, props.img.width) * 0.015;

		Object.assign(this, props);

		return this.drawImage();
	}

	drawImage() {
		const paper = this.tornPaper(this.img);
		const ctx = this.ctx;
		const shadowInset = 15;
		const { width, height } = this.img;

		this.canvas.width = width;
		this.canvas.height = height * this.cropPercent;
		const padding = this.background?.padding ?? 0;
		const scale = 1 - padding;

		if (this.background) {
			ctx.fillStyle = solidGradientBg(this.canvas, this.background.color);

			ctx.beginPath();
			ctx.roundRect(
				0,
				0,
				this.canvas.width,
				this.canvas.height,
				this.cornerRadius * 1.2
			);
			ctx.closePath();
			ctx.fill();
			ctx.clip();
		} else {
			this.canvas.width += shadowInset * 2;
			this.canvas.height += shadowInset * 2;

			ctx.translate(shadowInset, shadowInset);
		}

		ctx.save();
		ctx.shadowColor = "rgba(0,0,0,0.16)";
		ctx.shadowBlur = shadowInset;
		ctx.shadowOffsetX = -0.5;
		ctx.shadowOffsetY = 2;

		const dx = width - paper.width * scale;
		const dy = height - paper.height * scale;

		ctx.drawImage(
			paper,
			dx / 2,
			(dy * this.cropPercent) / 2,
			paper.width * scale,
			paper.height * scale
		);

		ctx.restore();

		const res = this.canvas.toDataURL();
		showPreview(res);

		return res;
	}
}

export default function TornPaperComponent() {
	const drawerRef = useRef(new TornPaperDrawer());
	const {
		image: img,
		loading,
		picker: Picker,
		changed,
	} = useImage(staticImages.presets.clippedImage);
	const [data, updateField] = useDataSchema({
		cropPercent: 1,
		background: {
			padding: 0.06,
			color: backgroundSpec({
				defaultType: "gradient",
			}).defaultValue,
		},
	});

	const Preview = () => {
		const url =
			!img || loading
				? null
				: drawerRef.current.draw({
						...data,
						img,
				  });

		return (
			<DraggableImage
				wrapped
				info
				className="max-h-full w-full object-contain"
				src={url}
				style={{
					filter: "drop-shadow(0.5px 0.5px 0.5px rgba(0, 0, 0, 0.2))",
				}}
			/>
		);
	};

	return (
		<>
			{!changed && (
				<InfoCard infoIcon>
					Default image is a screenshot from The Verge and may be
					subject to copyright
				</InfoCard>
			)}

			<Preview />

			<Picker />

			<div className="px-12px mt-1 mb-4">
				<ComponentFields
					schema={{
						cropPercent: {
							label: "Clip distance from bottom",
							type: "range",
							meta: {
								min: 0.2,
								max: 1,
								step: 0.1,
							},
						},
						background: {
							type: "section",
							optional: true,
							collapsible: false,
							children: {
								padding: {
									inline: true,
									type: "radio",
									choices: [
										{ label: "SM", value: 0.03 },
										{ label: "MD", value: 0.06 },
										{ label: "LG", value: 0.09 },
										{ label: "XL", value: 0.135 },
									],
									defaultValue: 0.06,
								},
								color: backgroundSpec({
									defaultType: "gradient",
								}),
							},
						},
					}}
					onChange={updateField}
					data={data}
				/>
			</div>
		</>
	);
}
