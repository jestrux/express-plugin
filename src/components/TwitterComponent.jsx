// https://api.twitter.com/2/tweets/1583048374575472640?tweet.fields=attachments,author_id,created_at&expansions=author_id
// export const TWITTER = "Bearer AAAAAAAAAAAAAAAAAAAAAHBdBwEAAAAA%2Bo%2FTAnCI0zQzph66GfSOIMugbvg%3DAq5TXfjOGQLboO5vtNU1UbscNVLpQC4siYoJeBhBe5qrSEfx1U";

import React, { useEffect, useRef, useState } from "react";
import Input from "./Input";
import ComponentFields from "./tokens/ComponentFields";

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

	async tornPaper(img) {
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
		return crop(canvas, aspectRatio).toDataURL();
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
			processedImage = this.canvas.toDataURL();
		}

		return processedImage;
	}
}

export default function TwitterComponent() {
	const [data, setData] = useState({});
	const [url, setUrl] = useState();
	const previewRef = useRef(null);

	useEffect(() => {
		if (!window.imageDrawer) {
			window.imageDrawer = new ImageDrawer();
			window.AddOnSdk?.app.enableDragToDocument(previewRef.current, {
				previewCallback: (element) => {
					return new URL(element.src);
				},
				completionCallback: exportImage,
			});
		}
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
			<div className="relative border-b flex center-center">
				<div className="relative">
					<img
						className="max-w-full object-contain object-top"
						src={data.src || url}
						style={{
							maxHeight: "30vh",
							opacity: data.src?.length ? 0.1 : 0,
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

				{/* <div
					ref={rangeRef}
					className="bg-dark-gray rounded-lg shadow absolute inset-x-0 bottom-0"
					style={{ height: "8px", cursor: "move" }}
				></div> */}
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
					title="Some Props"
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
			</div>
		</>
	);
}
