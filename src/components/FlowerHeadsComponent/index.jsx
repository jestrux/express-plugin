// https://www.freepik.com/free-vector/colorful-flower-icons_762773.htm#page=2&query=flower%20head&position=19&from_view=search&track=ais
import React, { useEffect, useRef, useState } from "react";
import useDataSchema from "../../hooks/useDataSchema";
import ComponentFields from "../tokens/ComponentFields";
import { showPreview } from "../utils";
import flowerHeads from "./flower-heads";

class FlowerHeadsComponentDrawer {
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
		const { width, height, path } = flowerHeads[this.flowerHead];
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

export default function FlowerHeadsComponent() {
	const previewRef = useRef(null);
	const flowerHeadsComponentDrawerRef = useRef((data) => {
		if (!window.flowerHeadsComponentDrawer)
			window.flowerHeadsComponentDrawer =
				new FlowerHeadsComponentDrawer();

		window.flowerHeadsComponentDrawer.draw(data).then(setUrl);
	});
	const [url, setUrl] = useState();
	const [data, updateField] = useDataSchema(
		{
			color: "#ed2232",
			flowerHead: Object.keys(flowerHeads)[0],
		},
		flowerHeadsComponentDrawerRef.current
	);

	const handleChange = (key, value) => {
		if (key == "flowerHead") {
			const { fill: color } = flowerHeads[value];

			updateField({
				flowerHead: value,
				color,
			});

			return;
		}
		updateField(key, value);
	};

	useEffect(() => {
		flowerHeadsComponentDrawerRef.current(data);

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
						flowerHead: {
							type: "grid",
							label: "",
							choices: Object.keys(flowerHeads),
							meta: {
								render(value) {
									const { width, height, path, fill } =
										flowerHeads[value];

									return (
										<svg
											className="p-3 w-full"
											viewBox={`0 0 ${width} ${height}`}
											fill={fill}
										>
											<path d={path} />
										</svg>
									);
								},
							},
						},
						color: {
							type: "color",
							// label: "",
							inline: true,
							meta: {
								// singleChoice: true,
								// choiceSize: 30,
								colors: [
									"#379b98",
									"#f25629",
									"#ebd913",
									"#ed2232",
								],
							},
						},
					}}
					onChange={handleChange}
					data={data}
				/>
			</div>
		</>
	);
}
