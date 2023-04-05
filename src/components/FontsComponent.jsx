import React, { useEffect, useRef, useState } from "react";
import Input from "./tokens/Input";

class FontDrawer {
	fontLoaded = false;
	inkColor = "blue";
	dfont = "30px myfont";
	text = "Les Waves";
	maxWidth = 300;
	lineHeight = 40;
	x = 12;
	y = 22 + 22;
	fontIndex = 0;
	totalfontnum = 5;

	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		console.log("Font loader...");
		return this.defaultFontload();
	}

	draw(text = "Les Waves") {
		this.text = text;
		this.y = 22 + 22;
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.drawText();
	}

	drawText() {
		this.ctx.font = this.dfont;
		this.ctx.fillStyle = this.inkColor;

		var line = "";
		var paragraphs = this.text.split("\n");
		for (var i = 0; i < paragraphs.length; i++) {
			var words = paragraphs[i].split(" ");
			for (var n = 0; n < words.length; n++) {
				var testLine = line + words[n] + " ";
				var metrics = this.ctx.measureText(testLine);
				var testWidth = metrics.width;
				if (testWidth > this.maxWidth && n > 0) {
					this.ctx.fillText(line, this.x, this.y);
					line = words[n] + " ";
					this.y += this.lineHeight;
				} else {
					line = testLine;
				}
			}

			this.ctx.fillText(line, this.x, this.y);
			this.y += this.lineHeight;
			line = "";
		}
	}

	async defaultFontload() {
		const font = new FontFace(
			"myfont",
			`url('static/fonts/${this.fontIndex}.ttf')`
		);
		await font.load();

		document.fonts.add(font);

		this.fontLoaded = true;

		return this;
	}
}

export default function FontsComponent() {
	const [text, setText] = useState("Les Waves");
	const [url, setUrl] = useState("");
	const canvasRef = useRef(null);
	const previewRef = useRef(null);

	useEffect(() => {
		loadDrawer();
		window.AddOnSdk.app.enableDragToDocument(previewRef.current, {
			previewCallback: (element) => {
				return new URL(element.src);
			},
			completionCallback: exportImage,
		});
	}, []);

	const loadDrawer = async () => {
		if (!window.fontsDrawer) {
			window.fontsDrawer = await new FontDrawer(canvasRef.current);
			update();
		}
	};

	const update = (text) => {
		window.fontsDrawer.draw(text);
		setUrl(canvasRef.current.toDataURL());
	};

	const exportImage = async (e) => {
		const blob = await new Promise((resolve, reject) => {
			canvasRef.current.toBlob(resolve);
		});

		const fromDrag = e?.target?.nodeName != "IMG";

		if (fromDrag) return [{ blob }];
		else sdk.app.document.addImage(blob);
	};

	const handleSubmit = (e) => {
		update(e.target.value);
	};

	return (
		<>
			<canvas
				style={{ display: "none" }}
				ref={canvasRef}
				width="600px"
				height="120px"
			></canvas>

			<div className="image-item" draggable="true">
				<img
					onClick={exportImage}
					ref={previewRef}
					className="drag-target"
					src={url}
				/>
			</div>

			<Input
				name="text"
				type="text"
				defaultValue={text}
				onSubmit={handleSubmit}
			/>
		</>
	);
}
