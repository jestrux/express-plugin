import React from "react";

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

export default function App() {
	// return <SpringComponent />;

	const presets = {
		clippedImage: {
			props: {},
			height: 90,
			fullWidth: true,
			floatingLabel: false,
		},
		polaroidCard: {
			props: {},
		},
		spiral: {
			props: {},
		},
		framedImage: {
			props: {},
		},
		ribbon: {
			props: {},
		},
		spotifyCard: {
			props: {},
			height: 90,
			fullWidth: true,
			floatingLabel: false,
		},
		spring: {
			props: {},
		},
		cloud: {
			props: {},
		},
		contour: {
			props: {},
		},
	};

	return <PresetGrid presets={presets} />;
}
