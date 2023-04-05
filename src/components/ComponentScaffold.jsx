import React, { useEffect, useRef, useState } from "react";
import useDataSchema from "../hooks/useDataSchema";
import ComponentFields from "./tokens/ComponentFields";
import { showPreview } from "./utils";

class ChartComponentDrawer {
	constructor() {
		const canvas = document.createElement("canvas");
		this.canvas = canvas;
		canvas.width = 1000;
		canvas.height = 1000;
		this.ctx = canvas.getContext("2d");
	}

	async draw(props = {}) {
		Object.assign(this, props);

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		return this.drawImage();
	}

	async drawImage() {
		const width = this.canvas.width;
		const height = this.canvas.height;
		const ctx = this.ctx;

		ctx.fillStyle = this.background || "transparent";
		ctx.fillRect(0, 0, width, height);

		const res = this.canvas.toDataURL();

		showPreview(res);

		return res;
	}
}

export default function ChartComponentComponent() {
	const previewRef = useRef(null);
	const chartComponentDrawerRef = useRef((data) => {
		if (!window.chartComponentDrawer)
			window.chartComponentDrawer = new ChartComponentDrawer();

		window.chartComponentDrawer.draw(data).then(setUrl);
	});
	const [url, setUrl] = useState();
	const [data, updateField] = useDataSchema(
		{
			color: "#ac1f40",
		},
		chartComponentDrawerRef.current
	);

	useEffect(() => {
		chartComponentDrawerRef.current(data);

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
						color: {
							type: "color",
							inline: true,
							meta: {
								singleChoice: true,
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
