import React from "react";
import useDataSchema from "../../hooks/useDataSchema";
import staticImages from "../../staticImages";
import ComponentFields from "../tokens/ComponentFields";
import { resizeImage, showPreview } from "../utils";
import * as icons from "./icons";
import DraggableImage from "../tokens/DraggableImage";

const themes = [
	// light:
	{ backgroundColor: "#ffffff", textColor: "#54bef0", iconColor: "#333333" },
	// dark:
	{ backgroundColor: "#333333", textColor: "#7aff90", iconColor: "#ffffff" },
	// brown:
	{ backgroundColor: "#FFEEE6", textColor: "#DD693E", iconColor: "#AD450D" },
	// brown:
	{ backgroundColor: "#E0F5D9", textColor: "#449049", iconColor: "#33492F" },
	// blue:
	{ backgroundColor: "#d6f2ff", textColor: "#55bef0", iconColor: "#FFFFFF" },
];

class WeatherWidgetDrawer {
	temperature = 72;
	background = "#333";
	color = "#fff";
	constructor() {
		const canvas = document.createElement("canvas");
		canvas.width = 1000;
		canvas.height = 800;
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}

	draw(userProps = {}) {
		const props = structuredClone({ ...userProps, ...userProps.colors });

		Object.assign(this, {
			...props,
		});

		this.icon = icons[props.icon];

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		return this.drawImage();
	}

	getIcon() {
		const { width, height, paths } = this.icon || {};
		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext("2d");

		paths.forEach(({ path, color }) => {
			ctx.fillStyle = color || this.iconColor || this.color;
			ctx.fill(new Path2D(path));
		});

		return canvas;
	}

	drawImage() {
		const width = this.canvas.width;
		const height = this.canvas.height;
		const ctx = this.ctx;

		const rx = width / 6;
		const ry = height / 2;
		ctx.save();
		ctx.translate(rx, ry);
		ctx.rotate((45 * Math.PI) / 180);
		ctx.translate(-rx, -ry);
		ctx.roundRect(
			rx,
			-ry / 2 - (height * 1) / 10,
			width / 2,
			(height * 11) / 10.25,
			2000
		);
		ctx.fillStyle = this.backgroundColor;

		const shadowSpread = 5;
		ctx.shadowColor = "rgba(0,0,0,0.2)";
		ctx.shadowBlur = shadowSpread;
		ctx.shadowOffsetX = 0.8;
		ctx.shadowOffsetY = 0.8;
		ctx.fill();
		ctx.restore();

		const icon = resizeImage(this.getIcon(), {
			width: 300,
			height: 300,
		});
		const [offsetX, offsetY] = this.icon.offset || [60, -20];
		ctx.drawImage(icon, rx + 20 + offsetX, ry - 20 + offsetY);

		const text = `${this.temperature}°`;
		ctx.fillStyle = this.textColor || this.color;
		ctx.font = "bold 180px Helvetica";
		const metrics = ctx.measureText(text);
		ctx.fillText(text, rx * 4 - metrics.width / 2 - 30, ry / 2 + 120);

		const res = this.canvas.toDataURL();
		showPreview(res);

		return res;
	}
}

export default function WeatherWidgetComponent() {
	const [data, updateField] = useDataSchema({
		src: staticImages.presets.spotify,
		colors: themes[1],
		temperature: "72",
		icon: "partlyCloudyRain",
	});

	return (
		<>
			<div className="px-12px mt-1">
				<ComponentFields
					schema={{
						// temperature: {
						// 	type: "number",
						// 	inline: true,
						// 	meta: {
						// 		min: -120,
						// 		max: 120,
						// 		className: "inline-number-field",
						// 	},
						// },
						colors: {
							label: "Theme",
							type: "swatch",
							meta: { themes },
							noMargin: true,
							wrapperProps: {
								className: "pb-2",
							}
						},
						widgetPicker: {
							type: "grid",
							label: "",
							hint: "Click or drag and drop widget to add to your canvas",
							choices: Object.keys(icons),
							noBorder: true,
							meta: {
								columns: 2,
								// aspectRatio: "2/0.8",
								render(weather) {
									const temperatureMap = {
										clearNight: 40,
										partlyCloudy: 32,
										partlyCloudyRain: 18,
										rainyNight: 13,
										snow: -20,
										sunny: 72,
										windySnow: -5,
									};

									const url = new WeatherWidgetDrawer().draw({
										...data,
										icon: weather,
										temperature: temperatureMap[weather],
									});
									return (
										<DraggableImage
											className="p-3 h-full max-w-full object-fit"
											src={url}
											style={{
												objectFit: "contain",
												filter: "drop-shadow(0.5px 0.1px 0.9px rgba(0, 0, 0, 0.3))",
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
