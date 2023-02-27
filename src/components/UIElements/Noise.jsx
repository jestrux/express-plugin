function Noise(values) {
	this.values = values;
	// this.render = () => Noise.doRender(this.values, this.images);
}

Noise.meta = {
	// aspectRatio: "portrait",
};

Noise.label = "Noise";

Noise.props = {
	color: {
		type: "radio",
		choices: ["white", "black"],
		defaultValue: "white",
	},
	density: {
		type: "radio",
		choices: [
			{ label: "Low", value: 0 },
			{ label: "Medium", value: 0.5 },
			{ label: "High", value: 1 },
		],
		defaultValue: 1,
	},
	contrast: {
		type: "radio",
		choices: [
			{ label: "Low", value: 0 },
			{ label: "Medium", value: 0.5 },
			{ label: "High", value: 1 },
		],
		defaultValue: 0,
	},
	opacity: {
		type: "range",
		min: 0.2,
		max: 1,
		step: 0.1,
		defaultValue: 0.8,
	},
};

Noise.render = ({ id, options }) => {
	const { opacity, color, density, contrast } = options;
	const img = `noise/${color}-${density * 100}-${contrast * 100}.png`;
	return (
		<img class="w-full h-full object-cover" style={{ opacity }} src={img} />
	);
};

Noise.thumb = function () {
	return ` 
		<img class="" src="logos/noise.png" />
    `;
};

export default Noise;
