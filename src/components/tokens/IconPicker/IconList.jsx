import React from "react";
import iconData from "../data/icons";
// const colorDialog = require("../../utils/ColorDialog");

const IconList = ({
	icons = iconData,
	iconSize = 20,
	iconNames,
	selectedColor = "white",
	showEmptyIcon = false,
	centerIcons = false,
	selectedIcon,
	onChange,
}) => {
	if (!iconNames) iconNames = Object.keys(icons);
	// function handleAssetColorChanged(color){
	//     if(!color) return;

	//     setTimeout(() => {
	//         onChange(color);
	//     }, 100);
	// }

	return (
		<div
			className={`flex flex-wrap items-center ${
				centerIcons && "justify-center"
			}`}
		>
			{showEmptyIcon && (
				<div
					title="None"
					className={`cursor-pointer rounded-full border-2s`}
					style={{ padding: "5px 3px" }}
					onClick={() => onChange("")}
				>
					<div
						className="flex center-center cursor-pointer border rounded-full"
						style={{
							width: iconSize + 12 + "px",
							height: iconSize + 12 + "px",
							borderColor: "#bbb",
						}}
					></div>
				</div>
			)}

			{iconNames.map((icon, index) => {
				return (
					<div
						title={icon}
						key={index}
						className={`cursor-pointer rounded-full`}
						style={{ padding: "3px" }}
						onClick={() => onChange(icon, icons[icon])}
					>
						<div
							className="flex center-center cursor-pointer border rounded-full"
							style={{
								width: iconSize + 14 + "px",
								height: iconSize + 14 + "px",
								borderColor:
									selectedIcon == icon ? "#888" : "#ccc",
								background:
									selectedIcon == icon ? selectedColor : "",
							}}
						>
							<svg height={iconSize + "px"} viewBox="0 0 24 24">
								<path
									fill="#777"
									stroke="none"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d={icons[icon]}
								/>
							</svg>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default IconList;
