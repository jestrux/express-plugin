import { useEffect, useRef } from "preact/hooks";
import generator from "./generator";

function Blob(values) {
	this.values = values;
	// this.render = () => Blob.doRender(this.values, this.images);
}

Blob.meta = {
	// aspectRatio: "portrait",
};

Blob.label = "Blob";

Blob.props = {
	style: {
		type: "radio",
		choices: ["fill", "outline"],
		defaultValue: "fill",
	},
	color: {
		type: "radio",
		choiceType: "color",
		choices: [
			"#2196F3",
			"#4CAF50",
			"#E91E63",
			"#FFEB3B",
			"#3F51B5",
			"#FF5722",
		],
		defaultValue: "#4CAF50",
	},
	complexity: {
		type: "range",
		defaultValue: 6,
		step: 1,
		min: 2,
		max: 9,
	},
	randomness: {
		type: "range",
		defaultValue: 6,
		step: 1,
		min: 3,
		max: 20,
	},
};

Blob.render = ({ options = {} }) => {
	const size = 100;
	const { color, style } = options;
	const path = useRef(
		generator({
			size,
			edges: Number(options.randomness || 6),
			growth: Number(options.complexity || 6),
		}).path
	);

	useEffect(() => {
		path.current = generator({
			size,
			edges: Number(options.randomness || 6),
			growth: Number(options.complexity || 6),
		}).path;
	}, [options.randomness, options.complexity]);

	return (
		<svg
			viewBox={`0 0 ${size} ${size}`}
			fill={style == "fill" ? color : "none"}
			stroke={color}
			strokeWidth={style == "fill" ? 0 : 2}
		>
			<path d={path.current} />
		</svg>
	);
};

Blob.thumb = function () {
	return ` 
		<img class="" src="logos/blob.png" />
    `;
};

export default Blob;
