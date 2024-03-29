import React, { useEffect, useRef, useState } from "react";
import ComponentFieldEditor from "./tokens/ComponentFieldEditor";

class CloudDrawer {
	constructor() {
		const canvas = document.createElement("canvas");
		canvas.width = 300;
		canvas.height = 250;
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
		ctx.strokeStyle = "#000";
		ctx.fillStyle = this.color;

		ctx.beginPath();
		ctx.arc(150, 95, 80, 0, Math.PI * 2, true);

		ctx.moveTo(180, 205);
		ctx.arc(95, 155, 80, 0, Math.PI * 2, true);

		ctx.moveTo(280, 195);
		ctx.arc(205, 155, 80, 0, Math.PI * 2, true);

		// ctx.stroke();
		ctx.fill();

		return this.canvas.toDataURL();
	}
}

export default function CloudComponent() {
	const [data, setData] = useState({ color: "#51a0f6" });
	const [url, setUrl] = useState();
	const previewRef = useRef(null);

	useEffect(() => {
		window.cloudDrawer = new CloudDrawer();
		window.cloudDrawer.draw(data).then(setUrl);

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

		window.cloudDrawer.draw(newData).then(setUrl);
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
