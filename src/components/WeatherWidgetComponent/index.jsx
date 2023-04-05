import React, { useEffect, useRef, useState } from "react";
import useDataSchema from "../../hooks/useDataSchema";
import staticImages from "../../staticImages";
import ComponentFields from "../tokens/ComponentFields";
import {
	backgroundSpec,
	loadImage,
	loadImageFromUrl,
	resizeImage,
	showPreview,
	solidGradientBg,
} from "../utils";
import * as icons from "./icons";

const colorMap = {
	light: {
		backgroundColor: "#fff",
		textColor: "#333",
		iconColor: "#333",
	},
	dark: {
		backgroundColor: "#333",
		textColor: "#fff",
		iconColor: "#fff",
	},
	yellow: {
		backgroundColor: "#fff6d6",
		textColor: "#fc0",
		iconColor: "#c1b78f",
	},
	green: {
		backgroundColor: "#ebffee",
		textColor: "#83d891",
		iconColor: "#93b899",
	},
	blue: {
		backgroundColor: "#d6f2ff",
		textColor: "#55bef0",
		iconColor: "#93b6c8",
	},
};

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

	async draw(userProps = {}) {
		const props = structuredClone({ ...userProps });
		const colorProps = colorMap[props.theme || "dark"] || colorMap.dark;
		Object.keys(colorProps).forEach((key) => {
			if (!props[key]) props[key] = colorProps[key];
		});

		Object.assign(this, { ...colorProps, ...props });

		this.icon = icons[props.icon];

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// this.img = await loadImageFromUrl(props.src);

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

	async drawImage() {
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
	const previewRef = useRef(null);
	const weatherWidgetDrawerRef = useRef((data) => {
		if (!window.weatherWidgetDrawer)
			window.weatherWidgetDrawer = new WeatherWidgetDrawer();

		window.weatherWidgetDrawer.draw(data).then(setUrl);
	});
	const [url, setUrl] = useState();
	const [data, updateField] = useDataSchema(
		{
			src: staticImages.presets.spotify,
			theme: "dark",
			temperature: "72",
			icon: "partlyCloudyRain",
			// iconColor: "#93b899", // #93b6c8
			textColor: "#7aff90",
			// background: "#ebffee", // #d6f2ff
		},
		weatherWidgetDrawerRef.current
	);

	useEffect(() => {
		weatherWidgetDrawerRef.current(data);

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

			<div className="px-12px mt-2">
				{/* <div className="my-4">
					<ImagePicker onChange={(src) => updateField("src", src)} />
				</div> */}

				<ComponentFields
					schema={{
						theme: {
							type: "tag",
							choices: Object.keys(colorMap),
						},
						temperature: {
							type: "number",
							inline: true,
							meta: {
								min: -120,
								max: 120,
								className: "inline-number-field",
							},
						},
						icon: {
							type: "tag",
							choices: Object.keys(icons),
						},
						backgroundColor: {
							type: "color",
							optional: true,
							meta: {
								colors: ["#fff6d6", "#ebffee", "#d6f2ff"],
							},
						},
						textColor: {
							type: "color",
							optional: true,
							meta: {
								colors: ["#fc0", "#83d891", "#55bef0"],
							},
						},
						iconColor: {
							type: "color",
							optional: true,
							meta: {
								colors: ["#c1b78f", "#93b899", "#93b6c8"],
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
