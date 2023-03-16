import React, { useEffect, useRef, useState } from "react";
import useDataSchema from "../hooks/useDataSchema";
import staticImages from "../staticImages";
import { loadImage, loadImageFromUrl } from "./utils";

// https://github.com/zhw2590582/WFPlayer
const visualizerProps = {
	// backgroundColor: "transparent",
	grid: false,
	scrollable: true,
	padding: 0,
	ruler: false,
	progress: false,
	cursor: false,
	duration: 30,
	waveColor: "rgba(255, 255, 255, 0.5)",
	waveSize: 2,
	waveScale: 0.8,
};
const smoothSpotifyWave =
	"data:image/png;base64,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";

class SpotifyDrawer {
	padding = 20;
	constructor() {
		const canvas = document.createElement("canvas");
		canvas.width = 809;
		canvas.height = 176;
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}

	async draw(props = {}) {
		Object.assign(this, props);

		const width = this.canvas.width;
		const height = this.canvas.height;

		const ctx = this.ctx;
		ctx.clearRect(0, 0, width, height);

		ctx.fillStyle = "#222";
		ctx.beginPath();
		ctx.roundRect(0, 0, width, height, 20);
		ctx.fill();

		const logoSize = 40;
		const scale = logoSize / 24;
		const dx = width - this.padding - logoSize;
		const dy = this.padding;

		ctx.fillStyle = "#1CD05D";
		ctx.save();
		ctx.transform(scale, 0, 0, scale, dx, dy);
		ctx.beginPath();
		ctx.fill(
			new Path2D(
				"M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
			)
		);
		ctx.restore();

		if (!this.img || props.src != this.src)
			await loadImage(this, props.src, { updateDimensions: false });
		if (!this.visualizer || props.wave != this.wave)
			this.visualizer = await loadImageFromUrl(props.wave);

		return this.drawImage();
	}

	async drawImage() {
		const padding = this.padding;
		const width = this.canvas.width;
		const height = this.canvas.height;
		const avatarSize = height - padding * 2;

		this.ctx.drawImage(this.img, padding, padding, avatarSize, avatarSize);

		this.ctx.drawImage(
			this.visualizer,
			avatarSize + padding * 2,
			height - padding - 40,
			width - avatarSize - padding * 3,
			40
		);

		return this.canvas.toDataURL();
	}
}

export default function SpotifyComponent() {
	const previewRef = useRef(null);
	const spotifyDrawerRef = useRef((data) => {
		if (!window.spotifyDrawer) window.spotifyDrawer = new SpotifyDrawer();

		window.spotifyDrawer.draw(data).then(setUrl);
	});
	const [url, setUrl] = useState();
	const [data, updateField] = useDataSchema(
		{
			src: staticImages.presets.spotify,
			song: {
				title: "Smooth ft. Rob Thomas",
				artist: "Santana",
				album: "Supernatural (Remastered)",
			},
			wave: smoothSpotifyWave,
			filter: "exclusion",
		},
		spotifyDrawerRef.current
	);

	useEffect(() => {
		spotifyDrawerRef.current(data);

		window.AddOnSdk?.app.enableDragToDocument(previewRef.current, {
			previewCallback: (element) => {
				return new URL(element.src);
			},
			completionCallback: exportImage,
		});
	}, []);

	const exportImage = async (e) => {
		const fromDrag = e?.target?.nodeName != "IMG";
		const blob = await fetch(previewRef.current.src).then((response) =>
			response.blob()
		);

		if (fromDrag) return [{ blob }];
		else window.AddOnSdk?.app.document.addImage(blob);
	};

	return (
		<>
			<div
				className="relative relative border-b flex center-center p-3"
				style={{ display: !url ? "none" : "" }}
			>
				<div className="image-item relative" draggable="true">
					<img
						onClick={exportImage}
						ref={previewRef}
						className="drag-target max-w-full"
						src={url}
						style={{ maxHeight: "30vh" }}
					/>
				</div>
			</div>

			<div className="px-12px"></div>
		</>
	);
}
