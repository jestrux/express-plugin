import React from "react";
import gradients from "./gradients";

const GradientList = ({ value, onChange }) => {
	return (
		<div className="flex flex-wrap" style={{ margin: "-0.3rem" }}>
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
						className="cursor-pointer p-1"
						style={{ width: "33.333%" }}
						onClick={() => onChange({ name, colors })}
					>
						<div className="flex-shrink-0 bg-white rounded-sm px-1 pt-1">
							<div
								className="bg-gray rounded-sm relative overflow-hidden"
								style={{
									height: 40,
									background: `linear-gradient(90deg, ${gradient})`,
								}}
							></div>

							<div className="p-1 text-center">{name}</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default GradientList;
