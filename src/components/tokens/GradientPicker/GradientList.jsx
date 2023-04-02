import React from "react";
import gradients from "./gradients";

const GradientList = ({ value, onChange }) => {
	const valueString = (value || [])
		.map((color, idx) => {
			return `${color} ${(idx * 100) / (value.length - 1)}%`;
		})
		.join(", ");

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

				const selected = gradient == valueString;

				return (
					<div
						key={index}
						className={`relative cursor-pointer border rounded-sm ${
							selected && "bg-primary"
						}`}
						style={{ padding: "0.125rem" }}
						onClick={() => onChange(colors)}
					>
						{selected && (
							<div
								className="absolute top-0 right-0 bg-primary rounded-sm flex center-center"
								style={{
									width: "12px",
									height: "12px",
									zIndex: 1,
								}}
							>
								<svg
									width={6}
									viewBox="0 0 24 24"
									fill="none"
									stroke="#fff"
									strokeWidth={5}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M4.5 12.75l6 6 9-13.5"
									/>
								</svg>
							</div>
						)}

						<div className="flex-shrink-0">
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
