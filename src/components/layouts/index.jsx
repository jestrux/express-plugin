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

const templateMap = {
	scattered: ScatteredTemplate,
	oval: OvalTemplate,
	masonry: MasonryTemplate,
};

class LayoutsComponentDrawer {
	constructor(callback) {
		const canvas = document.createElement("canvas");
		this.canvas = canvas;
		canvas.width = 2200;
		canvas.height = 2200;
		this.templateCanvases = {};

		this.ctx = canvas.getContext("2d");

		this.callback = () => {
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
					const fontSize = width * 0.06;
					const text = this.text.label;
					const textColor = this.text.color;

					ctx.save();
					ctx.letterSpacing = "0.12em";
					ctx.font = `500 ${fontSize}px theFont`;

					text.split("\\n").forEach((text, index) => {
						text = text.trim();
						const metrics = ctx.measureText(text);
						const x = (width - metrics.width) / 2;
						const y =
							(height - fontSize) / 2 + fontSize * 1.8 * index;

						ctx.fillStyle = "#fff";
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
					callback(url);
					ctx.restore();
				});
			}

			const url = this.canvas.toDataURL();
			showPreview(url);
			callback(url);
		};
	}

	async loadFont() {
		if (this.fontLoaded) return;

		const font = new FontFace("theFont", `url('static/fonts/1.ttf')`);
		await font.load();

		document.fonts.add(font);

		this.fontLoaded = true;
	}

	async draw(props = {}) {
		const templateChanged =
			!this.template || this.template != props.template;
		const imagesChanged =
			!this.images || this.images.join("") != props.images.join("");

		Object.assign(this, props);

		await this.loadFont();

		if (imagesChanged) {
			this.imagesElements = await Promise.all(
				this.images.map(loadImageFromUrl)
			);
		}

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		return this.drawImage({ templateChanged, imagesChanged });
	}

	drawImage({ templateChanged, imagesChanged }) {
		if (templateChanged) {
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
			} else if (imagesChanged) {
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
	const previewRef = useRef(null);
	const layoutsComponentDrawerRef = useRef((data) => {
		if (!window.layoutsComponentDrawer)
			window.layoutsComponentDrawer = new LayoutsComponentDrawer(
				(url) => {
					ReactDOM.flushSync(() => {
						setUrl(url);
					});
				}
			);

		window.layoutsComponentDrawer.draw(data); //.then(setUrl);
	});
	const [url, setUrl] = useState();
	const [data, updateField] = useDataSchema(
		{
			background: {
				type: "gradient",
				color: "#A5292A",
				gradient: ["#FFD4A2", "#ECE6FF"],
			},
			template: "scattered",
			images: staticImages.templatePictures,
			imagess: [
				staticImages.presets.clock,
				staticImages.presets.cylinder,
				staticImages.presets.frame,
				staticImages.presets.polaroid,
				staticImages.presets.spotify,
				staticImages.presets.calendar,
				staticImages.flowers,
				staticImages.flowers2,
			],
		},
		layoutsComponentDrawerRef.current
	);

	useEffect(() => {
		if (initialRef.current) return;
		initialRef.current = true;

		layoutsComponentDrawerRef.current(data);

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
						template: {
							type: "tag",
							choices: ["oval", "scattered", "masonry"],
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
						text: {
							type: "section",
							optional: true,
							children: {
								label: {
									label: "",
									noMargin: true,
									defaultValue: "Fun Summer\\n ~ 2023 ~ ",
									meta: {
										className:
											"mt-2 mb-1 w-full py-2 px-2 border border-dark-gray rounded-xs",
									},
								},
								color: {
									label: "",
									type: "color",
									defaultValue: "#5258e4",
									meta: {
										choiceSize: 30,
										singleChoice: true,
									},
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
