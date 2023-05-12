import React, { useEffect, useState } from "react";
import useDataSchema from "../hooks/useDataSchema";
import staticImages from "../staticImages";
import ComponentFields from "./tokens/ComponentFields";
import {
	addToDocument,
	backgroundSpec,
	resizeToAspectRatio,
	solidGradientBg,
} from "./utils";
import DraggableImage from "./tokens/DraggableImage";
import useImage from "../hooks/useImage";
import Loader from "./tokens/Loader";
import InfoCard from "./tokens/InfoCard";

class CylinderDrawer {
	padding = 40;
	strokeWidth = 5;
	smoothCorners = false;
	constructor() {
		const canvas = document.createElement("canvas");
		canvas.width = 500;
		canvas.height = 1000;
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}

	addBorder() {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const padding = this.padding;
		const width = this.canvas.width + padding + this.strokeWidth * 2;
		const height = this.canvas.height + padding + this.strokeWidth * 2;
		let radius = Math.max(width, height, 1000);
		const cornerRadius = this.smoothCorners ? 120 : 0;
		radius = this.half
			? [radius, radius, cornerRadius, cornerRadius]
			: radius;

		canvas.width = width;
		canvas.height = height;

		ctx.strokeStyle = this.border || "transparent";
		ctx.fillStyle =
			solidGradientBg(canvas, this.background) || "transparent";
		ctx.lineWidth = this.strokeWidth;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";

		ctx.beginPath();
		ctx.roundRect(
			this.strokeWidth,
			this.strokeWidth,
			width - this.strokeWidth * 2,
			height - this.strokeWidth * 2,
			radius
		);
		ctx.stroke();
		ctx.fill();

		ctx.drawImage(
			this.canvas,
			padding / 2 + this.strokeWidth,
			padding / 2 + this.strokeWidth,
			this.canvas.width,
			this.canvas.height
		);

		return canvas;
	}

	draw(props = {}) {
		Object.assign(this, props);

		this.canvas.width = props.half ? 1000 : 600;
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// if (!this.img || props.src != this.src)
		// this.img = await loadImageFromUrl(props.src);

		return this.drawImage();
	}

	drawImage() {
		const width = this.canvas.width;
		const height = this.canvas.height;
		const ctx = this.ctx;

		let radius = Math.max(width, height, 1000);
		const cornerRadius = this.smoothCorners ? 80 : 0;
		radius = this.half
			? [radius, radius, cornerRadius, cornerRadius]
			: radius;

		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = solidGradientBg(this.canvas, this.background) || "#333";
		ctx.beginPath();
		ctx.roundRect(0, 0, width, height, radius);
		ctx.fill();
		ctx.clip();

		this.ctx.drawImage(
			resizeToAspectRatio(this.img, width / height),
			0,
			0,
			width,
			height
		);

		if (this.inset) return this.addBorder().toDataURL();

		return this.canvas.toDataURL();
	}
}

function CylinderComponent() {
	const {
		loading,
		image: img,
		picker: Picker,
		changed,
	} = useImage(staticImages.presets.cylinder);

	const [data, updateField] = useDataSchema("cylinder", {
		half: true,
		inset: true,
		smoothCorners: true,
		border: "#aaaaaa",
		background: {
			type: "gradient",
			color: "#ffc107",
			gradient: ["#BF953F", "#FCF6BA", "#AA771C"],
		},
	});

	return (
		<>
			{!changed && (
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
						// half: "boolean",
						// smoothCorners: {
						// 	type: "boolean",
						// 	show: (state) => state.half,
						// },
						borderColor: {
							type: "color",
							meta: {
								singleChoice: true,
								choiceSize: 30,
							},
							show: ({ inset }) => inset == "border",
						},
						inset: {
							type: "boolean",
							...(!data.inset
								? {}
								: {
										noBorder: true,
										noMargin: true,
										wrapperProps: {
											className: "pb-1",
										},
								  }),
						},
						background: backgroundSpec({
							show: ({ inset }) => inset,
						}),
						picker: {
							type: "grid",
							label: "",
							hint: "Click or drag and drop shape to add it to your canvas",
							choices: [true, false],
							noBorder: true,
							meta: {
								columns: 1,
								aspectRatio: "2/1.5",
								render(half) {
									if (loading || !img)
										return <Loader fillParent={true} />;

									const url = new CylinderDrawer().draw({
										...data,
										img,
										half,
									});

									return (
										<DraggableImage
											className="p-3 h-full max-w-full object-fit"
											onClickOrDrag={() =>
												updateField({ ...data, half })
											}
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

CylinderComponent.usePreview = () => {
	const [preview, setPreview] = useState();
	const [data] = useDataSchema("cylinder", {
		// border: "#aaaaaa",
		// background: {
		// 	type: "gradient",
		// 	color: "#ffc107",
		// 	gradient: ["#BF953F", "#FCF6BA", "#AA771C"],
		// },
	});
	const {
		changed,
		image: img,
		loading,
		picker: Picker,
	} = useImage(staticImages.presets.cylinder);
	const noData = !data?.border;

	const handleQuickAction = (e) => {
		e.stopPropagation();
	};

	useEffect(() => {
		if (!img || loading) return;

		const image = new CylinderDrawer().draw({
			...data,
			img,
		});

		setPreview(image);

		if (!noData) addToDocument(image);
	}, [changed, img, loading]);

	const quickAction = noData
		? null
		: (children) => {
				return (
					<button
						className="flex items-center cursor-pointer bg-transparent border border-transparent p-0"
						onClick={handleQuickAction}
					>
						{loading ? (
							<>
								<Loader small />
								<span className="flex-1"></span>
							</>
						) : (
							<Picker>{children("Upload image")}</Picker>
						)}
					</button>
				);
		  };

	return {
		quickAction,
		preview,
		loading,
	};
};

export default CylinderComponent;
