import chartThemes from "./chart-themes";

export const defaultOptions = {
	padding: 5,
	data: {
		Classical: 16,
		Alternative: 18,
		Pop: 18,
		Jazz: 12,
		Country: 16,
	},
	labels: {
		font: "Georgia, serif",
		size: 50,
		categoryName: true,
		secondaryText: "%",
	},
	doughnutHoleSize: 0.35,
	borders: 6,
	colors: chartThemes[0],
};

export const schema = {
	data: {
		type: "keyValue",
		collapsed: true,
		meta: {
			type: "number",
		},
	},
	labels: {
		type: "section",
		// optional: true,
		collapsed: true,
		children: {
			categoryName: {
				type: "radio",
				inline: true,
				choices: [
					{
						label: "Hide",
						value: false,
					},
					{
						label: "Show",
						value: true,
					},
				],
			},
			secondaryText: {
				type: "radio",
				inline: true,
				defaultValue: defaultOptions.labels.secondaryText,
				choices: ["hide", "#", "%"],
			},
			font: {
				inline: true,
				type: "radio",
				label: "Font family",
				defaultValue: defaultOptions.labels.font,
				choices: [
					{
						label: "Sans",
						value: "adobe-clean, sans-serif",
					},
					{
						label: "Serif",
						value: "Georgia, serif",
					},
				],
			},
			size: {
				type: "radio",
				label: "Text size",
				choices: [
					{ label: "sm", value: 30 },
					{ label: "md", value: 40 },
					{ label: "lg", value: 50 },
				],
				// type: "range",
				inline: true,
				defaultValue: defaultOptions.labels.size,
				meta: {
					min: 30,
					max: 50,
					step: 1,
					className: "inline-number-field",
				},
			},
		},
	},
	doughnutHoleSize: {
		type: "radio",
		choices: [
			{ label: "hide", value: 0 },
			{ label: "md", value: 0.35 },
			{ label: "lg", value: 0.7 },
		],
		// type: "range",
		label: "Donut hole",
		inline: true,
		defaultValue: defaultOptions.doughnutHoleSize,
		meta: {
			min: 0,
			max: 0.7,
			step: 0.01,
			className: "inline-number-field",
		},
	},
	borders: {
		type: "radio",
		choices: [
			{ label: "none", value: 0 },
			{ label: "md", value: 3 },
			{ label: "lg", value: 6 },
		],
		// type: "range",
		inline: true,
		defaultValue: defaultOptions.borders,
		meta: {
			min: 0,
			max: 6,
			step: 0.1,
			className: "inline-number-field",
		},
	},
};

class PieChart {
	constructor(options) {
		Object.entries(defaultOptions).forEach(([key, value]) => {
			if (options[key] === undefined) options[key] = value;
		});

		this.options = options;
		this.canvas = document.createElement("canvas");
		this.canvas.width = options.width;
		this.canvas.height = options.height;
		this.ctx = this.canvas.getContext("2d");
		this.colors = options.colors;
		this.totalValue = [...Object.values(this.options.data)].reduce(
			(a, b) => a + Number(b),
			0
		);
		this.radius =
			Math.min(this.canvas.width / 2, this.canvas.height / 2) -
			options.padding;

		return this.draw();
	}

	drawPieSlice(centerX, centerY, radius, startAngle, endAngle, fillColor) {
		const ctx = this.ctx;
		ctx.save();
		ctx.fillStyle = fillColor;
		ctx.beginPath();
		ctx.moveTo(centerX, centerY);
		ctx.arc(centerX, centerY, radius, startAngle, endAngle);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.restore();
	}

	drawSlices() {
		var colorIndex = 0;
		var startAngle = -Math.PI / 2;

		for (var categ in this.options.data) {
			const sliceRatio = this.options.data[categ] / this.totalValue;
			var sliceAngle = 2 * Math.PI * sliceRatio;

			this.drawPieSlice(
				this.canvas.width / 2,
				this.canvas.height / 2,
				this.radius,
				startAngle,
				startAngle + sliceAngle,
				this.colors[colorIndex % this.colors.length]
			);

			startAngle += sliceAngle;
			colorIndex++;
		}
	}

	drawLabels() {
		var startAngle = -Math.PI / 2;
		for (var categ in this.options.data) {
			const sliceRatio = this.options.data[categ] / this.totalValue;
			const labelText = categ; // Math.round(100 * sliceRatio) +  + "%";

			const fontSize = this.options.labels.size;
			this.ctx.font = `bold ${fontSize}px ${this.options.labels.font}`;

			const sliceAngle = 2 * Math.PI * sliceRatio;
			const angleX = Math.cos(startAngle + sliceAngle / 2);
			const angleY = Math.sin(startAngle + sliceAngle / 2);
			const halfWidth = this.canvas.width / 2;
			const halfHeight = this.canvas.height / 2;
			const halfRadius = this.radius / 2;

			const doughnutHoleSize = this.options.doughnutHoleSize;
			const offset = doughnutHoleSize
				? (this.radius * doughnutHoleSize) / 2
				: 0;

			const offsetRadius = offset + halfRadius;
			const labelX = halfWidth + offsetRadius * angleX;
			const labelY = halfHeight + offsetRadius * angleY;

			const textWords = labelText.split(" ");
			const labelWidth = Math.max(
				...textWords.map((word) => this.ctx.measureText(word).width)
			);

			this.ctx.fillStyle = this.options.colors.at(-1);
			this.ctx.textAlign = "center";
			const secondaryText = this.options.labels?.secondaryText || "hide";

			if (this.options.labels.categoryName) {
				textWords.forEach((text, index) => {
					this.ctx.fillText(
						text,
						labelX + labelWidth * 0.02,
						labelY + 6 + fontSize * index
					);
					if (
						index == textWords.length - 1 &&
						secondaryText != "hide"
					) {
						this.ctx.fillText(
							secondaryText == "%"
								? Math.round(100 * sliceRatio) + "%"
								: this.options.data[categ],
							labelX + labelWidth * 0.02,
							labelY + 10 + fontSize * (index + 1)
						);
					}
				});
			} else if (secondaryText != "hide") {
				this.ctx.fillText(
					secondaryText == "%"
						? Math.round(100 * sliceRatio) + "%"
						: this.options.data[categ],
					labelX + labelWidth * 0.02,
					labelY + 10
				);
			}

			startAngle += sliceAngle;
		}
	}

	draw() {
		const ctx = this.ctx;
		const centerX = this.canvas.width / 2;
		const centerY = this.canvas.height / 2;
		const innerRadius = this.options.doughnutHoleSize * this.radius;
		ctx.lineWidth = this.options.borders;
		ctx.strokeStyle =
			this.options.borders <= 0.1
				? "transparent"
				: this.options.colors.at(-1);

		ctx.beginPath();
		ctx.moveTo(centerX, centerY);
		ctx.arc(centerX, centerY, this.radius + 6, 0, 2 * Math.PI);

		ctx.moveTo(centerX, centerY);
		ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI, true);
		ctx.closePath();
		ctx.save();
		ctx.clip();

		this.drawSlices();
		ctx.restore();

		if (this.options.labels) this.drawLabels();

		ctx.beginPath();
		ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
		ctx.closePath();
		ctx.stroke();

		return this.canvas;
	}
}

export default PieChart;
