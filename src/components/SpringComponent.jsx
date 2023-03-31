import React, { useEffect, useRef, useState } from "react";
import ComponentFieldEditor from "./tokens/ComponentFieldEditor";

class SpringDrawer {
	constructor() {
		const canvas = document.createElement("canvas");
		canvas.width = 50;
		canvas.height = 180;
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}

	draw(props = {}) {
		Object.assign(this, props);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		return this.drawCloud();
	}

	async drawCloud() {
		const ctx = this.ctx;
		ctx.lineWidth = 10;
		ctx.strokeStyle = this.color;

		ctx.beginPath();
		ctx.moveTo(25, 0);
		for (var i = 0; i <= 220; i++) {
			const wide = 20; // 5 - 20
			const fold = 0.8; // 0.6 - 1
			ctx.lineTo(25 + wide * Math.sin((8 * i * Math.PI) / 180), i * fold);
			ctx.lineWidth = 5;
			ctx.stroke();
		}

		// ctx.stroke();
		// ctx.fill();

		return this.canvas.toDataURL();
	}
}

export default function SpringComponent() {
	const [data, setData] = useState({ color: "#ffc107" });
	const [url, setUrl] = useState();
	const previewRef = useRef(null);

	useEffect(() => {
		window.springDrawer = new SpringDrawer();
		window.springDrawer.draw(data).then(setUrl);

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

		window.springDrawer.draw(newData).then(setUrl);
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
