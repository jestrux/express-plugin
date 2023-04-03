import React, { useRef, useState } from "react";

import "./App.css";
import PresetGrid from "./components/tokens/PresetGrid";
import ContourComponent from "./components/ContourComponent";
import SpiralComponent from "./components/SpiralComponent";
import PoppyFlowerComponent from "./components/PoppyFlowerComponent";
import CloudComponent from "./components/CloudComponent";
import SpringComponent from "./components/SpringComponent";
import TornPaperComponent from "./components/TornPaperComponent";
import PolaroidComponent from "./components/PolaroidComponent";
import FrameComponent from "./components/FrameComponent";
import SpotifyComponent from "./components/SpotifyComponent";
import CylinderComponent from "./components/CylinderComponent";
import BrushComponent from "./components/BrushComponent";
import StickerBadgeComponent from "./components/StickerBadgeComponent";
import WeatherWidgetComponent from "./components/WeatherWidgetComponent";
import WaveComponent from "./components/WaveComponent";
import CalendarComponent from "./components/CalendarComponent";
import ClockWidgetComponent from "./components/ClockWidgetComponent";

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
};

const presets = {
	clippedImage: {
		props: {},
		height: 70,
		fullWidth: true,
		component: "TornPaperComponent",
	},
	polaroidCard: {
		props: {},
		component: "PolaroidComponent",
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
	const [lastUpdate, setLastUpdate] = useState();
	// const component = useRef(ClockWidgetComponent);
	const component = useRef();

	function setCurrentComponent(currentComponent) {
		component.current = componentMap[currentComponent];
		setLastUpdate(Date.now());
	}

	if (component.current) {
		const Component = component.current;

		return (
			<>
				<div className="p-3">
					<span
						className="hoverable inline-flex items-center cursor-pointer opacity-65 bg-black54 rounded-lg py-1 px-1"
						onClick={() => setCurrentComponent(null)}
					>
						<svg height="16" viewBox="0 0 24 24" width="24">
							<path
								fill="black"
								d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z"
							/>
						</svg>
						<span className="text-md mr-2">Back</span>
					</span>
				</div>

				<Component />
			</>
		);
	}

	return <PresetGrid presets={presets} onSelect={setCurrentComponent} />;
}
