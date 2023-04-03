import React, { useEffect, useRef, useState } from "react";
import useDataSchema from "../hooks/useDataSchema";
import staticImages from "../staticImages";
import ComponentFields from "./tokens/ComponentFields";
import {
	loadImageFromUrl,
	resizeImage,
	resizeToAspectRatio,
	showPreview,
} from "./utils";

function getClock(source, { date, colors, showNumbers }) {
	function drawFace(ctx, radius) {
		ctx.beginPath();
		ctx.arc(0, 0, radius * 0.04, 0, 2 * Math.PI);
		ctx.fillStyle = colors.dot;
		ctx.fill();
	}

	function drawNumbers(ctx, radius) {
		var ang;
		var num;

		const fontScale = 0.1;
		const spacingScale = 1 - fontScale;

		ctx.fillStyle = colors.numbers;
		ctx.font = radius * fontScale + "px arial";
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		for (num = 1; num < 13; num++) {
			ang = (num * Math.PI) / 6;
			ctx.rotate(ang);
			ctx.translate(0, -radius * spacingScale);
			ctx.rotate(-ang);
			ctx.fillText(num.toString(), 0, 0);
			ctx.rotate(ang);
			ctx.translate(0, radius * spacingScale);
			ctx.rotate(-ang);
		}
	}

	function drawTime(ctx, radius) {
		var now = new Date(date);
		var hour = now.getHours();
		var minute = now.getMinutes();
		var second = now.getSeconds();

		hour = hour % 12;
		hour =
			(hour * Math.PI) / 6 +
			(minute * Math.PI) / (6 * 60) +
			(second * Math.PI) / (360 * 60);
		drawHand(ctx, hour, radius * 0.45, radius * 0.025, colors.hour);

		minute = (minute * Math.PI) / 30 + (second * Math.PI) / (30 * 60);
		drawHand(ctx, minute, radius * 0.8, radius * 0.025, colors.minute);

		second = (second * Math.PI) / 30;
		drawHand(ctx, second, radius * 0.85, radius * 0.01, colors.second);
	}

	function drawHand(ctx, pos, length, width, color) {
		ctx.strokeStyle = color;
		ctx.beginPath();
		ctx.lineWidth = width;
		ctx.lineCap = "round";
		ctx.moveTo(0, 0);
		ctx.rotate(pos);
		ctx.lineTo(0, -length);
		ctx.stroke();
		ctx.rotate(-pos);
	}

	const canvas = document.createElement("canvas");
	const size = Math.min(source.width, source.height);
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext("2d");
	let radius = size / 2;
	ctx.translate(radius, radius);
	// radius *= 0.9;
	if (showNumbers) drawNumbers(ctx, radius);
	drawTime(ctx, radius);
	drawFace(ctx, radius);

	return canvas;
}
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

const shapeMap = {
	tallRect: [900, 1000],
	rect: [1000, 900],
	square: [1000, 1000],
	circle: [1000, 1000, 2000],
};

class ClockWidgetDrawer {
	temperature = 72;
	background = "#333";
	color = "#fff";
	constructor() {
		const canvas = document.createElement("canvas");
		canvas.width = 1000;
		canvas.height = 1000;
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}

	async draw(userProps = {}) {
		const [width, height, cornerRadius = 90] = shapeMap[userProps.shape];
		const props = structuredClone({
			...userProps,
			width,
			height,
			cornerRadius,
		});
		const colorProps = colorMap[props.theme || "dark"] || colorMap.dark;
		Object.keys(colorProps).forEach((key) => {
			if (!props[key]) props[key] = colorProps[key];
		});

		Object.assign(this, props);

		this.canvas.width = props.width;
		this.canvas.height = props.height;

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		if (props.image) this.img = await loadImageFromUrl(props.image);
		else this.img = null;

		return this.drawImage();
	}

