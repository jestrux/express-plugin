import React, { useEffect, useRef, useState } from "react";
import useDataSchema from "../hooks/useDataSchema";
import ComponentFields from "./tokens/ComponentFields";
import { showPreview } from "./utils";
import getColorName from "./utils/get-color-name";

class ColorComponentDrawer {
	constructor() {
		const canvas = document.createElement("canvas");
		this.canvas = canvas;
		canvas.width = 1000;
		canvas.height = 1000;
		this.ctx = canvas.getContext("2d");
	}

	async draw(props = {}) {
		Object.assign(this, props);

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		return this.drawImage();
	}

	colorCirlce() {
		this.canvas.width = 1000;
		this.canvas.height = 1000;

		const width = this.canvas.width;
		const height = this.canvas.height;
		const ctx = this.ctx;

		ctx.fillStyle = this.color || "transparent";
		// ctx.fillStyle = "#fff";
		ctx.strokeStyle = "#fff";
		ctx.shadowColor = "rgba(0,0,0,0.15)";
		ctx.shadowBlur = 10;
		ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = 2;
		ctx.lineWidth = width * 0.05;

		const radius = width / 2;
		ctx.arc(radius, radius, radius * 0.9, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();
	}

	// https://dribbble.com/shots/14216897-Hospitall-Color-Exploration-1
	circularColorPalette() {
		const canvas = this.canvas;
		const ctx = this.ctx;

		const fold = this.spacing == "fold";
		const colors = [...Object.values(this.colors)];
		const height = 150; //Math.min(150, 1000 / colors.length);
		const strokeWidth = Math.max(15, height * 0.15);
		const lineWidth = this.stroke ? strokeWidth : 0;
		const sliceGap = this.spacing == "regular" ? strokeWidth : 2;
		const radius = height / 2;
		const width = fold
			? colors.length * (radius + sliceGap) + radius
			: colors.length * (height + sliceGap) - sliceGap;
		canvas.height = height + strokeWidth;
		canvas.width = width + strokeWidth;

		ctx.strokeStyle = "#fff";
		ctx.shadowColor = "rgba(0,0,0,0.15)";
		ctx.shadowBlur = 10;
		ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = 2;
		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = "#fff";

		ctx.translate(strokeWidth / 2, strokeWidth / 2);

		colors.forEach((color, index) => {
			ctx.save();

			ctx.translate(((fold ? radius : height) + sliceGap) * index, 0);

			ctx.beginPath();
			ctx.fillStyle = color;
			ctx.arc(radius, radius, radius - lineWidth / 2, 0, 2 * Math.PI);
			ctx.stroke();
			ctx.fill();
			ctx.restore();
		});
	}

	colorPalette() {
		const ctx = this.ctx;
		const colors = [...Object.values(this.colors)];
		const referenceHeight = 250;
		const sliceGap = this.stroke ? Math.max(15, referenceHeight / 15) : 0;
		const height =
			this.paletteType == "strip" ? 20 + sliceGap * 2 : referenceHeight;
		const sliceWidth = (referenceHeight * 9) / 12;
		const width =
			(sliceWidth - sliceGap) * colors.length + sliceGap * colors.length;
		this.canvas.height = height;
		this.canvas.width = width;

		const fullyRounded = this.roundedCorners == "full";
		const cornerRadius = Math.max(20, height * 0.2);

		ctx.fillStyle = "#fff";

		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = "#fff";
		const lineWidth = sliceGap;
		ctx.strokeStyle = "#fff";
		ctx.shadowColor = "rgba(0,0,0,0.2)";
		ctx.shadowBlur = 8;
		ctx.shadowOffsetX = 1;
		ctx.shadowOffsetY = 1;
		ctx.lineWidth = this.paletteType == "strip" ? 0 : lineWidth;
		ctx.roundRect(
			lineWidth,
			lineWidth,
			width - lineWidth * 2,
			height - lineWidth * 2,
			this.roundedCorners
				? fullyRounded
					? 1000
					: cornerRadius * 0.99
				: 0
		);
		ctx.stroke();
		ctx.restore();
		ctx.fill();
		ctx.clip();

		ctx.roundRect(
			lineWidth,
			lineWidth,
			width - lineWidth * 2,
			height - lineWidth * 2,
			this.roundedCorners ? (fullyRounded ? 1000 : cornerRadius) : 0
		);

		colors.forEach((color, i) => {
			ctx.save();
			ctx.translate(sliceWidth * i + sliceGap / 2, 0);
			ctx.beginPath();
			ctx.fillStyle = color;
			ctx.roundRect(
				0,
				lineWidth,
				sliceWidth - sliceGap / 2,
				height - lineWidth * 2,
				this.paletteType != "strip" &&
					this.roundedCorners &&
					sliceGap > 5
					? 5
					: 0
			);
			ctx.fill();
			ctx.restore();
		});
	}

	// https://dribbble.com/shots/2586383-The-Museum-Playbook-Website-Color-Guide
	colorCard() {
		this.canvas.width = 200;
		if (this.cardSize == "regular") this.canvas.height = 250;
		else this.canvas.height = 370;

		const cornerRadius = 1;
		const inset = 5;
		const fontSize = 22;
		const canvas = document.createElement("canvas");
		canvas.width = this.canvas.width;
		canvas.height = this.canvas.height;
		const width = this.canvas.width - inset * 2;
		const height = this.canvas.height - inset * 2;
		const ctx = canvas.getContext("2d");

		ctx.save();
		const shadowOffset = 8;
		ctx.fillStyle = "white";
		ctx.strokeStyle = "white";
		ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
		ctx.shadowBlur = shadowOffset / 2;
		ctx.shadowOffsetX = 0.5;
		ctx.shadowOffsetY = 0.5;

		ctx.roundRect(
			inset,
			inset,
			width - shadowOffset,
			height - shadowOffset,
			cornerRadius
		);
		ctx.fill();
		ctx.lineWidth = inset;
		ctx.stroke();
		ctx.restore();
		ctx.clip();

		ctx.fillStyle = "#fff";
		ctx.fillRect(inset, inset, width, height);

		if (this.showColorCode) {
			if (this.showColorName) {
				ctx.fillStyle = this.color;
				ctx.beginPath();
				ctx.roundRect(
					inset * 1.5,
					inset * 1.5,
					width - shadowOffset - inset,
					height - inset * 2 - fontSize * 2 - shadowOffset,
					[cornerRadius, cornerRadius, 0, 0]
				);
				ctx.fill();

				ctx.fillStyle = "#777";
				ctx.letterSpacing = "0.12em";
				ctx.font = `500 ${fontSize / 1.7}px Helvetica`;
				ctx.fillText(
					getColorName(this.color).toUpperCase(),
					inset * 2.5,
					height - 7 - fontSize * 1.22
				);

				ctx.fillStyle = "#000";
				ctx.font = `300 ${fontSize / 1.3}px Helvetica`;
				ctx.fillText(
					this.color.toUpperCase(),
					inset * 2.5,
					height - fontSize / 1.8
				);
			} else {
				ctx.fillStyle = this.color;
				ctx.beginPath();
				ctx.roundRect(
					inset * 1.5,
					inset * 1.5,
					width - shadowOffset - inset,
					height - inset * 2 - 5 - fontSize - shadowOffset,
					[cornerRadius, cornerRadius, 0, 0]
				);
				ctx.fill();

				ctx.fillStyle = "#000";
				ctx.letterSpacing = "0.12em";
				ctx.font = `300 ${fontSize / 1.3}px Helvetica`;
				ctx.fillText(
					this.color.toUpperCase(),
					inset * 2.5,
					height - fontSize / 1.8
				);
			}
		} else if (this.showColorName) {
			ctx.fillStyle = this.color;
			ctx.beginPath();
			ctx.roundRect(
				inset * 1.5,
				inset * 1.5,
				width - shadowOffset - inset,
				height - inset * 2 - 5 - fontSize - shadowOffset,
				[cornerRadius, cornerRadius, 0, 0]
			);
			ctx.fill();

			ctx.fillStyle = "#777";
			ctx.letterSpacing = "0.12em";
			ctx.font = `500 ${fontSize / 1.7}px Helvetica`;
			ctx.fillText(
				getColorName(this.color).toUpperCase(),
				inset * 2.5,
				height - fontSize / 1.5
			);
		} else {
			ctx.fillStyle = this.color;
			ctx.beginPath();
			ctx.roundRect(
				inset * 1.5,
				inset * 1.5,
				width - shadowOffset - inset,
				height - inset - shadowOffset,
				cornerRadius
			);
			ctx.fill();
		}

		this.ctx.drawImage(canvas, inset, inset);
	}

	async drawImage() {
		if (this.type == "Color palette") {
			if (this.paletteType == "circles") this.circularColorPalette();
			else this.colorPalette();
		} else {
			if (this.colorType == "circle") this.colorCirlce();
			else this.colorCard();
		}

		const res = this.canvas.toDataURL();

		showPreview(res);

		return res;
	}
}

export default function ColorComponent() {
	const previewRef = useRef(null);
	const colorComponentDrawerRef = useRef((data) => {
		if (!window.colorComponentDrawer)
			window.colorComponentDrawer = new ColorComponentDrawer();

		window.colorComponentDrawer.draw(data).then(setUrl);
	});
	const [url, setUrl] = useState();
	const [data, updateField] = useDataSchema(
		{
			type: "Color palette",
			// type: "Single color",
			// paletteType: "regular",
			paletteType: "circles",
			colorType: "card",
			color: "#20AC3C",
			showColorCode: true,
			showColorName: true,
			cardSize: "regular",
			colors: [
				"#7ACE4F",
				"#FEBF00",
				"#F67E00",
				"#2E41DC",

				// "#FD4673",
				// "#F6D68C",
				// "#45B3A5",
				// "#2E6D92",
			],
			roundedCorners: false,
			stroke: true,
			// spacing: false,
			spacing: "fold",
		},
		colorComponentDrawerRef.current
	);

	useEffect(() => {
		colorComponentDrawerRef.current(data);

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
						type: {
							type: "tag",
							label: "",
							choices: ["Single color", "Color palette"],
							// noMargin: true,
							// noBorder: true,
						},
						color: {
							type: "color",
							// label: "",
							meta: {
								singleChoice: true,
								fullWidth: true,
								choiceSize: 30,
							},
							show: (state) => state.type == "Single color",
						},
						...(data.type == "Single color"
							? {
									colorType: {
										type: "radio",
										// label: "Type",
										inline: true,
										choices: ["circle", "card"],
									},
									...(data.colorType == "card"
										? {
												cardSize: {
													type: "radio",
													inline: true,
													choices: [
														"regular",
														"tall",
													],
												},
												showColorCode: "boolean",
												showColorName: "boolean",
										  }
										: {}),
							  }
							: {}),
						...(data.type == "Color palette"
							? {
									colors: {
										type: "swatch",
									},
									paletteType: {
										type: "radio",
										// inline: true,
										choices: [
											"regular",
											"strip",
											"circles",
										],
									},
									roundedCorners: {
										type: "radio",
										show: (data) =>
											data.paletteType != "circles",
										choices: [
											{ value: false, label: "none" },
											"regular",
											"full",
										],
									},
									spacing: {
										type: "radio",
										show: (data) =>
											data.paletteType == "circles",
										choices: [
											{ value: false, label: "none" },
											"regular",
											"fold",
										],
									},
									stroke: {
										type: "boolean",
										// show: (data) =>
										// 	data.paletteType == "regular",
									},
							  }
							: {}),
					}}
					onChange={updateField}
					data={data}
				/>
			</div>
		</>
	);
}
