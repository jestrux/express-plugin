import React from "react";
import gradients from "./gradients";

const GradientList = ({ value, onChange }) => {
	return (
		<div
			className=""
			style={{
				display: "grid",
				gridTemplateColumns: "1fr 1fr 1fr 1fr",
				gap: "0.35rem",
			}}
		>
			{Object.keys(gradients).map((name, index) => {
				const colors = gradients[name];
				const gradient = colors
					.map((color, idx) => {
						return `${color} ${(idx * 100) / (colors.length - 1)}%`;
					})
					.join(", ");

				return (
					<div
						key={index}
						className="cursor-pointer"
						onClick={() => onChange(colors)}
					>
						<div className="flex-shrink-0 bg-white rounded-sm p-1">
							<div
								className="bg-gray rounded-sm relative overflow-hidden"
								style={{
									height: 40,
									background: `linear-gradient(90deg, ${gradient})`,
								}}
							></div>

							{/* <div className="p-1 text-center text-xs">{name}</div> */}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default GradientList;
