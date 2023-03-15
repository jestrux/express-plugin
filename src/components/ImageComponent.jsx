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

class ImageDrawer {
	crop = false;
	cropHeightPercent = 1;
	constructor(canvas) {
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
		ctx.lineWidth = 10;
		ctx.stroke();
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
					resolve(this.canvas.toDataURL());
				}, 100);
			} catch (error) {
				console.log("Error processing: ", error);
			}
		});
	}
}

export default function ImageComponent() {
	const [height, setHeight] = useState("30vh");
	const [url, setUrl] = useState();
	const [src, setSrc] = useState();
	const [cropHeightPercent, setCropHeightPercent] = useState(1);
	const [crop, setCrop] = useState(false);
	const canvasRef = useRef(null);
	const previewRef = useRef(null);
	const rangeRef = useRef(null);

	useEffect(() => {
		if (!window.imageDrawer) {
			// dragElement(rangeRef.current, setCropHeightPercent);

			window.imageDrawer = new ImageDrawer(canvasRef.current);
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
		const blob = await new Promise((resolve, reject) => {
			canvasRef.current.toBlob(resolve);
		});

		const fromDrag = e?.target?.nodeName != "IMG";

		if (fromDrag) return [{ blob }];
		else sdk.app.document.addImage(blob);
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
			<canvas
				ref={canvasRef}
				className="hidden"
				width="320px"
				height="120px"
			></canvas>

			<div
				className="relative border-b flex center-center"
				// style={{ height }}
			>
				<div className="image-item relative h-full" draggable="true">
					<img
						onClick={exportImage}
						ref={previewRef}
						className="drag-target object-contain object-top max-w-full"
						src={url}
						style={{ maxHeight: "30vh", opacity: url?.length ? 1 : 0 }}
					/>
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
