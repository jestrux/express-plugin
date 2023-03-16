import React, { useRef, useState } from "react";

import PresetGrid from "./tokens/PresetGrid";
import ContourComponent from "./ContourComponent";
import SpiralComponent from "./SpiralComponent";
import RibbonComponent from "./RibbonComponent";
import CloudComponent from "./CloudComponent";
import SpringComponent from "./SpringComponent";
import TornPaperComponent from "./TornPaperComponent";
import PolaroidComponent from "./PolaroidComponent";
import FrameComponent from "./FrameComponent";
import SpotifyComponent from "./SpotifyComponent";

const componentMap = {
	TornPaperComponent,
	PolaroidComponent,
	SpiralComponent,
	FrameComponent,
	RibbonComponent,
	SpotifyComponent,
	SpringComponent,
	CloudComponent,
	ContourComponent,
};

const presets = {
	clippedImage: {
		props: {},
		height: 90,
		fullWidth: true,
		floatingLabel: false,
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
	ribbon: {
		props: {},
		component: "RibbonComponent",
	},
	spotifyCard: {
		props: {},
		height: 90,
		fullWidth: true,
		floatingLabel: false,
		component: "SpotifyComponent",
	},
	spring: {
		props: {},
		component: "SpringComponent",
	},
	cloud: {
		props: {},
		component: "CloudComponent",
	},
	contour: {
		props: {},
		component: "ContourComponent",
	},
};

export default function App() {
	const [lastUpdate, setLastUpdate] = useState();
	const component = useRef(null);

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
