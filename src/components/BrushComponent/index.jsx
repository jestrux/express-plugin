import React, { useEffect, useRef, useState } from "react";
import useDataSchema from "../../hooks/useDataSchema";
import staticImages from "../../staticImages";
import ComponentFields from "../tokens/ComponentFields";
import { backgroundSpec, solidGradientBg } from "../utils";
import * as brushes from "./brushes";
import DraggableImage from "../tokens/DraggableImage";

class BrushDrawer {
	constructor() {
		const canvas = document.createElement("canvas");
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}

	draw(props = {}) {
		Object.assign(this, props);

		this.brushName = props.brush;
		this.brush = brushes[props.brush];

		this.canvas.width = this.brush.width;
		this.canvas.height = this.brush.height;

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		return this.drawImage();
	}

	drawImage() {
		const ctx = this.ctx;
		const width = this.canvas.width;
		const height = this.canvas.height;
		ctx.fillStyle = solidGradientBg(this.canvas, this.background);

		const p = new Path2D(this.brush.path);
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

			let fontSize = width / 8;
			ctx.font = `bold ${fontSize}px ${fontFamily}`;

			while (ctx.measureText(text).width > width - 180) {
				fontSize -= 5;
				ctx.font = `bold ${fontSize}px ${fontFamily}`;
			}

			const metrics = ctx.measureText(text);
			let margin = 30;
			if (this.brushName == "edgy") margin = 20;
			if (this.brushName == "fishy") margin = -10;
			if (this.brushName == "ruff") margin = 20;

			ctx.fillText(
				text,
				(width - metrics.width) / 2,
				(fontSize + height) / 2 - margin
			);
		}

		return this.canvas.toDataURL();
	}
}

export default function BrushComponent() {
	const [data, updateField] = useDataSchema({
		src: staticImages.presets.cylinder,
		text: {
			label: "",
			color: "#FFFFFF",
			font: "serif",
		},
		background: {
			type: "gradient",
			color: "#995533",
			gradient: ["#9055FF", "#13E2DA"],
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
						brushPicker: {
							type: "grid",
							label: "",
							hint: "Click or drag and drop a brush to add it to your canvas",
							choices: Object.keys(brushes),
							noBorder: true,
							meta: {
								columns: 2,
								render(brush) {
									const url = new BrushDrawer().draw({
										...data,
										brush,
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
