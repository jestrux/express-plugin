import React, { useEffect, useState } from "react";
import useDataSchema from "../../hooks/useDataSchema";
import ComponentFields from "../tokens/ComponentFields";
import arrows from "./arrows";
import DraggableImage from "../tokens/DraggableImage";
import { addToDocument, showPreview } from "../utils";

class ArrowComponentDrawer {
	arrow = "swimmingTopRight";
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
		const { width, height, path } = arrows[this.arrow];
		this.canvas.width = width;
		this.canvas.height = height;

		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		ctx.fillStyle = this.color;

		ctx.beginPath();
		ctx.fill(new Path2D(path));

		const res = this.canvas.toDataURL();

		return res;
	}
}

function ArrowComponent() {
	const [data, updateField] = useDataSchema("arrows", {
		color: "#ac1f40",
	});

	return (
		<>
			<div className="px-12px">
				<ComponentFields
					schema={{
						color: {
							type: "color",
							meta: {
								singleChoice: true,
								choiceSize: 30,
							},
						},
						wave: {
							type: "grid",
							label: "",
							hint: "Click or drag and drop an arrow to add it to your canvas",
							choices: Object.keys(arrows),
							noBorder: true,
							meta: {
								columns: 3,
								render(arrow) {
									const url = new ArrowComponentDrawer().draw(
										{
											...data,
											arrow,
										}
									);

									return (
										<DraggableImage
											className="p-3 h-full max-w-full object-fit"
											onClickOrDrag={() =>
												updateField({ arrow })
											}
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

ArrowComponent.usePreview = () => {
	const [preview, setPreview] = useState();
	const [data] = useDataSchema("arrows", {
		arrow: "swimmingTopRight",
		color: "#ac1f40",
	});

	const handleQuickAction = (e) => {
		e.stopPropagation();

		addToDocument(preview);
	};

	useEffect(() => {
		if (preview) return;

		setPreview(new ArrowComponentDrawer().draw(data));
	}, []);

	const quickAction = (children) => (
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

export default ArrowComponent;
