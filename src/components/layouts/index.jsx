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
		const canvas = this.templateCanvases[this.template];
		const width = canvas.width;
		const height = canvas.height;
		const ctx = this.ctx;

		this.canvas.height = height;
		this.canvas.width = width;

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

	async draw(props = {}) {
		if (!props.images) return;

		const templateChanged =
			!this.template || this.template != props.template;
		const imagesChanged =
			!this.images || this.images.join("") != props.images.join("");
		// const imagesChanged = props.imagesChanged;

		Object.assign(this, props);

		await this.loadFont();

		if (imagesChanged) {
			this.templateCanvases = {};
			this.imagesElements = await Promise.all(
				// this.images.map(() => this.canvas)
				this.images.map(loadImageFromUrl)
			);
		}

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		return this.drawImage({
			templateChanged,
			imagesChanged,
		});
	}

	drawImage({ templateChanged, imagesChanged }) {
		if (templateChanged || imagesChanged) {
			let canvas = this.templateCanvases[this.template];

			if (!canvas) {
				canvas = document.createElement("canvas");
				canvas.width = 2200;
				canvas.height = 2200;

				this.templateCanvases[this.template] = canvas;

				new templateMap[this.template]({
					canvas,
					callback: this.callback,
					images: this.imagesElements,
				}).draw();

				return;
			}

			if (imagesChanged) {
				new templateMap[this.template]({
					canvas,
					callback: this.callback,
					images: this.imagesElements,
				}).draw();

				return;
			}
		}

		setTimeout(() => {
			this.callback();
		});
	}
}

export default function LayoutsComponent() {
	const initialRef = useRef(null);
	const layoutsComponentDrawerRef = useRef((data) => {
		if (!window.layoutsComponentDrawer)
			window.layoutsComponentDrawer = new LayoutsComponentDrawer(
				(url) => {
					ReactDOM.flushSync(() => {
						setUrl(url);
					});
				}
			);

		window.layoutsComponentDrawer.draw(data);
	});
	const [imagesChanged, setImagesChanged] = useState(false);
	const [url, setUrl] = useState();
	const [data, updateField] = useDataSchema(
		{
			// background: {
			// 	type: "gradient",
			// 	color: "#A5292A",
			// 	gradient: ["#FFD4A2", "#ECE6FF"],
			// },
			template: "heart",
			images: staticImages.templatePictures,
		},
		layoutsComponentDrawerRef.current
	);

	const handleUpdateField = (key, value) => {
		if (key == "images") setImagesChanged(true);
		updateField(key, value);
	};

	useEffect(() => {
		if (initialRef.current) return;
		initialRef.current = true;

		layoutsComponentDrawerRef.current(data);

		return () => (window.layoutsComponentDrawer = null);
	}, []);

	return (
		<>
			{!imagesChanged && (
				<InfoCard infoIcon>
					Default images are royalty free, sourced from Unsplash
				</InfoCard>
			)}

			<DraggableImage info wrapped src={url} />

			<div className="px-12px mt-1">
				<ComponentFields
					schema={{
						images: {
							type: "image",
							label: "",
							meta: {
								multiple: true,
							},
						},
						template: {
							type: "card",
							choices: [
								// "oval",
								"scattered",
								"heart",
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
						background: backgroundSpec({
							optional: true,
							defaultType: "gradient",
							colorProps: {
								defaultValue: "#A5292A",
							},
							gradientProps: {
								defaultValue: ["#FFD4A2", "#ECE6FF"],
							},
						}),
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
					onChange={handleUpdateField}
					data={data}
				/>
			</div>
		</>
	);
}
