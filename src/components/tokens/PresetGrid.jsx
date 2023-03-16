import React from "react";
import staticImages from "../../staticImages";
import { camelCaseToSentenceCase } from "../utils";

const PresetGrid = ({ presets, onSelect }) => {
	return (
		<div className="flex flex-wrap">
			{Object.entries(presets).map(([name, value], index) => {
				const { props, component, ...styles } = value;
				const {
					height = 70,
					noContainer,
					fullWidth,
					floatingLabel = false,
				} = styles || {};

				return (
					<div
						key={index}
						className="hoverable parent relative py-3 flex-shrink-0 font-bold text-center bg-gray-100 overflow-hidden relative flex flex-col center-center"
						style={{
							width: fullWidth ? "100%" : "50%",
							border: "solid #e5e5e5",
							borderWidth: "0 1px 1px 0",
						}}
						onClick={() => onSelect(component)}
					>
						<div
							className="flex center-center"
							style={{
								height:
									height && height > 55
										? height + "px"
										: "55px",
							}}
						>
							<img
								loading="lazy"
								className="object-contain object-center w-full"
								src={staticImages.posters[name]}
								alt=""
								style={{
									maxWidth: "95%",
									maxHeight: `${height}px`,
									filter: "drop-shadow(1px 1px 3px rgba(0, 0, 0, 0.2))",
								}}
							/>
						</div>

						{floatingLabel ? (
							<span className="show-on-parent-hover absolute inset-x-0 bottom-0 mb-1 font-normal block text-center text-sm">
								{camelCaseToSentenceCase(
									name.replaceAll("-", " ")
								)}
							</span>
						) : (
							<span className="font-normal block text-center mt-1 text-sm">
								{camelCaseToSentenceCase(
									name.replaceAll("-", " ")
								)}
							</span>
						)}
					</div>
				);
			})}
		</div>
	);
};

export default PresetGrid;
