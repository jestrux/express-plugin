import React, { useEffect, useRef, useState } from "react";
import useDataSchema from "../hooks/useDataSchema";
import ComponentFields from "./tokens/ComponentFields";
import { showPreview } from "./utils";

class GridComponentDrawer {
	constructor() {
		const canvas = document.createElement("canvas");
		this.canvas = canvas;
		canvas.width = 2000;
		canvas.height = 2000;
		this.ctx = canvas.getContext("2d");
	}

	async draw(props = {}) {
		Object.assign(this, props);

		return this.drawImage();
	}

	drawMesh() {
		this.canvas.width = this.aspectRatio == "tall" ? 1000 : 2000;
		this.canvas.height = this.aspectRatio == "wide" ? 1000 : 2000;

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		const width = this.canvas.width;
		const height = this.canvas.height;
		const ctx = this.ctx;
		// const cellSize = Math.min(width / 5, height / 5);
		const cellSize = Math.min(width / 12, height / 12);
		const columns = width / cellSize;
		const rows = height / cellSize;

		ctx.strokeStyle = this.color;
		// ctx.lineWidth = 20;
		ctx.lineWidth = 5;

		ctx.beginPath();

		for (var i = 1; i < columns; i++) {
			ctx.moveTo(i * cellSize, 0);
			ctx.lineTo(i * cellSize, height);
		}

		for (var i = 1; i < rows; i++) {
			ctx.moveTo(0, i * cellSize);
			ctx.lineTo(width, i * cellSize);
		}

		ctx.closePath();
		ctx.stroke();
	}

	drawDots() {
		this.canvas.width = this.aspectRatio == "tall" ? 300 : 600;
		this.canvas.height = this.aspectRatio == "wide" ? 300 : 600;

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		const width = this.canvas.width;
		const height = this.canvas.height;
		const ctx = this.ctx;
		const cellSize = Math.max(width / 8, height / 8);
		const columns = width / cellSize;
		const rows = height / cellSize;

		ctx.fillStyle = this.color;
		ctx.strokeStyle = this.color;

		const radius = cellSize / 2;
		const gap = radius * 0.75;

		ctx.translate(radius, radius);

		for (let i = 0; i < columns; i++) {
			for (let j = 0; j < rows; j++) {
				ctx.save();
				ctx.translate(cellSize * i, cellSize * j);

				ctx.beginPath();
				ctx.arc(0, 0, radius - gap, 0, Math.PI * 2, true);
				ctx.closePath();
				ctx.stroke();
				ctx.fill();
				ctx.restore();
			}
		}
	}

	async drawImage() {
		if (this.gridType == "mesh") this.drawMesh();
		else this.drawDots();

		const res = this.canvas.toDataURL();

		showPreview(res);

		return res;
	}
}

export default function GridComponent() {
	const previewRef = useRef(null);
	const gridComponentDrawerRef = useRef((data) => {
		if (!window.gridComponentDrawer)
			window.gridComponentDrawer = new GridComponentDrawer();

		window.gridComponentDrawer.draw(data).then(setUrl);
	});
	const [url, setUrl] = useState();
	const [data, updateField] = useDataSchema(
		{
			gridType: "mesh",
			aspectRatio: "square",
			color: "#333333",
		},
		gridComponentDrawerRef.current
	);

	useEffect(() => {
		gridComponentDrawerRef.current(data);

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
						style={{ maxHeight: "20vh" }}
					/>
				</div>
			</div>

			<div className="px-12px mt-1">
				<ComponentFields
					schema={{
						gridType: {
							label: "",
							type: "tag",
							choices: ["mesh", "dot"].map((value) => ({
								value,
								label: value + " grid",
							})),
						},
						aspectRatio: {
							type: "radio",
							choices: ["square", "wide", "tall"],
						},
						color: {
							type: "color",
							meta: {
								colors: [
									"#F09D0F",
									"#5258e4",
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
