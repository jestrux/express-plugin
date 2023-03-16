import React, { useEffect, useRef, useState } from "react";
import useDataSchema from "../hooks/useDataSchema";
import staticImages from "../staticImages";
import Input from "./Input";
import ComponentFields from "./tokens/ComponentFields";
import { loadImage } from "./utils";

class TornPaperDrawer {
	constructor() {
		const canvas = document.createElement("canvas");
		canvas.width = 320;
		canvas.height = 120;
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}

	cropToFit(canvas, aspectRatio) {
		const inputWidth = canvas.width;
		const inputHeight = canvas.height;
		const inputImageAspectRatio = inputWidth / inputHeight;
		let outputWidth = inputWidth;
		let outputHeight = inputHeight;
		if (inputImageAspectRatio > aspectRatio)
			outputWidth = inputHeight * aspectRatio;
		else if (inputImageAspectRatio < aspectRatio)
			outputHeight = inputWidth / aspectRatio;

		const outputImage = document.createElement("canvas");
		outputImage.width = outputWidth;
		outputImage.height = outputHeight;

		const ctx = outputImage.getContext("2d");
		ctx.drawImage(canvas, 0, 0);

		return outputImage;
	}

	tornPaper(img) {
		const canvas = this.canvas;
		const ctx = this.ctx;

		let lastX = 0,
			randX,
			randY;

		ctx.save();
		ctx.beginPath();
		ctx.moveTo(0, 0);

		randY =
			((Math.floor(Math.random() * 8) + 85) / 100) *
			canvas.height *
			this.cropPercent;
		ctx.lineTo(0, randY);

		while (lastX <= canvas.width) {
			randX = (Math.floor(Math.random() * 7.5) / 100) * canvas.width;
			randY =
				((Math.floor(Math.random() * 8) + 85) / 100) *
				canvas.height *
				this.cropPercent;
			lastX = lastX + randX;
			ctx.lineTo(lastX, randY);
		}
		ctx.lineTo(canvas.width, 0);
		ctx.closePath();

		ctx.shadowColor = "rgba(0,0,0,0.16)";
		ctx.shadowBlur = 15;
		ctx.shadowOffsetX = 5;
		ctx.shadowOffsetY = 5;
		ctx.fill();

		ctx.clip();
		ctx.drawImage(img, 0, 0);
		ctx.restore();

		const aspectRatio = canvas.width / canvas.height / this.cropPercent;
		return this.cropToFit(canvas, aspectRatio);
	}

	async draw(props = {}) {
		Object.assign(this, props);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		if (!this.img || props.src != this.src)
			await loadImage(this, props.src);
		return this.drawImage();
	}

	async drawImage() {
		if (this.crop) return this.tornPaper(this.img).toDataURL();

		this.ctx.drawImage(this.img, 0, 0);

		return this.canvas.toDataURL();
	}
}

export default function TornPaperComponent() {
	const previewRef = useRef(null);
	const tornPaperDrawerRef = useRef((data) => {
		if (!window.tornPaperDrawer)
			window.tornPaperDrawer = new TornPaperDrawer();

		window.tornPaperDrawer.draw(data).then(setUrl);
	});
	const [url, setUrl] = useState();
	const [data, updateField] = useDataSchema(
		{
			src: staticImages.presets.clippedImage,
			crop: true,
			cropPercent: 1,
		},
		tornPaperDrawerRef.current
	);

	useEffect(() => {
		tornPaperDrawerRef.current(data);

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
			<div
				className="p-3 border-b"
				style={{ display: data?.src || url ? "" : "none" }}
			>
				<div className="relative relative flex center-center">
					<img
						className="max-w-full object-contain object-top"
						src={data.src}
						style={{
							maxHeight: "30vh",
							opacity: 0.1,
						}}
					/>

					<div
						className="absolute top-0 left-0 w-full image-item relative"
						draggable="true"
					>
						<img
							onClick={exportImage}
							ref={previewRef}
							className="drag-target w-full"
							src={url}
							style={{
								opacity: url?.length ? 1 : 0,
							}}
						/>
					</div>
				</div>
			</div>

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
						crop: {
							label: "",
							type: "boolean",
							group: "crop",
							optional: "group",
						},
						cropPercent: {
							group: "crop",
							optional: "group",
							label: "Cut off distance",
							type: "range",
							defaultValue: 1,
							min: 0,
							max: 1,
							step: 1,
							meta: {
								min: 0,
								max: 1,
								step: 0.1,
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
