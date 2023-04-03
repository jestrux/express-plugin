import React, { useState } from "react";
import staticImages from "../../staticImages";
import { DEFAULT_COLORS } from "../constants";
import { tinyColor } from "../utils";

const ColorList = ({
	centerColors = false,
	selectedColor,
	small = false,
	choiceSize = 22,
	// spacing = 3.5,
	spacing = 0,
	showCustomPicker = false,
	showTransparent,
	showIndicator = true,
	onChange,
	...props
}) => {
	const [colors, setColors] = useState([
		...(showTransparent ? ["transparent"] : []),
		...(props.colors || DEFAULT_COLORS),
	]);
	if (colors && colors.length) {
		// if (showTransparent) colors = ["transparent", ...colors];
		// if (selectedColor && !colors.includes(selectedColor)) {
		// 	colors = [...colors, selectedColor];
		// }
	}

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
			className={`flex flex-wrap items-center rounded-xs overflow-hidden ${
				centerColors && "justify-center"
			}`}
			style={{ gap: `${spacing}px` }}
		>
			{showCustomPicker && (
				<label
					title="Pick color"
					className="flex center-center cursor-pointer"
					style={{
						width: customColorIconSize,
						height: customColorIconSize,
					}}
				>
					<svg height={customColorIconSize} viewBox="0 0 24 24">
						<path
							fill="#888"
							d="M12,2C6.49,2,2,6.49,2,12s4.49,10,10,10c1.38,0,2.5-1.12,2.5-2.5c0-0.61-0.23-1.2-0.64-1.67c-0.08-0.1-0.13-0.21-0.13-0.33 c0-0.28,0.22-0.5,0.5-0.5H16c3.31,0,6-2.69,6-6C22,6.04,17.51,2,12,2z M17.5,13c-0.83,0-1.5-0.67-1.5-1.5c0-0.83,0.67-1.5,1.5-1.5 s1.5,0.67,1.5,1.5C19,12.33,18.33,13,17.5,13z M14.5,9C13.67,9,13,8.33,13,7.5C13,6.67,13.67,6,14.5,6S16,6.67,16,7.5 C16,8.33,15.33,9,14.5,9z M5,11.5C5,10.67,5.67,10,6.5,10S8,10.67,8,11.5C8,12.33,7.33,13,6.5,13S5,12.33,5,11.5z M11,7.5 C11,8.33,10.33,9,9.5,9S8,8.33,8,7.5C8,6.67,8.67,6,9.5,6S11,6.67,11,7.5z"
						/>
					</svg>

					<input
						className="hidden"
						type="color"
						value={selectedColor}
						onChange={(e) => onChange(e.target.value)}
					/>
				</label>
			)}

			{colors.map((color, index) => {
				const selected = selectedColor == color;
				const transparent = color == "transparent";

				return (
					<label
						title={color}
						key={index}
						className={`relative cursor-pointer ${
							small ? "border" : "border-2"
						}`}
						style={{
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
								className="hidden"
								type="color"
								defaultValue={color}
								onChange={(e) =>
									updateColor(index, e.target.value)
								}
							/>
						)}

						<div
							className="border-2"
							style={{
								width: choiceSize,
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
