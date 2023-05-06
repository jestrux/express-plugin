import React, { useEffect, useRef, useState } from "react";
import useDataSchema from "../../hooks/useDataSchema";
import ComponentFields from "../tokens/ComponentFields";
import { showPreview, tinyColor } from "../utils";
import * as icons from "./icons";
import DraggableImage from "../tokens/DraggableImage";

class PatternEffect {
	constructor({ shape, style, color, effect, spacing }) {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		this.ctx = ctx;
		this.color = color;

		const icon = icons[shape];
		const path = new Path2D(icon.path);
		const lineWidth = 5;

		const fillPath = () => {
			if (style == "outline") {
				ctx.strokeStyle = color;
				ctx.lineWidth = lineWidth;
				ctx.stroke(path);
			} else {
				ctx.strokeStyle = color;
				ctx.fillStyle = color;
				ctx.fill(path);
			}
		};

		if (spacing == "loose") {
			canvas.width = icon.width * 5;
			canvas.height = icon.height * 4;

			fillPath();

			ctx.translate(icon.width * 2.5, icon.height * 2);
		} else if (spacing == "snug") {
			canvas.width = icon.width * 2;
			canvas.height = icon.height * 2;

			fillPath();

			ctx.translate(icon.width, icon.height);
		} else {
			canvas.width = icon.width * 2;
			canvas.height = icon.height;

			fillPath();

			ctx.translate(icon.width, 0);
		}

		if (effect != "none") this[`${effect}Effect`]();

		if (["outline", "alternate"].includes(style)) {
			ctx.lineWidth = lineWidth;
			ctx.stroke(path);
		} else ctx.fill(path);

		return ctx.createPattern(canvas, "repeat");
	}

	contrastEffect() {
		this.ctx.globalAlpha = 0.3;
	}

	complementEffect() {
		const color = new tinyColor(this.color).complement(); //.spin(-90);
		this.ctx.fillStyle = color;
		this.ctx.strokeStyle = color;
		this.ctx.globalAlpha = 0.3;
	}

	analogousEffect() {
		const color = new tinyColor(this.color).analogous().filter((color) => {
			return !tinyColor.equals(this.color, color);
		})[0];

		this.ctx.fillStyle = color;
		this.ctx.strokeStyle = color;
	}

	triadEffect() {
		const color = new tinyColor(this.color).triad().filter((color) => {
			return !tinyColor.equals(this.color, color);
		})[0];

		this.ctx.fillStyle = color;
		this.ctx.strokeStyle = color;
	}

	tetradEffect() {
		const color = new tinyColor(this.color).tetrad().filter((color) => {
			return !tinyColor.equals(this.color, color);
		})[0];

		this.ctx.fillStyle = color;
		this.ctx.strokeStyle = color;
	}

	// monochromaticEffect() {
	// 	const color = new tinyColor(this.color)
	// 		.monochromatic()
	// 		.filter((color) => {
	// 			return !tinyColor.equals(this.color, color);
	// 		})[5];

	// 	this.ctx.fillStyle = color;
	// 	this.ctx.strokeStyle = color;
	// }

	splitcomplementEffect() {
		const color = new tinyColor(this.color)
			.splitcomplement()
			.filter((color) => {
				return !tinyColor.equals(this.color, color);
			})[0];

		this.ctx.fillStyle = color;
		this.ctx.strokeStyle = color;
	}
}

class BackgroundPatternDrawer {
	constructor() {
		const canvas = document.createElement("canvas");
		this.canvas = canvas;
		canvas.width = 3840;
		canvas.height = 2080;
		this.ctx = canvas.getContext("2d");
	}

	draw(props = {}) {
		Object.assign(this, props);

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		return this.drawImage();
	}

	drawImage() {
		const width = this.canvas.width;
		const height = this.canvas.height;
		const ctx = this.ctx;

		ctx.fillStyle = this.background || "transparent";
		ctx.fillRect(0, 0, width, height);

		ctx.fillStyle = new PatternEffect({
			shape: this.shape,
			style: this.style,
			color: this.color,
			effect: this.effect,
			spacing: this.spacing,
		});
		ctx.fillRect(0, 0, width, height);

		const res = this.canvas.toDataURL();

		showPreview(res);

		return res;
	}
}

export default function BackgroundPatternComponent() {
	const [data, updateField] = useDataSchema({
		shape: "star",
		style: "alternate",
		spacing: "loose",
		color: "#ac1f40",
		effect: "none",
	});

	return (
		<>
			<div className="px-12px mt-1">
				<ComponentFields
					schema={{
						shape: {
							type: "tag",
							choices: [
								"heart",
								"star",
								"square",
								"triangle",
								{ label: "Music Note", value: "music" },
								"circle",
							],
						},
						color: {
							type: "color",
							meta: {
								singleChoice: true,
								choiceSize: 30,
							},
						},
						picker: {
							type: "grid",
							label: "",
							hint: "Click (or drag and drop) a pattern to add it to your canvas",
							choices: [
								"filled none",
								"alternate none",
								"filled contrast",
								// "alternate contrast",
								"filled splitcomplement",
								// "alternate splitcomplement",
							],
							meta: {
								columns: 1,
								aspectRatio: "2/1",
								gap: "1rem",
								render(entry) {
									const [style, effect] = entry.split(" ");

									const url =
										new BackgroundPatternDrawer().draw({
											...data,
											style,
											effect,
										});

									return (
										<DraggableImage
											className="p-3 h-full max-w-full object-fit"
											src={url}
											style={{
												objectFit: "contain",
												filter: "drop-shadow(0.5px 0.5px 0.5px rgba(0, 0, 0, 0.4))",
												transform: "scale(1.8)",
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
