import React, { useEffect, useRef, useState } from "react";
import useDataSchema from "../hooks/useDataSchema";
import staticImages from "../staticImages";
import ImagePicker from "./tokens/ImagePicker";
import ComponentFields from "./tokens/ComponentFields";
import {
	backgroundSpec,
	loadImageFromUrl,
	resizeToAspectRatio,
	solidGradientBg,
} from "./utils";

class CylinderDrawer {
	padding = 40;
	strokeWidth = 5;
	smoothCorners = false;
	constructor() {
		const canvas = document.createElement("canvas");
		canvas.width = 500;
		canvas.height = 1000;
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}

	addBorder() {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const padding = this.padding;
		const width = this.canvas.width + padding + this.strokeWidth * 2;
		const height = this.canvas.height + padding + this.strokeWidth * 2;
		let radius = Math.max(width, height, 1000);
		const cornerRadius = this.smoothCorners ? 120 : 0;
		radius = this.half
			? [radius, radius, cornerRadius, cornerRadius]
			: radius;

		canvas.width = width;
		canvas.height = height;

		ctx.strokeStyle = this.inset?.border || "transparent";
		ctx.fillStyle =
			solidGradientBg(canvas, this.inset?.background) || "transparent";
		ctx.lineWidth = this.strokeWidth;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";

		ctx.beginPath();
		ctx.roundRect(
			this.strokeWidth,
			this.strokeWidth,
			width - this.strokeWidth * 2,
			height - this.strokeWidth * 2,
			radius
		);
		ctx.stroke();
		ctx.fill();

		ctx.drawImage(
			this.canvas,
			padding / 2 + this.strokeWidth,
			padding / 2 + this.strokeWidth,
			this.canvas.width,
			this.canvas.height
		);

		return canvas;
	}

	async draw(props = {}) {
		Object.assign(this, props);

		this.canvas.width = props.half ? 1000 : 600;
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// if (!this.img || props.src != this.src)
		this.img = await loadImageFromUrl(props.src);

		return this.drawImage();
	}

	async drawImage() {
		const width = this.canvas.width;
		const height = this.canvas.height;
		const ctx = this.ctx;

		let radius = Math.max(width, height, 1000);
		const cornerRadius = this.smoothCorners ? 80 : 0;
		radius = this.half
			? [radius, radius, cornerRadius, cornerRadius]
			: radius;

		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle =
			solidGradientBg(this.canvas, this.inset?.background) || "#333";
		ctx.beginPath();
		ctx.roundRect(0, 0, width, height, radius);
		ctx.fill();
		ctx.clip();

		this.ctx.drawImage(
			resizeToAspectRatio(this.img, width / height),
			0,
			0,
			width,
			height
		);

		if (this.inset) return this.addBorder().toDataURL();

		return this.canvas.toDataURL();
	}
}

export default function CylinderComponent() {
	const previewRef = useRef(null);
	const cylinderDrawerRef = useRef((data) => {
		if (!window.cylinderDrawer)
			window.cylinderDrawer = new CylinderDrawer();

		window.cylinderDrawer.draw(data).then(setUrl);
	});
	const [url, setUrl] = useState();
	const [data, updateField] = useDataSchema(
		{
			src: staticImages.presets.cylinder,
			half: true,
			inset: false,
		},
		cylinderDrawerRef.current
	);

	useEffect(() => {
		cylinderDrawerRef.current(data);

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
						style={{ maxHeight: "30vh" }}
					/>
				</div>
			</div>

			<div className="px-12px">
				<div className="my-4">
					<ImagePicker onChange={(src) => updateField("src", src)} />
				</div>

				<ComponentFields
					schema={{
						half: "boolean",
						smoothCorners: {
							type: "boolean",
							show: (state) => state.half,
						},
						inset: {
							type: "section",
							optional: true,
							children: {
								border: {
									type: "color",
									defaultValue: "#888",
									meta: { showTransparent: true },
								},
								background: backgroundSpec(),
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
