import React, { useEffect, useRef, useState } from "react";
import useDataSchema from "../../hooks/useDataSchema";
import staticImages from "../../staticImages";
import ComponentFields from "../tokens/ComponentFields";
import { backgroundSpec, solidGradientBg } from "../utils";
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
		const ctx = this.ctx;
		const width = this.canvas.width;
		const height = this.canvas.height;
		ctx.fillStyle = solidGradientBg(this.canvas, this.background);

		const p = new Path2D(this.brush.path);
		ctx.fill(p);

		if (this.text) {
			ctx.fillStyle = this.text.color;
			const fontSize = 140;
			ctx.font = `bold ${fontSize}px 'Sacre Bleu MVB, script'`;
			const text = this.text.label;
			const metrics = ctx.measureText(text);

			ctx.fillText(
				text,
				(width - metrics.width) / 2,
				(fontSize + height) / 2 - 30
			);
		}

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
			// text: {
			// 	label: "Splat",
			// 	color: "#FFF",
			// },
			background: {
				type: "gradient",
				color: "#995533",
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

			<div className="px-12px mt-1">
				<ComponentFields
					schema={{
						brush: {
							type: "tag",
							choices: Object.keys(brushes),
						},
						text: {
							type: "section",
							optional: true,
							children: {
								label: {
									label: "",
									defaultValue: "Text",
									noMargin: true,
								},
								color: {
									type: "color",
									label: "",
									defaultValue: "#FFFFFF",
									meta: {
										singleChoice: true,
										choiceSize: 28,
									},
								},
							},
						},
						background: backgroundSpec(),
					}}
					onChange={updateField}
					data={data}
				/>
			</div>
		</>
	);
}
