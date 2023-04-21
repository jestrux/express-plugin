import React, { useEffect, useRef, useState } from "react";
import useDataSchema from "../../hooks/useDataSchema";
import ComponentFields from "../tokens/ComponentFields";
import { showPreview } from "../utils";
import arrows from "./arrows";

class ArrowComponentDrawer {
	constructor() {
		const canvas = document.createElement("canvas");
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}

	async draw(props = {}) {
		Object.assign(this, props);

		return this.drawImage();
	}

	async drawImage() {
		const ctx = this.ctx;
		const { width, height, path } = arrows[this.arrow];
		this.canvas.width = width;
		this.canvas.height = height;

		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		ctx.fillStyle = this.color;

		ctx.beginPath();
		ctx.fill(new Path2D(path));

		const res = this.canvas.toDataURL();

		showPreview(res);

		return res;
	}
}

export default function ArrowComponent() {
	const previewRef = useRef(null);
	const arrowComponentDrawerRef = useRef((data) => {
		if (!window.arrowComponentDrawer)
			window.arrowComponentDrawer = new ArrowComponentDrawer();

		window.arrowComponentDrawer.draw(data).then(setUrl);
	});
	const [url, setUrl] = useState();
	const [data, updateField] = useDataSchema(
		{
			color: "#ac1f40",
			arrow: Object.keys(arrows)[0],
		},
		arrowComponentDrawerRef.current
	);

	useEffect(() => {
		arrowComponentDrawerRef.current(data);

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
						style={{ height: "20vh" }}
					/>
				</div>
			</div>

			<div className="px-12px mt-1">
				<ComponentFields
					schema={{
						arrow: {
							type: "grid",
							label: "",
							choices: Object.keys(arrows),
							meta: {
								render(value) {
									const { width, height, path } =
										arrows[value];

									return (
										<svg
											className="p-3 w-full"
											viewBox={`0 0 ${width} ${height}`}
											fill={data.color}
										>
											<path d={path} />
										</svg>
									);
								},
							},
						},
						color: {
							type: "color",
							label: "",
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
