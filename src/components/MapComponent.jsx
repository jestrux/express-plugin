import React, { useEffect, useRef, useState } from "react";
import useDataSchema from "../hooks/useDataSchema";
import ComponentFields from "./tokens/ComponentFields";
import { getGradientFill, showPreview } from "./utils";
import staticImages from "../staticImages";
import { loadImageFromUrl } from "./utils";
import { resizeImage } from "./utils";
import { resizeToAspectRatio } from "./utils";

class MapComponentDrawer {
	constructor() {
		const canvas = document.createElement("canvas");
		this.canvas = canvas;
		this.padding = 50;
		canvas.width = 1521.984 + this.padding * 2;
		canvas.height = 1093.548 + this.padding * 2;
		this.ctx = canvas.getContext("2d");
	}

	async draw(props = {}) {
		Object.assign(this, props);

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.img = await loadImageFromUrl(props.image);

		return this.drawImage();
	}

	getMarker() {
		const width = 180.886;
		const height = 230.162;

		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		canvas.width = width;
		canvas.height = height;
		const path = new Path2D(
			"M 81.623 210.616 L 82.356 211.035 L 82.649 211.203 C 85.0126 212.481 87.8614 212.481 90.225 211.203 L 90.518 211.046 L 91.262 210.616 C 95.36 208.186 99.3557 205.594 103.249 202.841 C 113.319 195.731 122.728 187.729 131.361 178.93 C 151.73 158.079 172.885 126.75 172.885 86.442 C 172.99 55.489 156.537 26.8422 129.749 11.3352 C 102.96 -4.17175 69.9248 -4.17175 43.1362 11.3352 C 16.3475 26.8422 -0.105278 55.489 2.79776e-14 86.442 C 2.84217e-14 126.742 21.165 158.079 41.524 178.93 C 50.1535 187.728 59.5582 195.731 69.624 202.841 C 73.5173 205.592 77.5173 208.184 81.624 210.616 Z M 86.443 117.876 C 99.157 117.876 110.619 110.217 115.484 98.471 C 120.35 86.7248 117.66 73.2044 108.67 64.2145 C 99.6796 55.2245 86.1591 52.5354 74.413 57.4011 C 62.667 62.2668 55.0086 73.729 55.009 86.443 C 55.0096 103.803 69.0829 117.876 86.443 117.876 Z"
		);

		ctx.fillStyle = getGradientFill(canvas);
		ctx.fill(path, "evenodd");

		ctx.strokeStyle = "#fff";
		ctx.shadowColor = "rgba(0,0,0,0.15)";
		ctx.shadowBlur = 10;
		ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = 2;
		ctx.lineWidth = 8;
		ctx.stroke(path);

		return canvas;
	}

