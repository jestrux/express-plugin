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

		const [shape1, shape2] = Array.isArray(shape) ? shape : [shape];
		const icon1 = icons[shape1];
		const icon2 = icons[shape2 || shape1];

		canvas.width = (Number(icon1.width) + Number(icon2.width)) * 2.5;
		canvas.height = (Number(icon1.height) + Number(icon2.height)) * 2;

		ctx.fillStyle = color;
		ctx.fill(new Path2D(icon1.path));

		ctx.translate(
			Number(icon1.width) + Number(icon2.width),
			Number(icon1.height) + Number(icon2.height)
		);

		if (effect != "none") this[`${effect}Effect`]();

		ctx.fill(new Path2D(icon2.path));

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
		spacing: "loose",
		color: "#ac1f40",
		multiple: false,
	});

	return (
		<>
			<div className="px-12px">
				<ComponentFields
					schema={{
						multiple: {
							type: "card",
							label: "Pattern shape",
							noMargin: true,
							noBorder: true,
							wrapperProps: {
								className: "pb-3",
							},
							choices: [
								{
									label: "Single shape",
									value: false,
								},
								{
									label: "Combined",
									value: true,
								},
							],
							meta: {
								renderChoice(choice) {
									return (
										<div
											className="h-full flex flex-col justify-between"
											style={{
												background: choice
													? "#ebd913"
													: "#379b98",
												color: choice
													? "#5d5501"
													: "#caf1f0",
												padding: "0.3rem",
											}}
										>
											{(!choice
												? ["paw", "paw"]
												: ["heart", "heartAlt"]
											).map((icon, index) => {
												// "#379b98",
												// "#f25629",
												// "#ebd913",
												// "#ed2232",
												const { width, height, path } =
													icons[icon];

												return (
													<svg
														key={index}
														fill="currentColor"
														xmlns="http://www.w3.org/2000/svg"
														viewBox={`0 0 ${width} ${height}`}
														width="45%"
														style={{
															marginLeft:
																index == 1
																	? "auto"
																	: "",
														}}
													>
														<path d={path} />
													</svg>
												);
											})}
										</div>
									);
								},
							},
						},
						shape: {
							type: "tag",
							// label: data.multiple ? "Shapes" : "Shape",
							label: "",
							noMargin: true,
							noBorder: true,
							wrapperProps: {
								className: "pb-1 flex flex-col",
							},
							hint: {
								type: "info",
								text: data.multiple
									? "Select any two shapes to make a pattern"
									: "Select a shape to make a pattern",
							},
							choices: [
								"star",
								"starAlt",
								"paw",
								"heart",
								"heartAlt",
								"flower",
								"music",
								"musicAlt",
								"bird",
								// "triangle",
								// "square",
								// "circle",
							],
							meta: {
								multiple: data.multiple,
								maxSelections: 2,
								icon(icon) {
									const { width, height, path } = icons[icon];

									return (
										<svg
											fill="currentColor"
											xmlns="http://www.w3.org/2000/svg"
											viewBox={`0 0 ${width} ${height}`}
										>
											<path d={path} />
										</svg>
									);
								},
							},
						},
						color: {
							type: "color",
							label: "Pattern color",
							noMargin: true,
							// inline: true,
							wrapperProps: {
								className: "-mx-12px px-12px pb-2 mb-1",
							},
							meta: {
								singleChoice: true,
								choiceSize: 30,
							},
						},
						picker: {
							type: "grid",
							label: "",
							noBorder: true,
							hint: "Click or drag and drop a pattern to add it to your canvas",
							choices: [
								"filled none",
								"filled splitcomplement",
								"filled contrast",
							],
							meta: {
								columns: 1,
								aspectRatio: "2/1",
								gap: "1rem",
								render(entry) {
									const [style, effect, spacing = "loose"] =
										entry.split(" ");

									const url =
										new BackgroundPatternDrawer().draw({
											...data,
											style,
											effect,
											spacing,
										});

									return (
										<DraggableImage
											className="p-3 h-full max-w-full object-fit"
											src={url}
											style={{
												objectFit: "contain",
												filter: "drop-shadow(0.1px 0.1px 0.1px rgba(0, 0, 0, 0.55))",
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