	async drawImage() {
		const width = this.canvas.width;
		const height = this.canvas.height;
		const ctx = this.ctx;
		const shadowSpread = 5;

		ctx.save();
		ctx.roundRect(
			shadowSpread,
			shadowSpread,
			width - shadowSpread * 2,
			height - shadowSpread * 2,
			this.cornerRadius
		);
		ctx.fillStyle = "transparent"; // this.backgroundColor;

		ctx.shadowColor = "rgba(0,0,0,0.2)";
		ctx.shadowBlur = shadowSpread;
		ctx.shadowOffsetX = 0.8;
		ctx.shadowOffsetY = 0.8;
		ctx.fill();
		ctx.restore();
		ctx.clip();

		if (this.img) {
			const img = resizeToAspectRatio(this.img, width / height);
			ctx.drawImage(resizeImage(img, { width, height }), 0, 0);
		}

		// const text = "09:34";
		// const fontSize = 180;
		// ctx.fillStyle = this.textColor || this.color;
		// ctx.font = `bold ${fontSize}px Helvetica`;
		// const metrics = ctx.measureText(text);
		// ctx.fillText(
		// 	text,
		// 	(width - metrics.width) / 2,
		// 	(height - fontSize) / 2
		// );

		const date = new Date();
		date.setHours(this.time.hour);
		date.setMinutes(this.time.minutes);
		date.setSeconds(this.time.seconds);

		const clock = getClock(this.canvas, {
			date,
			colors: this.colors,
			showNumbers:
				["square", "circle"].includes(this.shape) && this.showNumbers,
		});
		ctx.drawImage(
			clock,
			(width - clock.width) / 2,
			(height - clock.height) / 2
		);

		const res = this.canvas.toDataURL();
		showPreview(res);

		return res;
	}
}

export default function ClockWidgetComponent() {
	const previewRef = useRef(null);
	const clockWidgetDrawerRef = useRef((data) => {
		if (!window.clockWidgetDrawer)
			window.clockWidgetDrawer = new ClockWidgetDrawer();

		window.clockWidgetDrawer.draw(data).then(setUrl);
	});
	const [url, setUrl] = useState();
	const [data, updateField] = useDataSchema(
		{
			shape: "circle",
			image: staticImages.presets.clock,
			showNumbers: true,
			time: {
				hour: 14,
				minutes: 50,
				seconds: 40,
			},
			colors: {
				numbers: "#fff9b8",
				hour: "#fff6d6",
				minute: "#59d1d9",
				second: "#ffbc47",
				dot: "#ddd1a6",
			},
		},
		clockWidgetDrawerRef.current
	);

	useEffect(() => {
		clockWidgetDrawerRef.current(data);

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
				<ComponentFields
					schema={{
						shape: {
							type: "tag",
							choices: ["tallRect", "rect", "square", "circle"],
						},
						image: {
							type: "image",
							optional: true,
						},
						showNumbers: {
							type: "boolean",
							show: (state) =>
								["square", "circle"].includes(state.shape),
						},
						time: {
							type: "section",
							children: {
								hour: {
									type: "number",
									inline: true,
									meta: {
										min: 0,
										max: 24,
										className: "inline-number-field",
									},
								},
								minutes: {
									type: "number",
									inline: true,
									meta: {
										min: 0,
										max: 60,
										className: "inline-number-field",
									},
								},
								seconds: {
									type: "number",
									inline: true,
									meta: {
										min: 0,
										max: 60,
										className: "inline-number-field",
									},
								},
							},
						},
						colors: {
							type: "section",
							children: {
								numbers: {
									type: "color",
									inline: true,
									meta: {
										colors: ["#fff9b8"],
										showIndicator: false,
									},
								},
								hour: {
									type: "color",
									inline: true,
									meta: {
										colors: ["#fff6d6"],
										showIndicator: false,
									},
								},
								minute: {
									type: "color",
									inline: true,
									meta: {
										colors: ["#59d1d9"],
										showIndicator: false,
									},
								},
								second: {
									type: "color",
									inline: true,
									meta: {
										colors: ["#ffbc47"],
										showIndicator: false,
									},
								},
								dot: {
									type: "color",
									inline: true,
									meta: {
										colors: ["#ddd1a6"],
										showIndicator: false,
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
