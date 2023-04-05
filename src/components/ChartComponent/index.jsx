import React, { useEffect, useRef, useState } from "react";
import useDataSchema from "../../hooks/useDataSchema";
import ComponentFields from "../tokens/ComponentFields";
import { showPreview } from "../utils";
import PieChart, {
	defaultOptions as pieChartDefaultOptions,
	schema as pierChartSchema,
} from "./pier-chart";
import chartThemes from "./chart-themes";

class ChartComponentDrawer {
	constructor() {
		this.width = 1000;
		this.height = 1000;
	}

	async draw(props = {}) {
		Object.assign(this, props);

		return this.drawImage();
	}

	async drawImage() {
		let res = null;

		if (this.chart == "pie") {
			const chart = new PieChart({
				width: this.width,
				height: this.height,
				data: this.data,
				doughnutHoleSize: this.doughnutHoleSize,
				labels: this.labels,
				borders: this.borders,
				colors: this.colors ? Object.values(this.colors) : undefined,
			});

			res = chart.toDataURL();
		}

		showPreview(res);
		return res;
	}
}

export default function ChartComponent() {
	const previewRef = useRef(null);
	const chartComponentDrawerRef = useRef((data) => {
		if (!window.chartComponentDrawer)
			window.chartComponentDrawer = new ChartComponentDrawer();

		window.chartComponentDrawer.draw(data).then(setUrl);
	});
	const [url, setUrl] = useState();
	const [schema, setSchema] = useState(pierChartSchema);
	const [data, updateField, setData] = useDataSchema(
		{ chart: "pie", ...pieChartDefaultOptions },
		chartComponentDrawerRef.current
	);

	const handleUpdateField = (field, value) => {
		if (field == "chart") {
			setUrl("");

			if (value == "pie") {
				setData({
					chart: value,
					...pieChartDefaultOptions,
				});

				setSchema(pierChartSchema);

				return;
			}

			setData({ chart: value });
			setSchema({});

			return;
		}

		updateField(field, value);
	};

	useEffect(() => {
		chartComponentDrawerRef.current(data);

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
				// style={{ display: !url ? "none" : "" }}
			>
				<div className="image-item relative" draggable="true">
					<img
						onClick={exportImage}
						ref={previewRef}
						className="drag-target max-w-full"
						src={url}
						style={{ minHeight: "20vh", maxHeight: "20vh" }}
					/>
				</div>
			</div>

			<div className="px-12px mt-1">
				<ComponentFields
					schema={{
						chart: {
							type: "tag",
							label: "",
							choices: ["pie", "bar", "line"].map((value) => ({
								value,
								label: value + " Chart",
							})),
						},
						...schema,
						colors: {
							label: "Theme",
							type: "swatch",
							meta: { themes: chartThemes },
						},
					}}
					onChange={handleUpdateField}
					data={data}
				/>
			</div>
		</>
	);
}
