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

	useEffect(() => {
		if (initialRef.current) return;
		initialRef.current = true;

		layoutsComponentDrawerRef.current(data);

		return () => (window.layoutsComponentDrawer = null);
	}, []);

	return (
		<>
			<InfoCard infoIcon>
				Default images are royalty free, sourced from Unsplash
			</InfoCard>

			<DraggableImage info wrapped src={url} />

			<div className="px-12px mt-1">
				<ComponentFields
					schema={{
						images: {
							type: "image",
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
						},
						// background: backgroundSpec({
						// 	optional: true,
						// 	defaultType: "gradient",
						// 	colorProps: {
						// 		defaultValue: "#A5292A",
						// 	},
						// 	gradientProps: {
						// 		defaultValue: ["#FFD4A2", "#ECE6FF"],
						// 	},
						// }),
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
