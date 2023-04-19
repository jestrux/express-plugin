import React, { useEffect, useRef, useState } from "react";
import useDataSchema from "../hooks/useDataSchema";
import { showPreview } from "./utils";
import ComponentFields from "./tokens/ComponentFields";

class SpiralDrawer {
	constructor() {
		const canvas = document.createElement("canvas");
		canvas.width = 2000;
		canvas.height = 2000;
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}

	draw(props = {}) {
		Object.assign(this, props);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		return this.drawSpiral();
	}

	drawAtScale(scale) {
		const canvas = this.canvas;
		const ctx = this.ctx;
		const width = canvas.width;
		const radius = width / 2;

		ctx.beginPath();
		ctx.arc(
			radius,
			radius,
			(radius - this.lineWidth * 2) * scale,
			0,
			Math.PI * 2
		);
		ctx.stroke();
		ctx.restore();
	}

	async completeSpiral() {
		const step = this.compact ? 0.16 : 0.225;
		let scale = this.compact ? 1 : 0.9;
		while (scale > step / 2) {
			this.drawAtScale(scale);
			scale -= step;
		}
	}

	async regularSpiral() {
		const ctx = this.ctx;
		const width = this.canvas.width;
		const height = this.canvas.height;
		const start = 0;
		const spread = this.compact ? 23 : 36;
		const roundScale = this.compact ? 4.45 : 7.7;
		const centerx = width / 2;
		const centery = height / 2;

		ctx.save();

		ctx.translate(-width * 0.02, 0);

		ctx.moveTo(centerx, centery);
		ctx.beginPath();
		for (let i = 0; i < height / roundScale; i++) {
			const angle = 0.1 * i;
			const x = centerx + (start + spread * angle) * Math.cos(angle);
			const y = centery + (start + spread * angle) * Math.sin(angle);

			ctx.lineTo(x, y);
		}
		ctx.stroke();
		ctx.restore();
	}

	async drawSpiral() {
		const ctx = this.ctx;
		ctx.strokeStyle = this.color;
		this.lineWidth = this.compact ? 15 : 22;
		ctx.lineWidth = this.lineWidth;
		ctx.lineCap = "round";

		this.infinite ? this.regularSpiral() : this.completeSpiral();

		const res = this.canvas.toDataURL();

		showPreview(res);

		return res;
	}
}

export default function SpiralComponent() {
	const previewRef = useRef(null);
	const spiralDrawerRef = useRef((data) => {
		if (!window.spiralDrawer) window.spiralDrawer = new SpiralDrawer();

		window.spiralDrawer.draw(data).then(setUrl);
	});
	const [url, setUrl] = useState();
	const [data, updateField] = useDataSchema(
		{
			color: "#7129F4", // "#FF2E6D",
			infinite: true,
			compact: true,
		},
		spiralDrawerRef.current
	);

	useEffect(() => {
		spiralDrawerRef.current(data);

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
			<div className="relative border-b flex center-center p-3">
				<div className="relative">
					<div
						className="w-full image-item relative"
						draggable="true"
					>
						<img
							onClick={exportImage}
							ref={previewRef}
							className="drag-target max-w-full"
							src={url}
							style={{
								maxHeight: "20vh",
							}}
						/>
					</div>
				</div>
			</div>

			<div className="px-12px pt-1 pb-3">
				<ComponentFields
					schema={{
						infinite: {
							label: "Shape",
							type: "radio",
							inline: true,
							choices: [
								{
									label: "Spiral",
									value: true,
								},
								{
									label: "Circles",
									value: false,
								},
							],
						},
						compact: {
							label: "Spacing",
							type: "radio",
							inline: true,
							choices: [
								{
									label: "compact",
									value: true,
								},
								{
									label: "loose",
									value: false,
								},
							],
						},
						color: {
							type: "color",
							inline: true,
							meta: {
								choiceSize: 26,
								colors: [
									"#7129F4",
									"#FF2E6D",
									"#333333",
									"#FFFFFF",
								],
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
