import React, { useEffect, useRef, useState } from "react";
import Input from "./Input";
import ComponentFields from "./tokens/ComponentFields";

function dragElement(elmnt, callback) {
	const maxHeight = elmnt.parentElement.offsetHeight - elmnt.offsetHeight;
	var pos1 = 0,
		pos2 = 0,
		pos3 = 0,
		pos4 = 0;
	elmnt.onmousedown = dragMouseDown;

	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;

		const newTop = elmnt.offsetTop - pos2;

		if (newTop < maxHeight && newTop / maxHeight > 0.5) {
			elmnt.style.top = newTop + "px";
			// elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
		}
	}

	function closeDragElement() {
		document.onmouseup = null;
		document.onmousemove = null;

		callback(Number(elmnt.style.top.replace("px", "")) / maxHeight);
	}
}

function toasterGradient(width, height) {
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

function crop(canvas, aspectRatio) {
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

class ImageDrawer {
	crop = false;
	constructor() {
		const canvas = document.createElement("canvas");
		canvas.width = 320;
		canvas.height = 120;
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}

	draw(props) {
		Object.assign(this, props);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		return this.drawImage();
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
			this.crop.percent;
		ctx.lineTo(0, randY);

		while (lastX <= canvas.width) {
			randX = (Math.floor(Math.random() * 7.5) / 100) * canvas.width;
			randY =
				((Math.floor(Math.random() * 8) + 85) / 100) *
				canvas.height *
				this.crop.percent;
			lastX = lastX + randX;
			ctx.lineTo(lastX, randY);
		}
		ctx.lineTo(canvas.width, 0);
		ctx.closePath();
		// ctx.lineWidth = 10;
		// ctx.stroke();

		ctx.shadowColor = "rgba(0,0,0,0.16)";
		ctx.shadowBlur = 15;
		ctx.shadowOffsetX = 5;
		ctx.shadowOffsetY = 5;
		ctx.fill();

		ctx.clip();
		ctx.drawImage(img, 0, 0);
		ctx.restore();

		const aspectRatio = canvas.width / canvas.height / this.crop.percent;
		return crop(canvas, aspectRatio);
	}

	addPolaroid(img) {
		const width = img.width;
		const height = img.height;
		const landScape = width > height;

		// const padding = landScape ? 30 : 20;
		// const paddingBottom = landScape ? 120 : 60;
		const px = landScape ? width * 0.03 : width * 0.04;
		const pt = this.polaroid?.even ? px : height * 0.03;
		const pb = this.polaroid?.even ? pt : pt * 5;

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
			toasterGradient(width, height),
			px + 5,
			pt + 5,
			width - 10 - px * 2,
			height - 10 - pt - pb
		);

		ctx.save();
		if (this.polaroid?.filter)
			ctx.globalCompositeOperation = this.polaroid.filter;

		ctx.drawImage(
			img,
			px + 5,
			pt + 5,
			width - 10 - px * 2,
			height - 10 - pt - pb
		);
		ctx.restore();

		return polaroid;
	}

	async drawImage() {
		const img = await new Promise((resolve) => {
			try {
				const img = new Image();
				img.crossOrigin = "anonymous";
				img.onload = async () => {
					this.canvas.width = img.naturalWidth;
					this.canvas.height = img.naturalHeight;

					resolve(img);
				};
				img.src = this.src;
			} catch (error) {
				console.log("Error processing: ", error);
			}
		});

		let processedImage;

		if (this.crop) processedImage = this.tornPaper(img);
		else {
			this.ctx.drawImage(img, 0, 0);
			processedImage = this.canvas;
		}

		if (this.polaroid) processedImage = this.addPolaroid(processedImage);

		return processedImage.toDataURL();
	}
}

export default function ImageComponent() {
	const [data, setData] = useState({});
	const [url, setUrl] = useState();
	const previewRef = useRef(null);

	useEffect(() => {
		window.imageDrawer = new ImageDrawer();
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

	function updateField(field, newValue) {
		const updatedProps =
			typeof field == "string" ? { [field]: newValue } : field;
		const newData = { ...data, ...updatedProps };
		setData(newData);

		window.imageDrawer.draw(newData).then(setUrl);
	}

	return (
		<>
			<div className="relative border-b flex center-center p-3">
				<div className="relative">
					<img
						className="max-w-full object-contain object-top"
						src={data.src || url}
						style={{
							maxHeight: "30vh",
							// opacity: data.src?.length ? 0.1 : 0,
							opacity: 0,
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
							type: "section",
							optional: true,
							children: {
								percent: {
									label: "Cut off distance",
									type: "range",
									defaultValue: 0.5,
									min: 0,
									max: 1,
									step: 1,
									meta: {
										min: 0,
										max: 1,
										step: 0.1,
									},
								},
							},
						},
					}}
					onChange={updateField}
					data={data}
				/>

				<ComponentFields
					schema={{
						polaroid: {
							type: "section",
							optional: true,
							children: {
								even: {
									label: "Even spaces",
									type: "boolean",
									defaultValue: false,
								},
								filter: {
									type: "tag",
									optional: true,
									defaultValue: "color-dodge",
									// offValue: "screen",
									choices: [
										"color-dodge",
										"exclusion",
										"lighten",
										"luminosity",
										"screen",
									],
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
