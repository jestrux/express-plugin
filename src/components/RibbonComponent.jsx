import React, { useEffect, useRef, useState } from "react";
import ComponentFieldEditor from "./tokens/ComponentFieldEditor";
import { showPreview } from "./utils";

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
		return this.drawCloud();
	}

	async drawCloud() {
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
}

export default function RibbonComponent() {
	const [data, setData] = useState({ color: "#ffc107" });
	const [url, setUrl] = useState();
	const previewRef = useRef(null);

	useEffect(() => {
		window.ribbonDrawer = new RibbonDrawer();
		window.ribbonDrawer.draw(data).then(setUrl);

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

	function updateField(field, newValue) {
		const updatedProps =
			typeof field == "string" ? { [field]: newValue } : field;
		const newData = { ...data, ...updatedProps };
		setData(newData);

		window.ribbonDrawer.draw(newData).then(setUrl);
	}

	return (
		<>
			<div className="relative border-b flex center-center p-3">
				<div className="relative">
					<div
						className="w-full image-item relative"
						draggable="true"
					>
						<img
							onClick={exportImage}
							ref={previewRef}
							className="drag-target max-w-full"
							src={url}
							style={{
								maxHeight: "20vh",
							}}
						/>
					</div>
				</div>
			</div>

			<div className="px-12px py-3">
				<ComponentFieldEditor
					field={{ __id: "color", label: "Color", type: "color" }}
					onChange={updateField}
				/>
			</div>
		</>
	);
}
