import React, { useEffect, useRef, useState } from "react";
import useDataSchema from "../../hooks/useDataSchema";
import staticImages from "../../staticImages";
import ComponentFields from "../tokens/ComponentFields";
import { backgroundSpec, solidGradientBg } from "../utils";
import * as stickers from "./stickers";

class StickerBadgeDrawer {
	constructor() {
		const canvas = document.createElement("canvas");
		canvas.width = 1000;
		canvas.height = 1000;
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}

	async draw(props = {}) {
		Object.assign(this, props);

		this.sticker = stickers[props.sticker];

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		return this.drawImage();
	}

	async drawImage() {
		const ctx = this.ctx;

		ctx.fillStyle = solidGradientBg(this.canvas, this.background);

		const p = new Path2D();
		p.addPath(new Path2D(this.sticker[0]));
		p.addPath(new Path2D(this.sticker[1]));
		ctx.fill(p);

		return this.canvas.toDataURL();
	}
}

export default function StickerBadgeComponent() {
	const previewRef = useRef(null);
	const stickerBadgeDrawerRef = useRef((data) => {
		if (!window.stickerBadgeDrawer)
			window.stickerBadgeDrawer = new StickerBadgeDrawer();

		window.stickerBadgeDrawer.draw(data).then(setUrl);
	});
	const [url, setUrl] = useState();
	const [data, updateField] = useDataSchema(
		{
			src: staticImages.presets.cylinder,
			sticker: "new",
			border: "transparent",
			background: {
				type: "gradient",
				color: "#ff2e6d",
				gradient: ["#E233FF", "#FF6B00"],
			},
		},
		stickerBadgeDrawerRef.current
	);

	useEffect(() => {
		stickerBadgeDrawerRef.current(data);

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
						sticker: {
							type: "tag",
							choices: Object.keys(stickers),
						},
						border: {
							type: "color",
							meta: { showTransparent: true },
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
