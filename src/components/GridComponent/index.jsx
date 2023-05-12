import React, { useEffect, useState } from "react";
import useDataSchema from "../../hooks/useDataSchema";
import ComponentFields from "../tokens/ComponentFields";
import { addToDocument, showPreview } from "../utils";
import DraggableImage from "../tokens/DraggableImage";
import dots from "./dots";
import mesh from "./mesh";

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
		const ctx = this.ctx;
		this.canvas.width = this.aspectRatio == "tall" ? 1000 : 2000;
		this.canvas.height = this.aspectRatio == "wide" ? 1000 : 2000;

		ctx.strokeStyle = this.color;
		// ctx.lineWidth = 20;
		ctx.lineWidth = 5;

		ctx.stroke(new Path2D(mesh[this.aspectRatio]));

		return;

		const width = this.canvas.width;
		const height = this.canvas.height;
		const cellSize = Math.min(width / 6, height / 6);
		// const cellSize = Math.min(width / 12, height / 12);
		const columns = width / cellSize;
		const rows = height / cellSize;

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
		this.canvas.width = this.aspectRatio == "tall" ? 1000 : 2000;
		this.canvas.height = this.aspectRatio == "wide" ? 1000 : 2000;
		const ctx = this.ctx;

		ctx.fillStyle = this.color;
		ctx.strokeStyle = this.color;
		// ctx.lineWidth = 20;
		ctx.lineWidth = 5;

		const translation = this.aspectRatio == "square" ? 200 : 166.666;
		ctx.translate(translation, translation);

		ctx.fill(new Path2D(dots[this.aspectRatio]));

		return;

		const circly = (x, y, r) => {
			const points = `
			M ${x}, ${y}
			m ${r}, 0
			a ${r},${r} 0 1,0 -${r * 2},0
			a ${r},${r} 0 1,0  ${r * 2},0
			`;

			return new Path2D(points);
		};

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		const width = this.canvas.width;
		const height = this.canvas.height;
		const ratio = this.aspectRatio == "square" ? 5 : 6;
		const cellSize = Math.max(width / ratio, height / ratio);
		const columns = width / cellSize;
		const rows = height / cellSize;

		ctx.fillStyle = this.color;
		ctx.strokeStyle = this.color;

		const radius = cellSize / 2;
		const gap = radius * 0.75;

		ctx.translate(radius, radius);
		const circles = new Path2D();
		const circle = (x, y) => {
			const path = new Path2D();
			path.arc(x, y, radius - gap, 0, Math.PI * 2, true);
			return path;
		};

		for (let i = 0; i < columns; i++) {
			for (let j = 0; j < rows; j++) {
				circles.addPath(circle(cellSize * i, cellSize * j));
			}
		}

		ctx.stroke(circles);
		ctx.fill(circles);
	}

	drawImage() {
		if (this.gridType == "mesh") this.drawMesh();
		else this.drawDots();

		const res = this.canvas.toDataURL();

		showPreview(res);

		return res;
	}
}

function GridComponent() {
	const [data, updateField] = useDataSchema("grid", {
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
							hint: "Click or drag and drop grid to add it to your canvas",
							choices: [
								"square dot",
								"tall dot",
								"wide dot",
								"square mesh",
								"tall mesh",
								"wide mesh",
							].map((value) => ({
								value,
								label: value + " grid",
							})),
							meta: {
								columns: 2,
								render(grid) {
									const [aspectRatio, gridType] =
										grid.split(" ");

									const source =
										gridType == "mesh" ? mesh : dots;
									const [width, height] = {
										tall: [1000, 2000],
										wide: [2000, 1000],
										square: [2000, 2000],
									}[aspectRatio];

									let translate = "";
									if (gridType == "dot") {
										const translation =
											aspectRatio == "square"
												? 200
												: 166.666;
										translate = `translate(${translation}, ${translation})`;
									}

									const url = () =>
										new GridComponentDrawer().draw({
											...data,
											gridType,
											aspectRatio,
										});

									return (
										<DraggableImage
											src={url}
											onClickOrDrag={() =>
												updateField({
													...data,
													gridType,
													aspectRatio,
												})
											}
										>
											<div className="p-3 w-full h-full flex center-center">
												<div className="w-full h-full flex justify-center">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														viewBox={`0 0 ${width} ${height}`}
														style={{
															filter: "drop-shadow(0.25px 0.25px 0.5px rgba(0, 0, 0, 0.5))",
														}}
														{...(gridType == "mesh"
															? {
																	fill: "none",
																	stroke: data.color,
																	strokeWidth:
																		"5",
															  }
															: {
																	fill: data.color,
															  })}
													>
														<g
															transform={
																translate
															}
														>
															<path
																d={
																	source[
																		aspectRatio
																	]
																}
															/>
														</g>
													</svg>
												</div>
											</div>
										</DraggableImage>
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

GridComponent.usePreview = () => {
	const [preview, setPreview] = useState();
	const [data] = useDataSchema("grid", {
		// gridType: "mesh",
		// aspectRatio: "square",
		// color: "#F09D0F",
	});

	const noData = !data?.gridType;

	const handleQuickAction = (e) => {
		e.stopPropagation();

		addToDocument(preview);
	};

	useEffect(() => {
		if (preview || noData) return;

		setPreview(new GridComponentDrawer().draw(data));
	}, []);

	const quickAction = noData
		? null
		: (children) => (
				<button
					className="flex items-center cursor-pointer bg-transparent border border-transparent p-0"
					onClick={handleQuickAction}
				>
					{children("Add to canvas")}
				</button>
		  );

	return {
		quickAction,
		preview,
	};
};

export default GridComponent;
