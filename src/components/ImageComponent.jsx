import React, { useEffect, useRef, useState } from "react";
import Input from "./Input";

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
	cropHeightPercent = 1;
	constructor() {
		const canvas = document.createElement("canvas");
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
			this.cropHeightPercent;
		ctx.lineTo(0, randY);

		while (lastX <= canvas.width) {
			randX = (Math.floor(Math.random() * 7.5) / 100) * canvas.width;
			randY =
				((Math.floor(Math.random() * 8) + 85) / 100) *
				canvas.height *
				this.cropHeightPercent;
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
	}

	drawImage() {
		return new Promise((resolve) => {
			try {
				const img = new Image();
				img.crossOrigin = "anonymous";
				img.onload = () => {
					this.canvas.width = img.naturalWidth;
					this.canvas.height = img.naturalHeight;

					if (this.crop) this.tornPaper(img);
					else this.ctx.drawImage(img, 0, 0);
				};
				img.src = this.src;

				setTimeout(() => {
					const res = crop(
						this.canvas,
						this.canvas.width /
							this.canvas.height /
							this.cropHeightPercent
					);
					resolve(res.toDataURL());
				}, 100);
			} catch (error) {
				console.log("Error processing: ", error);
			}
		});
	}
}

export default function ImageComponent() {
	const [height, setHeight] = useState("30vh");
	const [cutUrl, setCutUrl] = useState();
	const [url, setUrl] = useState();
	const [src, setSrc] = useState();
	const [cropHeightPercent, setCropHeightPercent] = useState(0.5);
	const [crop, setCrop] = useState(true);
	const previewRef = useRef(null);
	const rangeRef = useRef(null);

	useEffect(() => {
		if (!window.imageDrawer) {
			// dragElement(rangeRef.current, setCropHeightPercent);

			window.imageDrawer = new ImageDrawer();
			window.AddOnSdk?.app.enableDragToDocument(previewRef.current, {
				previewCallback: (element) => {
					return new URL(element.src);
				},
				completionCallback: exportImage,
			});
		}
	}, []);

	useEffect(() => {
		window.imageDrawer.draw({ src, cropHeightPercent, crop }).then(setUrl);
	}, [src, cropHeightPercent, crop]);

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

		setSrc(null);
		var reader = new FileReader();
		reader.onload = (e) => setSrc(e.target.result);
		reader.readAsDataURL(file);

		e.target.value = "";
	};

	const handleChange = (e) => {
		const { name, value, checked } = e.target;

		if (name == "image") processImage(e);
		if (name == "crop") setCrop(checked);
		if (name == "cropHeightPercent") setCropHeightPercent(value / 100);
	};

	return (
		<>
			<div className="relative border-b flex center-center">
				<div className="relative">
					<img
						className="max-w-full object-contain object-top"
						src={src || url}
						style={{
							maxHeight: "30vh",
							opacity: src?.length ? 0.1 : 0,
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

			<div className="p-2 flex flec-col">
				<table className="w-full" cellPadding={5}>
					<thead>
						<tr>
							<th></th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<span className="text-lg font-medium">
									Image
								</span>
							</td>
							<td>
								<label className="cursor-pointer p-2 bg-gray text-md">
									<Input
										className="hidden"
										type="file"
										name="image"
										onChange={handleChange}
									/>
									Pick photo
								</label>
							</td>
						</tr>
						<tr>
							<td>
								<span className="text-lg font-medium">
									Cut off
								</span>
							</td>
							<td>
								<input
									type="checkbox"
									name="crop"
									defaultChecked={crop}
									onChange={handleChange}
								/>
							</td>
						</tr>
						{crop && (
							<tr>
								<td>
									<span className="text-lg font-medium">
										Cut off distance
									</span>
								</td>
								<td>
									<input
										type="range"
										name="cropHeightPercent"
										min="0"
										max="100"
										defaultValue={cropHeightPercent * 100}
										onChange={handleChange}
									/>
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</>
	);
}
