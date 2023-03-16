import React, { useEffect, useRef, useState } from "react";
import useDataSchema from "../hooks/useDataSchema";
import staticImages from "../staticImages";
import Input from "./Input";
import ComponentFields from "./tokens/ComponentFields";
import { loadImage, pathFromPoints, tinyColor } from "./utils";

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

		return canvas;
	}

	addFrame() {
		const canvas = this.canvas;
		const ctx = this.ctx;
		const width = canvas.width;
		const height = canvas.height;
		const inset = this.inset || 10;

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

		borderPoints.forEach((points, index) => {
			ctx.fillStyle = colors[index];
			ctx.fill(pathFromPoints(points));
		});

		ctx.save();
		const rx = width / 2;
		const ry = height / 2;
		ctx.translate(rx, ry);
		ctx.rotate(Math.PI);
		ctx.translate(-rx, -ry);

		ctx.drawImage(
			canvas,
			inset,
			inset,
			width - inset * 2,
			height - inset * 2
		);
		ctx.restore();

		ctx.drawImage(
			this.img,
			inset * 2,
			inset * 2,
			width - inset * 4,
			height - inset * 4
		);

		return this.addShadow();
	}

	async draw(props = {}) {
		Object.assign(this, props);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		if (!this.img || props.src != this.src)
			await loadImage(this, props.src);

		return this.drawImage();
	}

	async drawImage() {
		return this.addFrame().toDataURL();
	}
}

export default function FrameComponent() {
	const previewRef = useRef(null);
	const frameDrawerRef = useRef((data) => {
		if (!window.frameDrawer) window.frameDrawer = new FrameDrawer();

		window.frameDrawer.draw(data).then(setUrl);
	});
	const [url, setUrl] = useState();
	const [data, updateField] = useDataSchema(
		{
			src: staticImages.presets.frame,
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

	const processImage = (e) => {
		const files = e.target.files;
		if (!files?.length) return;

		const file = files[0];

		updateField("src", null);
		var reader = new FileReader();
		reader.onload = (e) => updateField("src", e.target.result);
		reader.readAsDataURL(file);

		e.target.value = "";
	};

	return (
		<>
			{url && (
				<div className="relative relative border-b flex center-center p-3">
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
			)}

			<div className="px-12px">
				<label className="cursor-pointer my-3 p-2 bg-gray text-md block w-full text-center">
					<Input
						className="hidden"
						type="file"
						name="image"
						onChange={processImage}
					/>
					Pick photo
				</label>

				<ComponentFields
					schema={{
						color: "color",
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
