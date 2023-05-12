// https://www.freepik.com/free-vector/colorful-flower-icons_762773.htm#page=2&query=flower%20head&position=19&from_view=search&track=ais
import React, { useEffect, useRef, useState } from "react";
import useDataSchema from "../../hooks/useDataSchema";
import ComponentFields from "../tokens/ComponentFields";
import { addToDocument, showPreview } from "../utils";
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

		ctx.fillStyle = this.color;

		ctx.beginPath();
		ctx.fill(new Path2D(path));

		const res = this.canvas.toDataURL();

		showPreview(res);

		return res;
	}
}

function FlowerHeadsComponent() {
	const [data, updateField] = useDataSchema("flowerHeads", {});

	return (
		<>
			<div className="px-12px mt-1">
				<ComponentFields
					schema={{
						color: {
							type: "color",
							label: "Customize color",
							optional: true,
							defaultValue: "#ed2232",
							noMargin: true,
							wrapperProps: {
								className: "pb-3",
							},
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
							hint: "Click or drag and drop a flower to add it to your canvas",
							choices: Object.keys(flowerHeads),
							meta: {
								columns: 3,
								render(flowerHead) {
									const url =
										new FlowerHeadsComponentDrawer().draw({
											...data,
											color:
												data.color ||
												flowerHeads[flowerHead].fill,
											flowerHead,
										});

									return (
										<DraggableImage
											className="p-3 h-full max-w-full object-fit"
											src={url}
											onClickOrDrag={() =>
												updateField({
													...data,
													flowerColor:
														data.color ||
														flowerHeads[flowerHead]
															.fill,
													flowerHead,
												})
											}
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

FlowerHeadsComponent.usePreview = () => {
	const [preview, setPreview] = useState();
	const [data] = useDataSchema("flowerHeads", {
		// color,
		// flowerHead: "flower6",
		// flowerColor: "#ed2232",
	});
	const noData = !data?.flowerHead;

	const handleQuickAction = (e) => {
		e.stopPropagation();

		addToDocument(preview);
	};

	useEffect(() => {
		if (preview || noData) return;

		setPreview(new FlowerHeadsComponentDrawer().draw(data));
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

export default FlowerHeadsComponent;
