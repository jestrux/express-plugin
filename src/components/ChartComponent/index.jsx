import React, { useEffect, useRef, useState } from "react";
import useDataSchema from "../../hooks/useDataSchema";
import ComponentFields from "../tokens/ComponentFields";
import { showPreview } from "../utils";
import PieChart, {
	defaultOptions as pieChartDefaultOptions,
	schema as pieChartSchema,
} from "./pier-chart";
import BarChart, {
	defaultOptions as barChartDefaultOptions,
	schema as barChartSchema,
} from "./bar-chart";

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
		const chartProperties = Object.assign(
			{
				...(this.settings ? this.settings : {}),
			},
			this
		);

		const res = {
			pie: new PieChart(chartProperties).toDataURL(),
			bar: new BarChart(chartProperties).toDataURL(),
		}[this.chart];

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
	const [schema, setSchema] = useState(pieChartSchema);
	const [data, updateField, setData] = useDataSchema(
		{ chart: "pie", ...pieChartDefaultOptions },
		chartComponentDrawerRef.current
	);

	const handleUpdateField = (field, value) => {
		if (field == "chart") {
			setUrl("");
			const chartData = {
				pie: pieChartDefaultOptions,
				bar: barChartDefaultOptions,
			}[value];
			const chartSchema = {
				pie: pieChartSchema,
				bar: barChartSchema,
			}[value];

			setData({
				chart: value,
				...(chartData ? chartData : {}),
			});
			setSchema({
				...(chartSchema ? chartSchema : {}),
			});

			return;
		}

		if (field == "colors") value = Object.values(value);

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
					key={data.chart}
					schema={{
						chart: {
							type: "tag",
							label: "",
							choices: ["pie", "bar"].map((value) => ({
								value,
								label: value + " Chart",
							})),
						},
						...schema,
					}}
					onChange={handleUpdateField}
					data={data}
				/>
			</div>
		</>
	);
}
