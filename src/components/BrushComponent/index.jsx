import React, { useEffect, useRef, useState } from "react";
import useDataSchema from "../../hooks/useDataSchema";
import staticImages from "../../staticImages";
import ImagePicker from "../tokens/ImagePicker";
import ComponentFields from "../tokens/ComponentFields";
import * as brushes from "./brushes";

class BrushDrawer {
	constructor() {
		const canvas = document.createElement("canvas");
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}

	async draw(props = {}) {
		Object.assign(this, props);

		this.brush = brushes[props.brush];

		this.canvas.width = this.brush.width;
		this.canvas.height = this.brush.height;

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		return this.drawImage();
	}

	async drawImage() {
		const width = this.canvas.width;
		const height = this.canvas.height;
		const ctx = this.ctx;

		ctx.fillStyle = this.background.color;

		if (this.background.type == "gradient") {
			const gradient = ctx.createLinearGradient(0, 0, width, height);

			const gradientColors = this.background.gradient;
			gradientColors.map((color, index) =>
				gradient.addColorStop(
					index / Math.max(gradientColors.length - 1, 1),
					color
				)
			);

			ctx.fillStyle = gradient;
		}

		const p = new Path2D(this.brush.path);
		ctx.fill(p);
		ctx.clip();

		// const gradient = ctx.createLinearGradient(0, 0, width, height);
		// gradient.addColorStop(0, "#F06966");
		// gradient.addColorStop(1, "#FAD6A6");
		// ctx.fillStyle = gradient;
		// ctx.fillRect(0, 0, width, height);

		return this.canvas.toDataURL();
	}
}

export default function BrushComponent() {
	const previewRef = useRef(null);
	const brushDrawerRef = useRef((data) => {
		if (!window.brushDrawer) window.brushDrawer = new BrushDrawer();

		window.brushDrawer.draw(data).then(setUrl);
	});
	const [url, setUrl] = useState();
	const [data, updateField] = useDataSchema(
		{
			src: staticImages.presets.cylinder,
			brush: "splotch",
			background: {
				type: "gradient",
				color: "#ff2e6d",
				gradient: ["#9055FF", "#13E2DA"],
			},
		},
		brushDrawerRef.current
	);

	useEffect(() => {
		brushDrawerRef.current(data);

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

			<div className="px-12px">
				<div className="my-4">
					<ImagePicker onChange={(src) => updateField("src", src)} />
				</div>

				<ComponentFields
					schema={{
						brush: {
							type: "tag",
							choices: Object.keys(brushes),
						},
						background: {
							type: "section",
							children: {
								type: {
									type: "radio",
									choices: ["color", "gradient"],
								},
								color: {
									type: "color",
									show: (state) => state.type == "color",
								},
								gradient: {
									type: "gradient",
									show: (state) => state.type == "gradient",
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
