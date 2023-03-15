import React from "react";
import FontsComponent from "./FontsComponent";

import ImageComponent from "./ImageComponent";
import PresetGrid from "./tokens/PresetGrid";
import ContourComponent from "./ContourComponent";
import SpiralComponent from "./SpiralComponent";
import RibbonComponent from "./RibbonComponent";
import CloudComponent from "./CloudComponent";
import SpringComponent from "./SpringComponent";

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
			height: 70,
			floatingLabel: false,
		},
		spiral: {
			props: {},
			height: 70,
			floatingLabel: false,
		},
		contour: {
			props: {},
			height: 70,
			floatingLabel: false,
		},
		ribbon: {
			props: {},
			height: 70,
			floatingLabel: false,
		},
		cloud: {
			props: {},
			height: 70,
			floatingLabel: false,
		},
		spring: {
			props: {},
			height: 70,
			floatingLabel: false,
		},
	};

	return <PresetGrid presets={presets} />;
}
