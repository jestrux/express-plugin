import React, { useEffect, useRef, useState } from "react";
import useDataSchema from "../../hooks/useDataSchema";
import ComponentFields from "../tokens/ComponentFields";
import * as waves from "./waves";

class WaveDrawer {
	constructor() {
		const canvas = document.createElement("canvas");
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}

	async draw(props = {}) {
		Object.assign(this, props);

		this.wave = waves[props.wave];

		this.canvas.width = this.wave.width;
		this.canvas.height = this.wave.height;

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		return this.drawImage();
	}

	async drawImage() {
		const ctx = this.ctx;
		const p = new Path2D();
		this.wave.paths.forEach((path) => p.addPath(new Path2D(path)));
		ctx.fillStyle = this.color;
		ctx.fill(p);

		return this.canvas.toDataURL();
	}
}

export default function WaveComponent() {
	const previewRef = useRef(null);
	const waveDrawerRef = useRef((data) => {
		if (!window.waveDrawer) window.waveDrawer = new WaveDrawer();

		window.waveDrawer.draw(data).then(setUrl);
	});
	const [url, setUrl] = useState();
	const [data, updateField] = useDataSchema(
		{
			wave: "beach",
			color: "#28a745",
		},
		waveDrawerRef.current
	);

	useEffect(() => {
		waveDrawerRef.current(data);

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
						wave: {
							type: "tag",
							label: "Wave type",
							choices: Object.keys(waves),
						},
						color: "color",
					}}
					onChange={updateField}
					data={data}
				/>
			</div>
		</>
	);
}
