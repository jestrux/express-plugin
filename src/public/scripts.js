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
		this.defaultFontload();
	}

	draw(text) {
		// if (!this.fontLoaded) this.defaultFontload();
		// else this.drawText(ctx, this.text, this.maxWidth, this.lineHeight);
		text ??= this.text;
		this.y = 22 + 22;
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.drawText(ctx, text, this.maxWidth, this.lineHeight);
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
	}
}

// window.onload = () => {
// 	const canvas = document.getElementById("canvas");
// 	window.FontDrawer = new FontDrawer(canvas);
// };
