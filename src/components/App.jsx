import React from "react";
import FontsComponent from "./FontsComponent";

import ImageComponent from "./ImageComponent";
import PresetGrid from "./tokens/PresetGrid";
import ContourComponent from "./ContourComponent";
import SpiralComponent from "./SpiralComponent";

export default function App() {
	// return <SpiralComponent />;

	const presets = {
		clippedImage: {
			props: {},
			height: 120,
			fullWidth: true,
			floatingLabel: false,
		},
		polaroidCard: {
			props: {},
			height: 80,
			floatingLabel: false,
		},
		contour: {
			props: {},
			height: 80,
			floatingLabel: false,
		},
		spiral: {
			props: {},
			height: 80,
			floatingLabel: false,
		},
	};

	return <PresetGrid presets={presets} />;
}
