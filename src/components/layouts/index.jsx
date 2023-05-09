import ReactDOM from "react-dom";
import React, { useEffect, useRef, useState } from "react";
import useDataSchema from "../../hooks/useDataSchema";
import ComponentFields from "../tokens/ComponentFields";
import { backgroundSpec, loadImageFromUrl, showPreview } from "../utils";
import staticImages from "../../staticImages";
import { solidGradientBg } from "../utils";
import ScatteredTemplate from "./scattered";
import OvalTemplate from "./oval";
import MasonryTemplate from "./masonry";
import HoneyCombTemplate from "./honeycomb";
import StackTemplate from "./stack";
import HeartTemplate from "./heart";
import DraggableImage from "../tokens/DraggableImage";
import InfoCard from "../tokens/InfoCard";
import useImage from "../../hooks/useImage";
import Loader from "../tokens/Loader";

const templateMap = {
	stack: StackTemplate,
	scattered: ScatteredTemplate,
	oval: OvalTemplate,
	masonry: MasonryTemplate,
	honeycomb: HoneyCombTemplate,
	heart: HeartTemplate,
};

class LayoutsComponentDrawer {
	constructor(appCallback) {
		const canvas = document.createElement("canvas");
		this.canvas = canvas;
		canvas.width = 2200;
		canvas.height = 2200;
		this.templateCanvases = {};
		this.appCallback = appCallback;

		this.ctx = canvas.getContext("2d");
	}

	callback = () => {
		const width = this.canvas.width;
		const height = this.canvas.height;

		if (this.background) {
			ctx.fillStyle = solidGradientBg(this.canvas, this.background);
			ctx.fillRect(0, 0, width, height);
		}

		ctx.drawImage(canvas, 0, 0);

		if (this.text) {
			setTimeout(() => {
				const fontSize = width * 0.055;
				const text = this.text.label;
				const textColor = this.text.color;

				ctx.save();
				ctx.letterSpacing = "0.12em";
				ctx.font = `500 ${fontSize}px theFont`;

				text.split("\\n").forEach((text, index) => {
					text = text.trim();
					const metrics = ctx.measureText(text);
					let x = (width - metrics.width) / 2;
					let y = (height - fontSize) / 2 + fontSize * 1.8 * index;

					if (this.template == "stack") {
						const inset = height * 0.05;
						x = inset;
						y -= inset;
					}

					ctx.fillStyle = this.text.highlight;
					ctx.fillRect(
						x - 30,
						y - fontSize - 15,
						metrics.width + 60,
						fontSize * 1.6
					);

					ctx.fillStyle = textColor;
					ctx.fillText(text, x, y);
				});

				const url = this.canvas.toDataURL();
				showPreview(url);
				this.appCallback(url);
				ctx.restore();
			});
		}

		const url = this.canvas.toDataURL();
		showPreview(url);
		this.appCallback(url);
	};

	async loadFont() {
		if (this.fontLoaded) return;

		const font = new FontFace("theFont", `url('static/fonts/1.ttf')`);
		await font.load();

		document.fonts.add(font);

		this.fontLoaded = true;
	}

	draw(props = {}) {
		Object.assign(this, props);
		const canvas = this.canvas;

		if (this.background) {
			this.ctx.fillStyle = solidGradientBg(this.canvas, this.background);
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		}

		const layout = new templateMap[this.template]({
			canvas,
			callback: this.callback,
			images: this.images,
		}).draw();

		this.ctx.drawImage(layout, 0, 0);

		const res = canvas.toDataURL();

		showPreview(res);

		return res;
	}
}

