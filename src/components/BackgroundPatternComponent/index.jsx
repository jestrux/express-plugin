import React, { useEffect, useRef, useState } from "react";
import useDataSchema from "../../hooks/useDataSchema";
import ComponentFields from "../tokens/ComponentFields";
import { showPreview, tinyColor } from "../utils";
import * as icons from "./icons";

class PatternEffect {
	constructor({ shape, style, color, effect }) {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		this.ctx = ctx;

		this.color = color;
		const icon = icons[shape];

		canvas.width = icon.width * 5;
		canvas.height = icon.height * 4;

		ctx.fillStyle = color;
		const path = new Path2D(
			icon[style == "filled" ? "filledPath" : "path"]
		);
		ctx.translate(icon.width * 0.35, icon.height * 0.5);
		ctx.fill(path);

		if (effect != "none") this[`${effect}Effect`]();

		ctx.translate(icon.width * 2.5, icon.height * 2);
		ctx.fill(path);

		return ctx.createPattern(canvas, "repeat");
	}

	contrastEffect() {
		this.ctx.globalAlpha = 0.3;
	}

	complementEffect() {
		const color = new tinyColor(this.color).complement(); //.spin(-90);
		this.ctx.fillStyle = color;
		this.ctx.globalAlpha = 0.3;
	}

	analogousEffect() {
		const color = new tinyColor(this.color).analogous().filter((color) => {
			return !tinyColor.equals(this.color, color);
		})[0];

		this.ctx.fillStyle = color;
	}

	triadEffect() {
		const color = new tinyColor(this.color).triad().filter((color) => {
			return !tinyColor.equals(this.color, color);
		})[0];

		this.ctx.fillStyle = color;
	}

	tetradEffect() {
		const color = new tinyColor(this.color).tetrad().filter((color) => {
			return !tinyColor.equals(this.color, color);
		})[0];

		this.ctx.fillStyle = color;
	}

	// monochromaticEffect() {
	// 	const color = new tinyColor(this.color)
	// 		.monochromatic()
	// 		.filter((color) => {
	// 			return !tinyColor.equals(this.color, color);
	// 		})[5];

	// 	this.ctx.fillStyle = color;
	// }

	splitcomplementEffect() {
		const color = new tinyColor(this.color)
			.splitcomplement()
			.filter((color) => {
				return !tinyColor.equals(this.color, color);
			})[0];

		this.ctx.fillStyle = color;
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

	async draw(props = {}) {
		Object.assign(this, props);

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		return this.drawImage();
	}

	async drawImage() {
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
		});
		ctx.fillRect(0, 0, width, height);

		const res = this.canvas.toDataURL();

		showPreview(res);

		return res;
	}
}

export default function BackgroundPatternComponent() {
	const previewRef = useRef(null);
	const backgroundPatternDrawerRef = useRef((data) => {
		if (!window.backgroundPatternDrawer)
			window.backgroundPatternDrawer = new BackgroundPatternDrawer();

		window.backgroundPatternDrawer.draw(data).then(setUrl);
	});
	const [url, setUrl] = useState();
	const [data, updateField] = useDataSchema(
		{
			shape: "heart",
			style: "outline",
			// background: "#e0f2ff",
			color: "#ac1f40",
			effect: "splitcomplement",
		},
		backgroundPatternDrawerRef.current
	);

	useEffect(() => {
		backgroundPatternDrawerRef.current(data);

		window.AddOnSdk?.app.enableDragToDocument(previewRef.current, {
			previewCallback: (element) => {
				return new URL(element.src);
			},
			completionCallback: exportImage,
		});
	}, []);

	const exportImage = async (e) => {
		const fromDrag = e?.target?.nodeName != "IMG";
		const blob = await fetch(previewRef.current.src).then((response) =>
			response.blob()
		);

		if (fromDrag) return [{ blob }];
		else window.AddOnSdk?.app.document.addImage(blob);
	};

	return (
		<>
			<div
				className="relative relative border-b flex center-center p-3"
				style={{ display: !url ? "none" : "" }}
			>
				<div className="image-item relative" draggable="true">
					<img
						onClick={exportImage}
						ref={previewRef}
						className="drag-target max-w-full"
						src={url}
						style={{ maxHeight: "20vh" }}
					/>
				</div>
			</div>

			<div className="px-12px mt-1">
				<ComponentFields
					schema={{
						shape: {
							type: "tag",
							choices: [
								"heart",
								"star",
								"triangle",
								{ label: "Music Note", value: "music" },
								"circle",
							],
						},
						style: {
							type: "radio",
							label: "Shape style",
							inline: true,
							choices: ["outline", "filled"],
						},
						effect: {
							type: "tag",
							label: "Scatter effect",
							choices: [
								"none",
								"contrast",
								{
									label: "Color shift",
									value: "splitcomplement",
								},
								// "complement",
								// "triad",
								// "tetrad",
								// // "monochromatic",
								// "splitcomplement",
								// "analogous",
							],
						},
						background: {
							optional: true,
							type: "color",
							// inline: true,
							defaultValue: "#e0f2ff",
							meta: {
								singleChoice: true,
								choiceSize: 30,
							},
						},
						color: {
							type: "color",
							inline: true,
							meta: {
								singleChoice: true,
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
