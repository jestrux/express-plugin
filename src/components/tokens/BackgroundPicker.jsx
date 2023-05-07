import React from "react";
import { camelCaseToSentenceCase } from "../utils";
import GradientList from "./GradientPicker/GradientList";
import ColorList from "./ColorList";

export default function BackgroundPicker({
	optional,
	value,
	onChange,
	defaultType = "color",
}) {
	const { type = defaultType, gradient, color } = value || {};
	const backgroundTypes = ["color", "gradient"];

	return (
		<div className="relative">
			<div
				className="flex justify-end"
				style={{
					position: optional ? "" : "absolute",
					top: "-1.54rem",
					right: 0,
					marginRight: "-0.2rem",
				}}
			>
				{backgroundTypes.map((backgroundType, index) => (
					<div key={index} className="flex items-center">
						<button
							className={`px-1 cursor-pointer bg-transparent border border-transparent ${
								type == backgroundType
									? "text-primary"
									: "opacity-50"
							}`}
							style={{
								fontSize: "12px",
							}}
							onClick={() =>
								onChange({ ...value, type: backgroundType })
							}
						>
							{camelCaseToSentenceCase(backgroundType)}
						</button>

						{index < backgroundTypes.length - 1 && (
							<span
								className="flex items-center"
								style={{ margin: "0 0.14rem" }}
							>
								<span
									style={{
										marginTop: "1px",
										background: "currentColor",
										opacity: 0.5,
										width: "4px",
										height: "4px",
										borderRadius: "4px",
									}}
								></span>
							</span>
						)}
					</div>
				))}
			</div>

			<div style={{ marginTop: "0.4rem" }}>
				{type == "gradient" && (
					<GradientList
						singleChoice
						value={gradient}
						onChange={(gradient) =>
							onChange({ ...value, gradient })
						}
					/>
				)}

				{type == "color" && (
					<ColorList
						choiceSize={30}
						singleChoice
						selectedColor={color}
						onChange={(color) => onChange({ ...value, color })}
					/>
				)}
			</div>
		</div>
	);
}
