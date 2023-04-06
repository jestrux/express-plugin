import React, { useRef, useState } from "react";

import PresetGrid from "./tokens/PresetGrid";
import ContourComponent from "./ContourComponent";
import SpiralComponent from "./SpiralComponent";
import PoppyFlowerComponent from "./PoppyFlowerComponent";
import CloudComponent from "./CloudComponent";
import SpringComponent from "./SpringComponent";
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

const componentMap = {
	TornPaperComponent,
	PolaroidComponent,
	SpiralComponent,
	FrameComponent,
	PoppyFlowerComponent,
	SpotifyComponent,
	SpringComponent,
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
};

const presets = {
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
	polaroidCard: {
		props: {},
		component: "PolaroidComponent",
	},
	charts: {
		props: {},
		component: "ChartComponent",
	},
	spiral: {
		props: {},
		component: "SpiralComponent",
	},
	framedImage: {
		props: {},
		component: "FrameComponent",
	},
	stickerBadge: {
		props: {},
		component: "StickerBadgeComponent",
	},
	brushBackground: {
		props: {},
		component: "BrushComponent",
	},
	cylinder: {
		props: {},
		component: "CylinderComponent",
	},
	calendar: {
		props: {},
		component: "CalendarComponent",
	},
	clock: {
		props: {},
		component: "ClockWidgetComponent",
	},
	weatherWidget: {
		props: {},
		component: "WeatherWidgetComponent",
	},
	poppyFlower: {
		props: {},
		component: "PoppyFlowerComponent",
	},
	spring: {
		props: {},
		component: "SpringComponent",
	},
	waves: {
		props: {},
		component: "WaveComponent",
	},
	contour: {
		props: {},
		component: "ContourComponent",
	},
	cloud: {
		props: {},
		component: "CloudComponent",
	},
	spotifyCard: {
		props: {},
		height: 70,
		fullWidth: true,
		component: "SpotifyComponent",
	},
};

export default function App() {
	const [currentComponent, setCurrentComponent] = useState();
	const component = useRef(ChartComponent);
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
