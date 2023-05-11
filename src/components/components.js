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
import ChartComponent from "./ChartComponent";
import MapComponent from "./MapComponent";
import ColorComponent from "./ColorComponent";
import LayoutsComponent from "./layouts";
import GridComponent from "./GridComponent";
import ArrowComponent from "./ArrowComponent";
import FlowerHeadsComponent from "./FlowerHeadsComponent";
import ShapesComponent from "./ShapesComponent";

export const componentMap = {
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

export const presets = {
	layouts: {
		props: {},
		component: "LayoutsComponent",
	},
	backgroundPatterns: {
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
	brushedBackground: {
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
