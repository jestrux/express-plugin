import React, { useEffect, useRef, useState } from "react";
import useDataSchema from "../hooks/useDataSchema";
import ComponentFields from "./tokens/ComponentFields";
import { showPreview } from "./utils";
import DraggableImage from "./tokens/DraggableImage";

class GridComponentDrawer {
	constructor() {
		const canvas = document.createElement("canvas");
		this.canvas = canvas;
		canvas.width = 2000;
		canvas.height = 2000;
		this.ctx = canvas.getContext("2d");
	}

	draw(props = {}) {
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

	drawImage() {
		if (this.gridType == "mesh") this.drawMesh();
		else this.drawDots();

		const res = this.canvas.toDataURL();

		showPreview(res);

		return res;
	}
}

export default function GridComponent() {
	const [data, updateField] = useDataSchema({
		gridType: "mesh",
		aspectRatio: "square",
		color: "#F09D0F", // #5258e4
	});

	return (
		<>
			<div className="px-12px mt-1">
				<ComponentFields
					schema={{
						color: {
							type: "color",
							meta: {
								singleChoice: true,
								choiceSize: 30,
							},
						},
						gridPicker: {
							label: "",
							noBorder: true,
							type: "grid",
							hint: "Click (or drag and drop) grid to add it to your canvas",
							choices: [
								"square mesh",
								"tall mesh",
								"wide mesh",
								"square dot",
								"tall dot",
								"wide dot",
							].map((value) => ({
								value,
								label: value + " grid",
							})),
							meta: {
								columns: 2,
								render(grid) {
									const [aspectRatio, gridType] =
										grid.split(" ");

									const url = new GridComponentDrawer().draw({
										...data,
										gridType,
										aspectRatio,
									});

									return (
										<DraggableImage
											className="p-3 h-full max-w-full object-fit"
											src={url}
											style={{
												objectFit: "contain",
												filter: "drop-shadow(0.5px 0.5px 0.5px rgba(0, 0, 0, 0.4))",
											}}
										/>
									);
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
