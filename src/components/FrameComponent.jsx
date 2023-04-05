import React, { useEffect, useRef, useState } from "react";
import useDataSchema from "../hooks/useDataSchema";
import staticImages from "../staticImages";
import ComponentFields from "./tokens/ComponentFields";
import { loadImage, pathFromPoints, showPreview, tinyColor } from "./utils";

class FrameDrawer {
	constructor() {
		const canvas = document.createElement("canvas");
		canvas.width = 320;
		canvas.height = 120;
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}

	addShadow() {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		canvas.width = this.canvas.width;
		canvas.height = this.canvas.height;

		const width = this.canvas.width;
		const height = this.canvas.height;

		const shadowSpread = 10;
		ctx.shadowColor = "rgba(0,0,0,0.3)";
		ctx.shadowBlur = shadowSpread;
		ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = 2;

		ctx.drawImage(
			this.canvas,
			shadowSpread,
			shadowSpread,
			width - shadowSpread * 2,
			height - shadowSpread * 2
		);

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.ctx.drawImage(canvas, 0, 0);

		return this.canvas;
	}

	addFrame() {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		canvas.width = this.canvas.width;
		canvas.height = this.canvas.height;

		const width = this.canvas.width;
		const height = this.canvas.height;

		const inset = this.inset || 10;

		this.ctx.drawImage(this.img, 0, 0, width, height);

		// ctx.strokeStyle = colors[0];
		// ctx.rect(inset, inset, width - inset * 2, height - inset * 2)
		// ctx.stroke();
		// ctx.restore();

		const colorProp = tinyColor(this.color);
		const luminance = colorProp.getLuminance();
		const darkenFactor = luminance == 1 ? 30 : luminance > 0.15 ? 18 : 20;
		const darkerColor = "#" + colorProp.darken(darkenFactor).toHex();
		const colors = {
			bevel: [darkerColor, this.color, this.color, darkerColor],
			ridge: [this.color, darkerColor, darkerColor, this.color],
		}[this.effect];

		const borderPoints = [
			[
				[0, 0],
				[inset, inset],
				[width - inset, inset],
				[width, 0],
			],
			[
				[width, height],
				[width - inset, height - inset],
				[width - inset, inset],
				[width, 0],
			],
			[
				[0, height],
				[inset, height - inset],
				[width - inset, height - inset],
				[width, height],
			],
			[
				[0, 0],
				[inset, inset],
				[inset, height - inset],
				[0, height],
			],
		];

		ctx.save();
		// ctx.globalAlpha = 0.6;
		const region = new Path2D();
		borderPoints.forEach((points, index) => {
			ctx.fillStyle = colors[index];
			// ctx.fill(pathFromPoints(points));
			region.addPath(pathFromPoints(points));
		});
		ctx.clip(region, "evenodd");

		ctx.drawImage(this.img, 0, 0, width, height);
		ctx.fillStyle = this.color;

		ctx.globalAlpha = 0.35;
		ctx.fillRect(0, 0, width, height);
		ctx.restore();

		this.ctx.save();
		const rx = width / 2;
		const ry = height / 2;
		this.ctx.translate(rx, ry);
		this.ctx.rotate(Math.PI);
		this.ctx.translate(-rx, -ry);

		this.ctx.drawImage(
			canvas,
			inset,
			inset,
			width - inset * 2,
			height - inset * 2
		);
		this.ctx.restore();

		this.ctx.drawImage(canvas, 0, 0);

		this.canvas;
	}

	async draw(props = {}) {
		Object.assign(this, props);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// if (!this.img || props.src != this.src)
		await loadImage(this, props.src);

		return this.drawImage();
	}

	async drawImage() {
		this.addFrame();

		if (this.shadow) this.addShadow();

		return this.canvas.toDataURL();
	}
}

export default function FrameComponent() {
	const previewRef = useRef(null);
	const frameDrawerRef = useRef((data) => {
		if (!window.frameDrawer) window.frameDrawer = new FrameDrawer();

		window.frameDrawer.draw(data).then((url) => {
			setUrl(url);
			showPreview(url);
		});
	});
	const [url, setUrl] = useState();
	const [data, updateField] = useDataSchema(
		{
			src: staticImages.flowers2,
			// color: "white",
			// src: staticImages.presets.frame,
			color: "cyan",
			inset: 20,
			effect: "bevel",
		},
		frameDrawerRef.current
	);

	useEffect(() => {
		frameDrawerRef.current(data);

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

			<div className="px-12px mt-1">
				<ComponentFields
					schema={{
						src: { type: "image", label: "" },
						color: {
							type: "color",
							meta: { showTransparent: true },
						},
						effect: {
							type: "radio",
							choices: ["bevel", "ridge"],
						},
					}}
					onChange={updateField}
					data={data}
				/>
			</div>
		</>
	);
}
