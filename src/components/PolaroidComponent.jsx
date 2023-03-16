import React, { useEffect, useRef, useState } from "react";
import useDataSchema from "../hooks/useDataSchema";
import staticImages from "../staticImages";
import Input from "./Input";
import ComponentFields from "./tokens/ComponentFields";
import { loadImage } from "./utils";

class PolaroidDrawer {
	constructor() {
		const canvas = document.createElement("canvas");
		canvas.width = 320;
		canvas.height = 120;
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}

	toasterGradient(width, height) {
		var texture = document.createElement("canvas");
		var ctx = texture.getContext("2d");

		texture.width = width;
		texture.height = height;

		// Fill a Radial Gradient
		// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createRadialGradient
		var gradient = ctx.createRadialGradient(
			width / 2,
			height / 2,
			0,
			width / 2,
			height / 2,
			width * 0.6
		);

		gradient.addColorStop(0, "#804e0f");
		gradient.addColorStop(1, "#3b003b");

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, width, height);

		return texture;
	}

	addPolaroid() {
		const canvas = this.canvas;
		const width = canvas.width;
		const height = canvas.height;
		const landScape = width > height;

		// const padding = landScape ? 30 : 20;
		// const paddingBottom = landScape ? 120 : 60;
		const px = landScape ? width * 0.03 : width * 0.04;
		const pt = this.evenSides ? px : height * 0.03;
		const pb = this.evenSides ? pt : pt * 5;

		const polaroid = document.createElement("canvas");
		polaroid.width = width;
		polaroid.height = height;

		const ctx = polaroid.getContext("2d");

		ctx.save();
		ctx.rect(5, 5, width - 10, height - 10);
		ctx.fillStyle = "white";
		ctx.shadowColor = "rgba(0,0,0,0.2)";
		ctx.shadowBlur = 10;
		ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = 2;
		ctx.fill();
		ctx.restore();

		ctx.drawImage(
			this.toasterGradient(width, height),
			px + 5,
			pt + 5,
			width - 10 - px * 2,
			height - 10 - pt - pb
		);

		ctx.save();
		if (this.filter) ctx.globalCompositeOperation = this.filter;

		ctx.drawImage(
			canvas,
			px + 5,
			pt + 5,
			width - 10 - px * 2,
			height - 10 - pt - pb
		);
		ctx.restore();

		return polaroid;
	}

	async draw(props = {}) {
		Object.assign(this, props);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		if (!this.img || props.src != this.src)
			await loadImage(this, props.src);
		return this.drawImage();
	}

	async drawImage() {
		this.ctx.drawImage(this.img, 0, 0);

		if (this.polaroid) return this.addPolaroid().toDataURL();

		return this.canvas.toDataURL();
	}
}

export default function PolaroidComponent() {
	const previewRef = useRef(null);
	const polaroidDrawerRef = useRef((data) => {
		if (!window.polaroidDrawer)
			window.polaroidDrawer = new PolaroidDrawer();

		window.polaroidDrawer.draw(data).then(setUrl);
	});
	const [url, setUrl] = useState();
	const [data, updateField] = useDataSchema(
		{
			src: staticImages.presets.polaroid,
			polaroid: true,
			filter: "exclusion",
		},
		polaroidDrawerRef.current
	);

	useEffect(() => {
		polaroidDrawerRef.current(data);

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
						polaroid: {
							label: "",
							type: "boolean",
							group: "polaroid",
							optional: "group",
						},
						evenSides: {
							label: "Even spaces",
							type: "boolean",
							group: "polaroid",
							optional: "group",
							defaultValue: false,
						},
						filter: {
							type: "tag",
							defaultValue: "color-dodge",
							group: "polaroid",
							optional: true,
							// offValue: false,
							choices: [
								"color-dodge",
								"exclusion",
								"lighten",
								"luminosity",
								"screen",
							],
						},
					}}
					onChange={updateField}
					data={data}
				/>
			</div>
		</>
	);
}
