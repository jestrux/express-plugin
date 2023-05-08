import React from "react";
import useDataSchema from "../hooks/useDataSchema";
import staticImages from "../staticImages";
import ComponentFields from "./tokens/ComponentFields";
import { showPreview } from "./utils";
import useImage from "../hooks/useImage";
import DraggableImage from "./tokens/DraggableImage";
import Loader from "./tokens/Loader";
import InfoCard from "./tokens/InfoCard";

class PolaroidDrawer {
	constructor() {
		const canvas = document.createElement("canvas");
		canvas.width = 320;
		canvas.height = 120;
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}

	toasterGradient(width, height) {
		var texture = document.createElement("canvas");
		var ctx = texture.getContext("2d");

		texture.width = width;
		texture.height = height;

		// Fill a Radial Gradient
		// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createRadialGradient
		var gradient = ctx.createRadialGradient(
			width / 2,
			height / 2,
			0,
			width / 2,
			height / 2,
			width * 0.6
		);

		gradient.addColorStop(0, "#804e0f");
		gradient.addColorStop(1, "#3b003b");

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, width, height);

		return texture;
	}

	addPolaroid() {
		const canvas = this.canvas;
		const width = canvas.width;
		const height = canvas.height;
		const landScape = width > height;

		const px = width * 0.025;
		const pt = px;
		const pb = this.evenSides ? px : px * 5;

		const polaroid = document.createElement("canvas");
		polaroid.width = width + px;
		polaroid.height = height + pt + pb;

		const ctx = polaroid.getContext("2d");

		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.shadowColor = "rgba(0,0,0,0.2)";
		ctx.shadowBlur = 10;
		ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = 2;
		ctx.rect(5, 5, width - 10, height - 10);
		ctx.fill();
		ctx.restore();
		ctx.clip();

		ctx.drawImage(
			this.toasterGradient(width, height),
			px,
			pt,
			width - px * 2,
			height - pt - pb
		);

		if (this.filter) ctx.globalCompositeOperation = this.filter;

		ctx.drawImage(this.img, 0, 0);

		return polaroid;
	}

	draw(props = {}) {
		Object.assign(this, props);
		this.canvas.width = props.img.naturalWidth;
		this.canvas.height = props.img.naturalHeight;

		this.ctx.clearRect(0, 0, 2000, 2000);

		return this.drawImage();
	}

	drawImage() {
		const res = this.addPolaroid().toDataURL();

		showPreview(res);

		return res;
	}
}

export default function PolaroidComponent() {
	const {
		loading,
		image: img,
		picker: Picker,
	} = useImage(staticImages.presets.polaroid);

	const [data, updateField] = useDataSchema({
		evenSides: false,
		filter: "exclusion",
	});

	return (
		<>
			{!loading &&
				img?.src.indexOf(staticImages.presets.polaroid) != -1 && (
					<InfoCard infoIcon>
						Default image is royalty free, sourced from Unsplash
					</InfoCard>
				)}

			<div className="border-t">
				<Picker />
			</div>

			<div className="px-12px">
				<ComponentFields
					schema={{
						picker: {
							type: "grid",
							label: "",
							hint: "Click (or drag and drop) image to add it to your canvas",
							choices: [
								"color-dodge",
								// "exclusion",
								"lighten",
								// "luminosity",
								"screen",
							],
							noBorder: true,
							meta: {
								transparent: true,
								columns: 2,
								aspectRatio:
									!img || loading
										? undefined
										: `${img.naturalWidth} / ${img.naturalHeight}`,
								render(filter) {
									if (!img || loading)
										return <Loader fillParent={true} />;

									const url = new PolaroidDrawer().draw({
										...data,
										img,
										filter,
									});
									return (
										<DraggableImage
											className="h-full max-w-full object-fit"
											src={url}
											style={{
												objectFit: "contain",
												filter: "drop-shadow(0.5px 0.5px 0.5px rgba(0, 0, 0, 0.4))",
											}}
										/>
									);
								},
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
