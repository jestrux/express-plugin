import React, { useEffect, useRef, useState } from "react";
import ComponentFieldEditor from "./tokens/ComponentFieldEditor";
import ComponentFields from "./tokens/ComponentFields";

class ContourDrawer {
	crop = false;
	constructor() {
		const canvas = document.createElement("canvas");
		canvas.width = 500;
		canvas.height = 500;
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}

	draw(props = {}) {
		Object.assign(this, props);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		return this.drawContour();
	}

	drawAtScale(image, scale) {
		const newSize = 500 * scale;
		const delta = (500 - newSize) / 2;

		this.ctx.drawImage(image, delta, delta, newSize, newSize);
	}

	async drawContour() {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		canvas.width = 500;
		canvas.height = 500;

		const lineWidth = 2;
		ctx.strokeStyle = this.color;
		ctx.lineWidth = lineWidth;

		const p = new Path2D(
			"M411,312Q421,374,372,424.5Q323,475,261,440.5Q199,406,159,376Q119,346,94,298Q69,250,92,201Q115,152,145,85Q175,18,238.5,54.5Q302,91,366,105Q430,119,415.5,184.5Q401,250,411,312Z"
		);
		ctx.stroke(p);

		this.ctx.drawImage(canvas, 0, 0);

		[0.88, 0.75, 0.6].forEach((scale) => this.drawAtScale(canvas, scale));

		ctx.clearRect(0, 0, 500, 500);
		ctx.lineWidth = 3;
		ctx.stroke(p);
		this.drawAtScale(canvas, 0.4);

		ctx.clearRect(0, 0, 500, 500);
		ctx.lineWidth = 5;
		ctx.stroke(p);
		this.drawAtScale(canvas, 0.2);

		return this.canvas.toDataURL();
	}
}

export default function ContourComponent() {
	const [data, setData] = useState({});
	const [url, setUrl] = useState();
	const previewRef = useRef(null);

	useEffect(() => {
		window.contourDrawer = new ContourDrawer();
		window.contourDrawer.draw().then(setUrl);

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
		console.log("New data: ", field, newValue);

		const updatedProps =
			typeof field == "string" ? { [field]: newValue } : field;
		const newData = { ...data, ...updatedProps };
		setData(newData);

		console.log("New data: ", newData);

		window.contourDrawer.draw(newData).then(setUrl);
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
								maxHeight: "30vh",
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
