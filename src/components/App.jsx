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
};

const presets = {
	layouts: {
		props: {},
		// height: 70,
		// fullWidth: true,
		component: "LayoutsComponent",
	},
	backgroundPattern: {
		props: {},
		// height: 70,
		// fullWidth: true,
		component: "BackgroundPatternComponent",
	},
	clippedImage: {
		props: {},
		// height: 70,
		// fullWidth: true,
		component: "TornPaperComponent",
	},
	charts: {
		props: {},
		component: "ChartComponent",
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
	cylinder: {
		props: {},
		component: "CylinderComponent",
	},
	frame: {
		props: {},
		// halfWidth: true,
		component: "FrameComponent",
	},
	poppyFlower: {
		props: {},
		component: "PoppyFlowerComponent",
	},
	clock: {
		props: {},
		// halfWidth: true,
		component: "ClockWidgetComponent",
	},
	stickerBadge: {
		props: {},
		component: "StickerBadgeComponent",
	},
	waves: {
		props: {},
		component: "WaveComponent",
	},
	polaroid: {
		props: {},
		// halfWidth: true,
		component: "PolaroidComponent",
	},
	weather: {
		props: {},
		// halfWidth: true,
		component: "WeatherWidgetComponent",
	},
	ribbon: {
		props: {},
		component: "RibbonComponent",
	},
	spiral: {
		props: {},
		component: "SpiralComponent",
	},
	calendar: {
		props: {},
		// halfWidth: true,
		component: "CalendarComponent",
	},
	color: {
		props: {},
		// halfWidth: true,
		component: "ColorComponent",
	},
	// "Deco Shapes": {
	// 	props: {},
	// 	component: "SpotifyComponent",
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
	const component = useRef(GridComponent);
	// const component = useRef();

	function handleSetCurrentComponent(currentComponent, name = "") {
		component.current = componentMap[currentComponent];
		setCurrentComponent(name);
	}

	if (component.current) {
		const Component = component.current;

		return (
			<>
				<div className="px-4 mb-3 flex items-center gap-2">
					<button
						className="border hoverable inline-flex center-center cursor-pointer bg-black26 rounded-sm aspect-square"
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
						style={{ fontSize: "1rem" }}
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
