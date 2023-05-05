// https://www.freepik.com/free-vector/colorful-flower-icons_762773.htm#page=2&query=flower%20head&position=19&from_view=search&track=ais
import React, { useEffect, useRef, useState } from "react";
import useDataSchema from "../../hooks/useDataSchema";
import ComponentFields from "../tokens/ComponentFields";
import { showPreview } from "../utils";
import flowerHeads from "./flower-heads";
import DraggableImage from "../tokens/DraggableImage";

class FlowerHeadsComponentDrawer {
	constructor() {
		const canvas = document.createElement("canvas");
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}

	draw(props = {}) {
		Object.assign(this, props);

		return this.drawImage();
	}

	drawImage() {
		const ctx = this.ctx;
		const { width, height, path } = flowerHeads[this.flowerHead];
		this.canvas.width = width;
		this.canvas.height = height;

		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		ctx.fillStyle = this.color;

		ctx.beginPath();
		ctx.fill(new Path2D(path));

		const res = this.canvas.toDataURL();

		showPreview(res);

		return res;
	}
}

export default function FlowerHeadsComponent() {
	const [data, updateField] = useDataSchema({
		color: "#ed2232",
	});

	return (
		<>
			<div className="px-12px mt-1">
				<ComponentFields
					schema={{
						color: {
							type: "color",
							// inline: true,
							meta: {
								singleChoice: true,
								choiceSize: 30,
								// colors: [
								// 	"#379b98",
								// 	"#f25629",
								// 	"#ebd913",
								// 	"#ed2232",
								// ],
							},
						},
						flowerPicker: {
							type: "grid",
							label: "",
							hint: "Click (or drag and drop) a flower to add it to your canvas",
							choices: Object.keys(flowerHeads),
							meta: {
								render(flowerHead) {
									const url =
										new FlowerHeadsComponentDrawer().draw({
											...data,
											flowerHead,
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
