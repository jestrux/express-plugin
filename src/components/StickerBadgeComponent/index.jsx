import React, { useEffect, useRef, useState } from "react";
import useDataSchema from "../../hooks/useDataSchema";
import staticImages from "../../staticImages";
import ComponentFields from "../tokens/ComponentFields";
import { backgroundSpec, solidGradientBg } from "../utils";
import * as stickers from "./stickers";
import DraggableImage from "../tokens/DraggableImage";

class StickerBadgeDrawer {
	constructor() {
		const canvas = document.createElement("canvas");
		canvas.width = 1000;
		canvas.height = 1000;
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}

	draw(props = {}) {
		Object.assign(this, props);

		this.sticker = stickers[props.sticker];

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		return this.drawImage();
	}

	drawImage() {
		const width = this.canvas.width;
		const height = this.canvas.height;
		const ctx = this.ctx;

		ctx.fillStyle = solidGradientBg(this.canvas, this.background);

		const p = new Path2D();
		p.addPath(new Path2D(this.sticker[0]));
		p.addPath(new Path2D(this.sticker[1]));
		ctx.fill(p);

		if (this.text) {
			const text = this.text.label;
			ctx.fillStyle = this.text.color;

			const fontFamily = {
				serif: "Georgia, serif",
				"sans serif":
					"Helvetica, 'Helvetica Neue', Verdana, sans-serif",
				script: "'Sacre Bleu MVB', fantasy, serif",
			}[this.text.font || "serif"];

			let fontSize = 200;
			ctx.font = `bold ${fontSize}px ${fontFamily}`;

			while (ctx.measureText(text).width > width - 300) {
				fontSize -= 5;
				ctx.font = `bold ${fontSize}px ${fontFamily}`;
			}

			const metrics = ctx.measureText(text);

			ctx.fillText(
				text,
				(width - metrics.width) / 2,
				(fontSize + height) / 2 - 20
			);
		}

		return this.canvas.toDataURL();
	}
}

export default function StickerBadgeComponent() {
	const [data, updateField] = useDataSchema({
		src: staticImages.presets.cylinder,
		sticker: "new",
		border: "transparent",
		text: {
			label: "",
			color: "#FFFFFF",
			font: "serif",
		},
		background: {
			type: "gradient",
			color: "#ff2e6d",
			gradient: ["#E233FF", "#FF6B00"],
		},
	});

	return (
		<>
			<div className="px-12px mt-1">
				<ComponentFields
					schema={{
						background: backgroundSpec(),
						text: {
							type: "section",
							collapsible: false,
							noMargin: true,
							children: {
								label: {
									label: "",
									noMargin: true,
									meta: {
										placeholder: "Enter text here...",
										className: "mb-1",
									},
								},
								color: {
									type: "color",
									inline: true,
									noMargin: true,
									meta: {
										singleChoice: true,
									},
								},
								font: {
									type: "radio",
									inline: true,
									choices: ["serif", "sans serif", "script"],
								},
							},
						},
						stickerPicker: {
							type: "grid",
							label: "",
							hint: "Click or drag and drop a sticker to add it to your canvas",
							choices: Object.keys(stickers),
							noBorder: true,
							meta: {
								columns: 2,
								render(sticker) {
									const url = new StickerBadgeDrawer().draw({
										...data,
										sticker,
									});

									return (
										<DraggableImage
											className="p-3 h-full max-w-full object-fit"
											src={url}
											style={{
												objectFit: "contain",
												filter: "drop-shadow(0.5px 0.5px 0.5px rgba(0, 0, 0, 0.4))",
											}}
										/>
									);
								},
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
