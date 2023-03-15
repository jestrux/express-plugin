import React, { useEffect, useRef, useState } from "react";
import ComponentFieldEditor from "./tokens/ComponentFieldEditor";

class SpiralDrawer {
	a = 2;
	b = 1;
	crop = false;
	constructor() {
		const canvas = document.createElement("canvas");
		canvas.width = 300;
		canvas.height = 300;
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}

	draw(props = {}) {
		Object.assign(this, props);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		return this.drawContour();
	}

	async drawContour() {
		const ctx = this.ctx;
		const a = this.a;
		const b = this.a;
		const width = this.canvas.width;
		const height = this.canvas.height;
		const centerx = width / 2;
		const centery = height / 2;

		ctx.clearRect(0, 0, width, height);

		ctx.moveTo(centerx, centery);
		ctx.beginPath();
		for (let i = 0; i < 720; i++) {
			const angle = 0.1 * i;
			const x = centerx + (a + b * angle) * Math.cos(angle);
			const y = centery + (a + b * angle) * Math.sin(angle);

			ctx.lineTo(x, y);
		}

		ctx.strokeStyle = this.color;
		ctx.lineWidth = 2;
		ctx.stroke();

		return this.canvas.toDataURL();
	}
}

export default function SpiralComponent() {
	const [data, setData] = useState({});
	const [url, setUrl] = useState();
	const previewRef = useRef(null);

	useEffect(() => {
		if (!window.spiralDrawer) {
			window.spiralDrawer = new SpiralDrawer();
			window.spiralDrawer.draw().then(setUrl);

			window.AddOnSdk?.app.enableDragToDocument(previewRef.current, {
				previewCallback: (element) => {
					return new URL(element.src);
				},
				completionCallback: exportImage,
			});
		}
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

		window.spiralDrawer.draw(newData).then(setUrl);
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
