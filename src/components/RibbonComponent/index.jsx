import React from "react";
import { showPreview } from "../utils";
import DraggableImage from "../tokens/DraggableImage";
import ComponentFields from "../tokens/ComponentFields";
import useDataSchema from "../../hooks/useDataSchema";
import ribbon from "./ribbon";

class RibbonDrawer {
	constructor() {
		const canvas = document.createElement("canvas");
		canvas.width = 200;
		canvas.height = 800;
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}

	draw(props = {}) {
		Object.assign(this, props);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		return this.drawRibbon();
	}

	drawRibbon() {
		this.ctx.strokeStyle = this.color;
		this.ctx.lineWidth = 20;
		this.ctx.stroke(new Path2D(ribbon));

		const resy = this.canvas.toDataURL();
		showPreview(resy);
		return resy;

		const height = this.canvas.height;
		const width = this.canvas.width;
		const ctx = this.ctx;
		const lineWidth = 20;
		const centerX = width / 2;
		const amplitude = -width / 2 + lineWidth;
		const fold = height / 200;

		ctx.strokeStyle = this.color;
		ctx.lineWidth = lineWidth;

		ctx.beginPath();
		ctx.moveTo(centerX, 0);

		for (var i = 0; i <= height; i += 0.5) {
			const x = centerX + amplitude * Math.sin((8 * i * Math.PI) / 180);
			const y = i * fold;
			ctx.lineTo(x, y);
			path += `L ${x}, ${y} `;

			ctx.stroke();
		}

		const res = this.canvas.toDataURL();
		showPreview(res);
		return res;
	}
}

export default function RibbonComponent() {
	const [data, updateField] = useDataSchema({ color: "#ffc107" });

	return (
		<>
			<DraggableImage wrapped info src={new RibbonDrawer().draw(data)}>
				<div className="p-3 w-full h-full flex center-center">
					<div className="w-full h-full flex justify-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 200 800"
							fill="none"
							style={{
								filter: "drop-shadow(0.25px 0.25px 0.5px rgba(0, 0, 0, 0.5))",
							}}
							stroke={data.color}
							strokeWidth="20"
						>
							<path d={ribbon} />
						</svg>
					</div>
				</div>
			</DraggableImage>

			<div className="px-12px py-3">
				<ComponentFields
					schema={{
						color: {
							type: "color",
							meta: {
								singleChoice: true,
								choiceSize: 30,
							},
						},
					}}
					data={data}
					onChange={updateField}
				/>
			</div>
		</>
	);
}
