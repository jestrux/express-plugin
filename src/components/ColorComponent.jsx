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

		const fold = this.fold;
		const colors = [...Object.values(this.colors)];
		const height = 150; //Math.min(150, 1000 / colors.length);
		const strokeWidth = Math.max(15, height * 0.15);
		const lineWidth = this.stroke ? strokeWidth : 0;
		const sliceGap = !fold ? strokeWidth : 2;
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
			this.paletteStyle == "strip" ? 20 + sliceGap * 2 : referenceHeight;
		const sliceWidth = (referenceHeight * 9) / 10;
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
		ctx.lineWidth = this.paletteStyle == "strip" ? 0 : lineWidth;
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
				this.paletteStyle != "strip" &&
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
		const refWidth = 1000;
		this.canvas.width = refWidth;
		if (this.cardSize == "regular") this.canvas.height = refWidth * 1.27;
		else this.canvas.height = refWidth * 1.8;

		const inset = 20;
		const fontSize = refWidth / 8;
		const shadowOffset = fontSize / 4;
		const textInset = inset + shadowOffset + shadowOffset;
		const cornerRadius = textInset / 4;
		const canvas = document.createElement("canvas");
		canvas.width = this.canvas.width;
		canvas.height = this.canvas.height;
		const width = this.canvas.width - inset * 2;
		const height = this.canvas.height - inset * 2;
		const ctx = canvas.getContext("2d");

		ctx.save();
		ctx.fillStyle = "white";
		ctx.strokeStyle = "white";
		ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
		ctx.shadowBlur = shadowOffset / 2;
		ctx.shadowOffsetX = 0.5;
		ctx.shadowOffsetY = 0.5;

		ctx.roundRect(
			shadowOffset,
			shadowOffset,
			width - shadowOffset,
			height - shadowOffset,
			cornerRadius
		);
		ctx.fill();
		ctx.lineWidth = inset;
		// ctx.stroke();
		ctx.restore();
		ctx.clip();

		ctx.fillStyle = "#fff";
		ctx.fillRect(inset, inset, width, height);

		if (this.showColorCode) {
			if (this.showColorName) {
				ctx.fillStyle = this.color;
				ctx.beginPath();
				ctx.roundRect(
					shadowOffset,
					shadowOffset,
					width - shadowOffset,
					height - inset * 2 - fontSize * 2 - shadowOffset,
					[cornerRadius, cornerRadius, 0, 0]
				);
				ctx.fill();

				ctx.fillStyle = "#777";
				ctx.letterSpacing = "0.12em";
				ctx.font = `500 ${fontSize / 1.7}px Helvetica`;
				ctx.fillText(
					getColorName(this.color).toUpperCase(),
					textInset,
					height - 7 - fontSize * 1.4
				);

				ctx.fillStyle = "#000";
				ctx.font = `500 ${fontSize / 1.3}px Helvetica`;
				ctx.fillText(
					this.color.toUpperCase(),
					textInset,
					height - fontSize / 1.7
				);
			} else {
				ctx.fillStyle = this.color;
				ctx.beginPath();
				ctx.roundRect(
					inset * 1.5,
					inset * 1.5,
					width - shadowOffset,
					height - inset * 3 - fontSize * 1.1 - shadowOffset,
					[cornerRadius, cornerRadius, 0, 0]
				);
				ctx.fill();

				ctx.fillStyle = "#000";
				ctx.letterSpacing = "0.12em";
				ctx.font = `500 ${fontSize / 1.3}px Helvetica`;
				ctx.fillText(
					this.color.toUpperCase(),
					textInset,
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
				textInset,
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
			if (this.paletteStyle == "circles") this.circularColorPalette();
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
			// type: "Color palette",
			type: "Single color",
			// paletteStyle: "regular",
			paletteStyle: "circles",
			colorType: "card",
			color: "#9A136F",
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
			fold: true,
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
				style={{ display: !url ? "none" : "", height: "20vh" }}
			>
				<img
					draggable
					onClick={exportImage}
					ref={previewRef}
					className="drag-target max-h-full max-w-full"
					src={url}
				/>
			</div>

			<div className="px-12px mt-1">
				<ComponentFields
					schema={{
						type: {
							type: "card",
							// label: "",
							choices: [
								"Single color",
								{ label: "Palette", value: "Color palette" },
							],
							// noMargin: true,
							// noBorder: true,
							meta: {
								renderChoice(value) {
									return value == "Single color" ? (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 1000 1000"
										>
											<path
												fill="#1cf297"
												d="M0 0h1000v1000H0z"
												data-name="Rectangle 16"
											/>
											<g
												fill="#fff"
												stroke="#fff"
												stroke-width="5"
												data-name="Rectangle 14"
												transform="translate(292 227)"
											>
												<rect
													width="417"
													height="547"
													stroke="none"
													rx="12"
												/>
												<rect
													width="412"
													height="542"
													x="2.5"
													y="2.5"
													fill="none"
													rx="9.5"
												/>
											</g>
											<g
												fill="#9a136f"
												stroke="rgba(255,255,255,0)"
												stroke-width="30"
												data-name="Rectangle 15"
											>
												<path
													stroke="none"
													d="M304 227h393a12 12 0 0 1 12 12v431H292V239a12 12 0 0 1 12-12Z"
												/>
												<path
													fill="none"
													d="M310 242h381a3 3 0 0 1 3 3v410H307V245a3 3 0 0 1 3-3Z"
												/>
											</g>
										</svg>
									) : (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 1000 1000"
										>
											<path
												fill="#4462e2"
												d="M0 0h1000v1000H0z"
												data-name="Rectangle 13"
											/>
											<g
												fill="#7ace4f"
												stroke="#fff"
												stroke-width="30"
												data-name="Ellipse 2"
												transform="translate(101 264)"
											>
												<circle
													cx="236.5"
													cy="236.5"
													r="236.5"
													stroke="none"
												/>
												<circle
													cx="236.5"
													cy="236.5"
													r="221.5"
													fill="none"
												/>
											</g>
											<g
												fill="#febf00"
												stroke="#fff"
												stroke-width="30"
												data-name="Ellipse 2"
												transform="translate(252 264)"
											>
												<circle
													cx="236.5"
													cy="236.5"
													r="236.5"
													stroke="none"
												/>
												<circle
													cx="236.5"
													cy="236.5"
													r="221.5"
													fill="none"
												/>
											</g>
											<g
												fill="#f67e00"
												stroke="#fff"
												stroke-width="30"
												data-name="Ellipse 2"
												transform="translate(426 264)"
											>
												<circle
													cx="236.5"
													cy="236.5"
													r="236.5"
													stroke="none"
												/>
												<circle
													cx="236.5"
													cy="236.5"
													r="221.5"
													fill="none"
												/>
											</g>
										</svg>
									);
								},
							},
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
										show: () => false,
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
												// showColorCode: "boolean",
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
									paletteStyle: {
										type: "card",
										// inline: true,
										choices: [
											"regular",
											"strip",
											"circles",
										],
										meta: {
											// transparent: true,
											renderChoice(value) {
												if (value == "circles") {
													return (
														<svg
															xmlns="http://www.w3.org/2000/svg"
															viewBox="0 0 1000 1000"
														>
															<path
																fill="rgba(68,98,226,0)"
																d="M0 0h1000v1000H0z"
																data-name="Rectangle 17"
															/>
															<g
																fill="none"
																stroke="#4b4b4b"
																stroke-width="30"
																data-name="Ellipse 3"
																transform="translate(138 258)"
															>
																<ellipse
																	cx="241.5"
																	cy="242.5"
																	stroke="none"
																	rx="241.5"
																	ry="242.5"
																/>
																<ellipse
																	cx="241.5"
																	cy="242.5"
																	rx="226.5"
																	ry="227.5"
																/>
															</g>
															<g
																fill="none"
																stroke="#4b4b4b"
																stroke-width="30"
																data-name="Ellipse 4"
																transform="translate(381 258)"
															>
																<ellipse
																	cx="241.5"
																	cy="242.5"
																	stroke="none"
																	rx="241.5"
																	ry="242.5"
																/>
																<ellipse
																	cx="241.5"
																	cy="242.5"
																	rx="226.5"
																	ry="227.5"
																/>
															</g>
														</svg>
													);
												}

												if (value == "regular") {
													return (
														<svg
															xmlns="http://www.w3.org/2000/svg"
															viewBox="0 0 1000 1000"
														>
															<path
																fill="rgba(151,170,248,0)"
																d="M0 0h1000v1000H0z"
																data-name="Rectangle 18"
															/>
															<g
																fill="rgba(255,255,255,0)"
																stroke="#0d0d0d"
																stroke-width="20"
																data-name="Rectangle 19"
															>
																<path
																	stroke="none"
																	d="M188 332h155v336H188a30 30 0 0 1-30-30V362a30 30 0 0 1 30-30Z"
																/>
																<path
																	fill="none"
																	d="M188 342h145v316H188a20 20 0 0 1-20-20V362a20 20 0 0 1 20-20Z"
																/>
															</g>
															<g
																fill="rgba(255,255,255,0)"
																stroke="#0d0d0d"
																stroke-width="20"
																data-name="Rectangle 19"
															>
																<path
																	stroke="none"
																	d="M324 332h185v336H324z"
																/>
																<path
																	fill="none"
																	d="M334 342h165v316H334z"
																/>
															</g>
															<g
																fill="rgba(255,255,255,0)"
																stroke="#0d0d0d"
																stroke-width="20"
																data-name="Rectangle 19"
															>
																<path
																	stroke="none"
																	d="M491 332h185v336H491z"
																/>
																<path
																	fill="none"
																	d="M501 342h165v316H501z"
																/>
															</g>
															<g
																fill="rgba(255,255,255,0)"
																stroke="#0d0d0d"
																stroke-width="20"
																data-name="Rectangle 19"
															>
																<path
																	stroke="none"
																	d="M657 332h155a30 30 0 0 1 30 30v276a30 30 0 0 1-30 30H657V332Z"
																/>
																<path
																	fill="none"
																	d="M667 342h145a20 20 0 0 1 20 20v276a20 20 0 0 1-20 20H667V342Z"
																/>
															</g>
														</svg>
													);
												}

												if (value == "strip") {
													return (
														<svg
															xmlns="http://www.w3.org/2000/svg"
															viewBox="0 0 1000 1000"
														>
															<path
																fill="rgba(151,170,248,0)"
																d="M0 0h1000v1000H0z"
																data-name="Rectangle 20"
															/>
															<g
																fill="#6f7070"
																data-name="Group 18"
															>
																<path
																	d="M660 466h170a30 30 0 0 1 30 30v8a30 30 0 0 1-30 30H660v-68Z"
																	data-name="Rectangle 24"
																/>
																<path
																	d="M420 466h200v68H420z"
																	data-name="Rectangle 22"
																/>
																<path
																	d="M210 466h170v68H210a30 30 0 0 1-30-30v-8a30 30 0 0 1 30-30Z"
																	data-name="Rectangle 21"
																/>
															</g>
														</svg>
													);
												}
											},
										},
									},
									stroke: {
										type: "boolean",
										// show: (data) =>
										// 	data.paletteStyle == "regular",
									},
									roundedCorners: {
										type: "radio",
										show: (data) => false,
										// data.paletteStyle != "circles",
										choices: [
											{ value: false, label: "none" },
											"regular",
											"full",
										],
									},
									fold: "boolean",
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