export default function LayoutsComponent() {
	const {
		changed,
		images,
		loading,
		picker: Picker,
	} = useImage(staticImages.templatePictures);
	const [data, updateField] = useDataSchema({ aspectRatio: "square" });

	return (
		<>
			{!changed && (
				<InfoCard infoIcon>
					Default images are royalty free, sourced from Unsplash
				</InfoCard>
			)}

			<Picker />

			<div className="px-12px mt-1">
				<ComponentFields
					schema={{
						template: {
							show: () => false,
							type: "card",
							choices: [
								// "oval",
								"heart",
								"scattered",
								// "stack",
								// "masonry",
								"honeycomb",
							],
							meta: {
								transparent: true,
								renderChoice(layout) {
									if (layout == "honeycomb") {
										return (
											<div className="h-full flex items-center">
												<svg
													id="honeycomb"
													className=""
													viewBox="0 0 2454 1517"
													fill="#aaa"
												>
													<path d="M667.5,0,890,349,667.5,698h-445L0,349,222.5,0Z" />
													<path d="M 746.5 819 L 969 1168 L 746.5 1517 L 301.5 1517 L 79 1168 L 301.5 819 Z" />
													<path d="M 2175.5 819 L 2398 1168 L 2175.5 1517 L 1730.5 1517 L 1508 1168 L 1730.5 819 Z" />
													<path d="M 2231.5 7 L 2454 356 L 2231.5 705 L 1786.5 705 L 1564 356 L 1786.5 7 Z" />
													<path d="M 1445 387 L 1662 729 L 1445 1071 L 1011 1071 L 794 729 L 1011 387 Z" />
												</svg>
											</div>
										);
									}

									if (layout == "scattered") {
										return (
											<svg
												className="pl-1 h-full"
												fill="#aaa"
												viewBox="0 0 1688.568 1735.795"
											>
												<path d="M 430.609 245.374 L 1293.2 30.305 L 1446.1 643.532 L 583.504 858.605 Z" />
												<path d="M 127.724 933.889 L 695.598 1034.73 L 600.079 1703.26 L 32.2037 1602.43 Z" />
												<path d="M 922.483 1027.4 L 1583.44 993.521 L 1608.37 1466.54 L 947.414 1500.42 Z" />
											</svg>
										);
									}

									return (
										<svg
											className="p-1"
											viewBox="0 0 2200 2200"
											fill="#aaa"
										>
											<path d="M 1705.02 1485.24 C 1445.79 1695.42 1131.93 1802.08 857.412 1996.48 C 765.157 1706.98 567.523 1569.29 349.372 1374.77 C 57.414 1114.44 -225.259 400.599 360.264 291.362 C 516.345 262.281 672.958 343.276 794.158 445.85 C 908.096 542.385 1003.19 659.173 1074.62 790.312 C 1143.61 470.852 1445.67 217.247 1772.25 204.599 C 1830.15 200.226 1888.29 209.211 1942.17 230.862 C 1990.61 254.246 2032.79 288.812 2065.25 331.708 C 2204.49 506.346 2211.92 761.408 2124.78 966.993 C 2037.47 1173.01 1883.53 1342.6 1705.08 1485.28" />
										</svg>
									);
								},
							},
						},
						aspectRatio: {
							show: () => false,
							type: "card",
							choices: ["landscape", "portrait", "square"],
							meta: {
								// transparent: "true",
								renderChoice(aspectRatio) {
									return (
										<div className="p-1 w-full h-full flex center-center">
											<div
												className="w-full h-full"
												style={{
													background: "#999",
													borderRadius: "2px",
													width: [
														"square",
														"landscape",
													].includes(aspectRatio)
														? "80%"
														: "50%",
													height: [
														"square",
														"portrait",
													].includes(aspectRatio)
														? "80%"
														: "50%",
												}}
											></div>
										</div>
									);
								},
							},
						},
						background: backgroundSpec({
							show: () => false,
							optional: true,
							defaultType: "gradient",
							colorProps: {
								defaultValue: "#A5292A",
							},
							gradientProps: {
								defaultValue: ["#FFD4A2", "#ECE6FF"],
							},
						}),
						picker: {
							type: "grid",
							label: "",
							noBorder: true,
							hint: "Click or drag and drop to add layout to canvas",
							choices: ["heart", "scattered", "honeycomb"],
							meta: {
								// transparent: true,
								columns: 1,
								aspectRatio: "2/1.4",
								render(template) {
									if (!images || loading)
										return <Loader fillParent={true} />;

									const url =
										new LayoutsComponentDrawer().draw({
											...data,
											images,
											template,
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
						// text: {
						// 	type: "section",
						// 	optional: true,
						// 	children: {
						// 		label: {
						// 			label: "",
						// 			noMargin: true,
						// 			defaultValue: "Fun Summer\\n ~ 2023 ~ ",
						// 			meta: {
						// 				className: "mt-2 mb-1",
						// 			},
						// 		},
						// 		color: {
						// 			label: "Text color",
						// 			type: "color",
						// 			defaultValue: "#5258E4",
						// 			inline: true,
						// 			meta: {
						// 				colors: [
						// 					"#FFFFFF",
						// 					"#000000",
						// 					"#5258E4",
						// 				],
						// 			},
						// 		},
						// 		highlight: {
						// 			label: "Highlight color",
						// 			type: "color",
						// 			defaultValue: "#FFFFFF",
						// 			inline: true,
						// 			meta: {
						// 				showTransparent: true,
						// 				colors: [
						// 					"#FFFFFF",
						// 					"#000000",
						// 					"#5258E4",
						// 				],
						// 			},
						// 		},
						// 	},
						// },
					}}
					onChange={updateField}
					data={data}
				/>
			</div>
		</>
	);
}
