import React, { useEffect, useState } from "react";
import useDataSchema from "../hooks/useDataSchema";
import ComponentFields from "./tokens/ComponentFields";
import DraggableImage from "./tokens/DraggableImage";
import { addToDocument } from "./utils";

class SpiralDrawer {
	constructor() {
		const canvas = document.createElement("canvas");
		canvas.width = 2000;
		canvas.height = 2000;
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}

	draw(props = {}) {
		Object.assign(this, props);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		return this.drawSpiral();
	}

	drawAtScale(scale) {
		const canvas = this.canvas;
		const ctx = this.ctx;
		const width = canvas.width;
		const radius = width / 2;

		ctx.beginPath();
		ctx.arc(
			radius,
			radius,
			(radius - this.lineWidth * 2) * scale,
			0,
			Math.PI * 2
		);
		ctx.stroke();
		ctx.restore();
	}

	completeSpiral() {
		const step = this.compact ? 0.16 : 0.225;
		let scale = this.compact ? 1 : 0.9;
		while (scale > step / 2) {
			this.drawAtScale(scale);
			scale -= step;
		}
	}

	regularSpiral() {
		const ctx = this.ctx;
		const width = this.canvas.width;
		const height = this.canvas.height;
		const start = 0;
		const spread = this.compact ? 23 : 36;
		const roundScale = this.compact ? 4.45 : 7.7;
		const centerx = width / 2;
		const centery = height / 2;

		ctx.save();

		ctx.translate(-width * 0.02, 0);

		ctx.moveTo(centerx, centery);
		ctx.beginPath();
		for (let i = 0; i < height / roundScale; i++) {
			const angle = 0.1 * i;
			const x = centerx + (start + spread * angle) * Math.cos(angle);
			const y = centery + (start + spread * angle) * Math.sin(angle);

			ctx.lineTo(x, y);
		}
		ctx.stroke();
		ctx.restore();
	}

	drawSpiral() {
		const ctx = this.ctx;
		ctx.strokeStyle = this.color;
		this.lineWidth = this.compact ? 15 : 22;
		ctx.lineWidth = this.lineWidth;
		ctx.lineCap = "round";

		this.infinite ? this.regularSpiral() : this.completeSpiral();

		const res = this.canvas.toDataURL();

		return res;
	}
}

function SpiralComponent() {
	const [data, updateField] = useDataSchema("spiral", {
		color: "#7129F4",
		compact: true,
	});

	return (
		<>
			<div className="px-12px pt-1 pb-3">
				<ComponentFields
					schema={{
						color: {
							type: "color",
							meta: {
								singleChoice: true,
								choiceSize: 30,
							},
						},
						compact: {
							label: "Spacing",
							type: "card",
							choices: [
								{
									label: "compact",
									value: true,
								},
								{
									label: "loose",
									value: false,
								},
							],
							meta: {
								transparent: true,
								renderChoice(compact) {
									const url = new SpiralDrawer().draw({
										infinite: true,
										compact,
									});

									return (
										<img
											className="bg-gray p-1"
											src={url}
											style={{
												height: "200%",
												transform:
													"translate(-45%, -40%)",
											}}
										/>
									);
								},
							},
						},
						infinite: {
							type: "grid",
							label: "",
							hint: "Click or drag and drop shape to add it to your canvas",
							noBorder: true,
							choices: [
								{
									label: "Spiral",
									value: true,
								},
								{
									label: "Concentric circles",
									value: false,
								},
							],
							meta: {
								columns: 2,
								// aspectRatio: "2/1.4",
								// transparent: true,
								render(infinite) {
									const url = new SpiralDrawer().draw({
										...data,
										infinite,
									});

									return (
										<DraggableImage
											className="p-2 h-full max-w-full object-fit"
											onClickOrDrag={() =>
												updateField({ infinite })
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

SpiralComponent.usePreview = () => {
	const [preview, setPreview] = useState();
	const [data] = useDataSchema("spiral", {
		color: "#7129F4",
		compact: true,
	});

	const handleQuickAction = (e) => {
		e.stopPropagation();

		addToDocument(preview);
	};

	useEffect(() => {
		if (preview || !data?.color) return;

		setPreview(new SpiralDrawer().draw(data));
	}, []);

	const quickAction = !data?.color
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

export default SpiralComponent;
