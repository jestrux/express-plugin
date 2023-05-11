import arrowPoster from "./images/posters/arrows.webp";
import brushPoster from "./images/posters/brush.webp";
import backgroundPatternPoster from "./images/posters/background-pattern.webp";
import calendarPoster from "./images/posters/calendar.webp";
import chartsPoster from "./images/posters/charts.webp";
import clippedImagePoster from "./images/posters/crop.webp";
import clockPoster from "./images/posters/clock.webp";
import cloudPoster from "./images/posters/cloud.webp";
import colorPoster from "./images/posters/color.webp";
import cylinderPoster from "./images/posters/cylinder.webp";
import contourPoster from "./images/posters/contour.webp";
import gridPoster from "./images/posters/grid.webp";
import flowerHeadsPoster from "./images/posters/flowerHeads.webp";
import framedImagePoster from "./images/posters/frame.webp";
import layoutsPoster from "./images/posters/layouts.webp";
import mapPoster from "./images/posters/map.webp";
import polaroidCardPoster from "./images/posters/polaroid.webp";
import poppyFlowerPoster from "./images/posters/poppyFlower.webp";
import shapesPoster from "./images/posters/shapes.webp";
import spiralPoster from "./images/posters/spiral.webp";
import spotifyCardPoster from "./images/posters/spotify.webp";
import ribbonPoster from "./images/posters/ribbon.webp";
import stickerBadgePoster from "./images/posters/sticker-badge.webp";
import weatherWidgetPoster from "./images/posters/weather.webp";
import wavesPoster from "./images/posters/waves.webp";

import calendarPreset from "./images/presets/calendar.webp";
import clippedImagePreset from "./images/presets/tornPaper.webp";
import clockPreset from "./images/presets/clock.webp";
import cylinderPreset from "./images/presets/cylinder.webp";
import polaroidPreset from "./images/presets/polaroid.webp";
import framePreset from "./images/presets/frame.webp";
import spotifyPreset from "./images/presets/spotify.jpg";
import mapPreset from "./images/presets/map.webp";

import transparency from "./images/transparency.png";
import flowers2 from "./images/flowers2.jpg";
import flowers from "./images/flowers.jpg";
import spotifyWave from "./images/spotify-wave.png";

import template1 from "./images/template-pictures/1.jpg";
import template2 from "./images/template-pictures/2.jpg";
import template3 from "./images/template-pictures/3.jpg";
import template4 from "./images/template-pictures/4.jpg";
import template5 from "./images/template-pictures/5.jpg";
import template6 from "./images/template-pictures/6.jpg";
import template7 from "./images/template-pictures/7.jpg";
import template8 from "./images/template-pictures/8.jpg";

import blobMapRegular from "./images/maps/blob-regular.webp";
import blobMapGreen from "./images/maps/blob-green.webp";
import blobMapDark from "./images/maps/blob-dark.webp";

import foldedMapRegular from "./images/maps/folded-regular.webp";
import foldedMapGreen from "./images/maps/folded-green.webp";
import foldedMapDark from "./images/maps/folded-dark.webp";

import mapRegular from "./images/maps/regular.webp";
import mapGreen from "./images/maps/green.webp";
import mapDark from "./images/maps/dark.webp";

import blobMapRegularWithMarker from "./images/maps/with-marker/blob-regular.webp";
import blobMapGreenWithMarker from "./images/maps/with-marker/blob-green.webp";
import blobMapDarkWithMarker from "./images/maps/with-marker/blob-dark.webp";

import foldedMapRegularWithMarker from "./images/maps/with-marker/folded-regular.webp";
import foldedMapGreenWithMarker from "./images/maps/with-marker/folded-green.webp";
import foldedMapDarkWithMarker from "./images/maps/with-marker/folded-dark.webp";

import mapRegularWithMarker from "./images/maps/with-marker/regular.webp";
import mapGreenWithMarker from "./images/maps/with-marker/green.webp";
import mapDarkWithMarker from "./images/maps/with-marker/dark.webp";

import videoPoster from "./images/video-poster.webp";

export default {
	videoPoster,
	transparency,
	flowers,
	flowers2,
	spotifyWave,
	maps: {
		regular: {
			blob: blobMapRegular,
			folded: foldedMapRegular,
			regular: mapRegular,
		},
		green: {
			blob: blobMapGreen,
			folded: foldedMapGreen,
			regular: mapGreen,
		},
		dark: {
			blob: blobMapDark,
			folded: foldedMapDark,
			regular: mapDark,
		},
		withMarker: {
			regular: {
				blob: blobMapRegularWithMarker,
				folded: foldedMapRegularWithMarker,
				regular: mapRegularWithMarker,
			},
			green: {
				blob: blobMapGreenWithMarker,
				folded: foldedMapGreenWithMarker,
				regular: mapGreenWithMarker,
			},
			dark: {
				blob: blobMapDarkWithMarker,
				folded: foldedMapDarkWithMarker,
				regular: mapDarkWithMarker,
			},
		},
	},
	templatePictures: [
		template1,
		template2,
		template3,
		template4,
		template5,
		template6,
		template7,
		template8,
	],
	posters: {
		arrows: arrowPoster,
		brushedBackground: brushPoster,
		backgroundPatterns: backgroundPatternPoster,
		calendar: calendarPoster,
		charts: chartsPoster,
		clippedImage: clippedImagePoster,
		clock: clockPoster,
		cloud: cloudPoster,
		color: colorPoster,
		pill: cylinderPoster,
		contour: contourPoster,
		flowerHeads: flowerHeadsPoster,
		frame: framedImagePoster,
		grid: gridPoster,
		layouts: layoutsPoster,
		map: mapPoster,
		polaroid: polaroidCardPoster,
		poppyFlower: poppyFlowerPoster,
		"Deco Shapes": shapesPoster,
		spiral: spiralPoster,
		spotifyCard: spotifyCardPoster,
		ribbon: ribbonPoster,
		stickerBadge: stickerBadgePoster,
		weather: weatherWidgetPoster,
		waves: wavesPoster,
	},
	presets: {
		calendar: calendarPreset,
		clippedImage: clippedImagePreset,
		clock: clockPreset,
		cylinder: cylinderPreset,
		polaroid: polaroidPreset,
		frame: framePreset,
		map: mapPreset,
		spotify: spotifyPreset,
	},
};
