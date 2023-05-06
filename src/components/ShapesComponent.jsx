import React, { useEffect, useRef, useState } from "react";
import useDataSchema from "../hooks/useDataSchema";
import ComponentFields from "./tokens/ComponentFields";
import { showPreview } from "./utils";

class StickersComponentDrawer {
	constructor() {
		const canvas = document.createElement("canvas");
		this.canvas = canvas;
		canvas.width = 1000;
		canvas.height = 1000;
		this.ctx = canvas.getContext("2d");
	}

	async draw(props = {}) {
		Object.assign(this, props);

		// this.ctx.clearRect(0, 0, 2000, 2000);

		return this.drawRibbon();
	}

	drawRibbon() {
		const width = 200;
		const height = 800;

		this.canvas.height = height;
		this.canvas.width = width;
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
			ctx.lineTo(
				centerX + amplitude * Math.sin((8 * i * Math.PI) / 180),
				i * fold
			);
			ctx.stroke();
		}

		const res = this.canvas.toDataURL();

		showPreview(res);

		return res;
	}

	async drawImage() {
		const width = this.canvas.width;
		const height = this.canvas.height;
		const ctx = this.ctx;

		ctx.fillStyle = this.color;
		ctx.fillRect(0, 0, width, height);

		const res = this.canvas.toDataURL();

		showPreview(res);

		return res;
	}
}

export default function ShapesComponent() {
	const previewRef = useRef(null);
	const stickersDrawerRef = useRef((data) => {
		if (!window.stickersComponentDrawer)
			window.stickersComponentDrawer = new StickersComponentDrawer();

		window.stickersComponentDrawer.draw(data).then(setUrl);
	});
	const [url, setUrl] = useState();
	const [data, updateField] = useDataSchema(
		{
			color: "#ac1f40",
		},
		stickersDrawerRef.current
	);

	useEffect(() => {
		stickersDrawerRef.current(data);

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
					onChange={updateField}
					data={data}
				/>
			</div>
		</>
	);
}
