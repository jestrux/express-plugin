import React, { useRef, useState } from "react";

import PresetGrid from "./tokens/PresetGrid";
import ContourComponent from "./ContourComponent";
import SpiralComponent from "./SpiralComponent";
import PoppyFlowerComponent from "./PoppyFlowerComponent";
import CloudComponent from "./CloudComponent";
import RibbonComponent from "./RibbonComponent";
import TornPaperComponent from "./TornPaperComponent";
import PolaroidComponent from "./PolaroidComponent";
import FrameComponent from "./FrameComponent";
import SpotifyComponent from "./SpotifyComponent";
import CylinderComponent from "./CylinderComponent";
import BrushComponent from "./BrushComponent";
import StickerBadgeComponent from "./StickerBadgeComponent";
import WeatherWidgetComponent from "./WeatherWidgetComponent";
import WaveComponent from "./WaveComponent";
import CalendarComponent from "./CalendarComponent";
import ClockWidgetComponent from "./ClockWidgetComponent";
import BackgroundPatternComponent from "./BackgroundPatternComponent";
import { camelCaseToSentenceCase } from "./utils";
import ChartComponent from "./ChartComponent";
import MapComponent from "./MapComponent";
import ColorComponent from "./ColorComponent";
import LayoutsComponent from "./layouts";
import GridComponent from "./GridComponent";
import ArrowComponent from "./ArrowComponent";
import FlowerHeadsComponent from "./FlowerHeadsComponent";
import ShapesComponent from "./ShapesComponent";

const componentMap = {
	TornPaperComponent,
	PolaroidComponent,
	SpiralComponent,
	FrameComponent,
	PoppyFlowerComponent,
	SpotifyComponent,
	RibbonComponent,
	CloudComponent,
	CylinderComponent,
	ContourComponent,
	BrushComponent,
	StickerBadgeComponent,
	WeatherWidgetComponent,
	WaveComponent,
	CalendarComponent,
	ClockWidgetComponent,
	BackgroundPatternComponent,
	ChartComponent,
	MapComponent,
	ColorComponent,
	LayoutsComponent,
	GridComponent,
	ArrowComponent,
	FlowerHeadsComponent,
	ShapesComponent,
};

const presets = {
	layouts: {
		props: {},
		component: "LayoutsComponent",
	},
	backgroundPattern: {
		props: {},
		component: "BackgroundPatternComponent",
	},
	clippedImage: {
		props: {},
		component: "TornPaperComponent",
	},
	map: {
		props: {},
		component: "MapComponent",
	},
	brushBackground: {
		props: {},
		component: "BrushComponent",
	},
	grid: {
		props: {},
		component: "GridComponent",
	},
	polaroid: {
		props: {},
		component: "PolaroidComponent",
	},
	pill: {
		props: {},
		component: "CylinderComponent",
	},
	flowerHeads: {
		props: {},
		component: "FlowerHeadsComponent",
	},
	color: {
		props: {},
		component: "ColorComponent",
	},
	stickerBadge: {
		props: {},
		component: "StickerBadgeComponent",
	},
	waves: {
		props: {},
		component: "WaveComponent",
	},
	arrows: {
		props: {},
		component: "ArrowComponent",
	},
	weather: {
		props: {},
		component: "WeatherWidgetComponent",
	},
	spiral: {
		props: {},
		component: "SpiralComponent",
	},
	ribbon: {
		props: {},
		component: "RibbonComponent",
	},
	// charts: {
	// 	props: {},
	// 	component: "ChartComponent",
	// },
	// frame: {
	// 	props: {},
	// 	component: "FrameComponent",
	// },
	// poppyFlower: {
	// 	props: {},
	// 	component: "PoppyFlowerComponent",
	// },
	// clock: {
	// 	props: {},
	// 	component: "ClockWidgetComponent",
	// },
	// calendar: {
	// 	props: {},
	// 	component: "CalendarComponent",
	// },
	// "Deco Shapes": {
	// 	props: {},
	// 	component: "ShapesComponent",
	// },
	// contour: {
	// 	props: {},
	// 	component: "ContourComponent",
	// },
	// cloud: {
	// 	props: {},
	// 	component: "CloudComponent",
	// },
	// spotifyCard: {
	// 	props: {},
	// 	height: 70,
	// 	fullWidth: true,
	// 	component: "SpotifyComponent",
	// },
};

export default function App() {
	const [currentComponent, setCurrentComponent] = useState();
	// const component = useRef(RibbonComponent);
	const component = useRef();

	function handleSetCurrentComponent(currentComponent, name = "") {
		component.current = componentMap[currentComponent];
		setCurrentComponent(name);
	}

	if (component.current) {
		const Component = component.current;

		return (
			<>
				<div className="px-2 border-b pb-3 flex items-center gap-2">
					<button
						className="back-button border hoverable inline-flex center-center cursor-pointer bg-black26 rounded-sm aspect-square"
						onClick={() => handleSetCurrentComponent(null)}
						style={{
							width: "24px",
							padding: 0,
							paddingRight: "1px",
						}}
					>
						<svg
							height="16"
							viewBox="0 0 24 24"
							strokeWidth={2.6}
							stroke="currentColor"
							fill="none"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M15.75 19.5L8.25 12l7.5-7.5"
							/>
						</svg>
					</button>

					<span
						className="capitalize font-medium"
						style={{
							fontSize: "1rem",
							lineHeight: "1",
							fontWeight: "bold",
							letterSpacing: "-0.03em",
						}}
					>
						{camelCaseToSentenceCase(currentComponent)}
					</span>
				</div>

				<Component />
			</>
		);
	}

	return (
		<PresetGrid presets={presets} onSelect={handleSetCurrentComponent} />
	);
}
