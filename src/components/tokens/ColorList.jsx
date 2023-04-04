import React, { useState } from "react";
import staticImages from "../../staticImages";
import { DEFAULT_COLORS } from "../constants";
import { tinyColor } from "../utils";

const ColorList = ({
	centerColors = false,
	selectedColor,
	small = false,
	choiceSize = 22,
	spacing = 0,
	showCustomPicker = false,
	showTransparent,
	showIndicator = true,
	fullWidth = false,
	onChange,
	...props
}) => {
	const [colors, setColors] = useState([
		...(showTransparent ? ["transparent"] : []),
		...(props.colors || DEFAULT_COLORS),
	]);

	const customColorIconSize = choiceSize + 4;

	const updateColor = (index, newColor) => {
		setColors(
			colors.map((color, i) => {
				if (i == index) return newColor;
				return color;
			})
		);

		onChange(newColor);
	};

	return (
		<div
			className={`inline-flex flex-wrap items-center rounded-sm overflow-hidden ${
				centerColors && "justify-center"
			}`}
			style={{ gap: `${spacing}px`, width: fullWidth ? "100%" : "" }}
		>
			{colors.map((color, index) => {
				const selected = selectedColor == color;
				const transparent = color == "transparent";

				return (
					<label
						title={color}
						key={index}
						className={`relative cursor-pointer ${
							small ? "border" : "border-2"
						}
						${!showIndicator && "rounded-sm"}
						`}
						style={{
							width: fullWidth ? "100%" : "",
							borderColor:
								transparent ||
								tinyColor(color).getLuminance() > 0.95
									? selected
										? "#bbb"
										: "#e7e7e7"
									: color,
							...(transparent
								? {
										background: `url(${staticImages.transparency})`,
										backgroundSize: choiceSize,
								  }
								: { backgroundColor: color }),
						}}
						onClick={() => onChange(color)}
					>
						{!transparent && (
							<input
								className="absolute opacity-0"
								style={{ width: 0, height: 0 }}
								type="color"
								defaultValue={color}
								onChange={(e) =>
									updateColor(index, e.target.value)
								}
							/>
						)}

						<div
							className="border-2 rounded-sm"
							style={{
								width: fullWidth ? "100%" : choiceSize,
								height: choiceSize,
								borderColor: !showIndicator
									? "transparent"
									: selected && !transparent
									? "white"
									: "transparent",
							}}
						></div>
					</label>
				);
			})}
		</div>
	);
};

export default ColorList;