	getFoldedMap() {
		const width = this.canvas.width;
		const height = this.canvas.height;

		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		canvas.width = width;
		canvas.height = height;

		const slope = height / 10;
		const segmentWidth = (width - this.padding * 2) / 4;
		const segmentHeight = height - this.padding * 2;

		ctx.save();
		ctx.translate(this.padding, this.padding);
		ctx.beginPath();
		ctx.fillStyle = "rgba(0,0,0,0.2)";
		ctx.filter = "blur(20px)";

		ctx.moveTo(0, segmentHeight);
		ctx.lineTo(segmentWidth, segmentHeight - slope * 3);
		ctx.lineTo(segmentWidth * 2, segmentHeight - 30);

		ctx.lineTo(segmentWidth * 3, segmentHeight - slope * 3);
		ctx.lineTo(segmentWidth * 4, segmentHeight - 30);
		ctx.lineTo(0, segmentHeight - 30);
		ctx.fill();

		ctx.restore();

		ctx.lineWidth = 20;
		ctx.fillStyle = this.background || "transparent";
		ctx.save();
		ctx.translate(this.padding, this.padding);
		ctx.beginPath();
		ctx.moveTo(50, slope);
		ctx.lineTo(segmentWidth, 0);
		ctx.lineTo(segmentWidth * 2, slope);
		ctx.lineTo(segmentWidth * 3, 0);
		ctx.lineTo(segmentWidth * 4 - 50, slope);
		ctx.lineTo(segmentWidth * 4, segmentHeight - 50);
		ctx.lineTo(segmentWidth * 3, segmentHeight - slope);
		ctx.lineTo(segmentWidth * 2, segmentHeight - 50);
		ctx.lineTo(segmentWidth, segmentHeight - slope);
		ctx.lineTo(0, segmentHeight - 50);
		ctx.lineTo(65, slope - 20);
		ctx.strokeStyle = "#fff";
		ctx.shadowColor = "rgba(0,0,0,0.15)";
		ctx.shadowBlur = 10;
		ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = 2;
		ctx.lineWidth = 50;
		ctx.stroke();

		ctx.restore();
		ctx.clip();

		ctx.save();
		ctx.transform(1.08, -0.1, -0.1, 1.08, 0, 0);
		ctx.drawImage(
			resizeImage(resizeToAspectRatio(this.img, width / height), {
				width,
				height,
			}),
			0,
			0
		);
		ctx.restore();

		ctx.save();
		ctx.translate(this.padding, this.padding);

		ctx.beginPath();
		ctx.moveTo(segmentWidth, 0);
		ctx.lineTo(segmentWidth, segmentHeight - slope);

		ctx.moveTo(segmentWidth * 2, slope);
		ctx.lineTo(segmentWidth * 2, segmentHeight);

		ctx.moveTo(segmentWidth * 3, 0);
		ctx.lineTo(segmentWidth * 3, segmentHeight - slope);

		ctx.strokeStyle = "rgba(0,0,0,0.5)";
		ctx.lineWidth = 5;
		ctx.filter = "blur(20px)";
		ctx.closePath();
		ctx.stroke();

		ctx.filter = "none";
		ctx.beginPath();
		ctx.moveTo(segmentWidth, 0);
		ctx.lineTo(segmentWidth, segmentHeight - slope);
		ctx.lineTo(segmentWidth * 2, segmentHeight);
		ctx.lineTo(segmentWidth * 2, slope);

		ctx.moveTo(segmentWidth * 3, 0);
		ctx.lineTo(segmentWidth * 3, segmentHeight - slope);
		ctx.lineTo(segmentWidth * 4, segmentHeight);
		ctx.lineTo(segmentWidth * 4, slope);

		ctx.fillStyle = "rgba(0,0,0,0.08)";
		ctx.fill();
		ctx.restore();

		return canvas;
	}

	async drawImage() {
		const width = this.canvas.width;
		const height = this.canvas.height;
		const ctx = this.ctx;

		ctx.save();
		const rx = width / 2;
		const ry = height / 2;
		ctx.translate(rx, ry);
		ctx.rotate((-10 * Math.PI) / 180);
		ctx.translate(-rx, -ry);

		ctx.transform(0.9, 0, 0, 0.9, 0, 0);
		ctx.drawImage(this.getFoldedMap(), 0, 20);
		ctx.restore();


		const size = 100;
		ctx.save();
		ctx.transform(0.9, -0.05, 0, 0.9, 0, 18);

		ctx.shadowColor = "rgba(0,0,0,0.15)";
		ctx.shadowBlur = 15;
		ctx.shadowOffsetX = -10;
		ctx.shadowOffsetY = 20;

		ctx.drawImage(
			resizeImage(this.getMarker(), { width: size, height: size }),
			// width / 4 - size / 2 + 20,
			width / 2 - size / 2, 
			// (width * 3) / 4 - size + 20,
			height / 2 - size / 2
		);
		ctx.restore();

		const res = this.canvas.toDataURL();

		showPreview(res);

		return res;
	}
}

export default function MapComponent() {
	const previewRef = useRef(null);
	const mapComponentDrawerRef = useRef((data) => {
		if (!window.mapComponentDrawer)
			window.mapComponentDrawer = new MapComponentDrawer();

		window.mapComponentDrawer.draw(data).then(setUrl);
	});
	const [url, setUrl] = useState();
	const [data, updateField] = useDataSchema(
		{
			color: "#ac1f40",
			image: staticImages.presets.map,
		},
		mapComponentDrawerRef.current
	);

	useEffect(() => {
		mapComponentDrawerRef.current(data);

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
