import React from "react";
import staticImages from "../../staticImages";
import { camelCaseToSentenceCase } from "../utils";

const PresetGrid = ({ presets, onSelect }) => {
	return (
		<div className="flex flex-wrap border-t">
			{Object.entries(presets).map(([name, value], index) => {
				const { props, component, ...styles } = value;
				const {
					height = 35,
					noContainer,
					fullWidth,
					halfWidth,
					floatingLabel = false,
				} = styles || {};

				return (
					<div
						key={index}
						className="hoverable parent relative pt-3 flex-shrink-0 text-center bg-gray-100 overflow-hidden relative flex flex-col center-center"
						style={{
							width: fullWidth
								? "100%"
								: halfWidth
								? "33.333%"
								: "50%",
							border: "solid #e5e5e5",
							borderWidth: "0 1px 1px 0",
							paddingBottom: "2.5rem",
						}}
						onClick={() => onSelect(component, name)}
					>
						<div
							className="flex center-center"
							style={{
								height:
									height && height > 55
										? height + "px"
										: "30px",
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
							<span className="show-on-parent-hover block absolute inset-x-0 top-0 flex items-center justify-start">
								<span
									className="bg-black26 p-1 font-normal text-sm"
									style={{ padding: "0.25rem 0.4rem" }}
								>
									{camelCaseToSentenceCase(
										name.replaceAll("-", " ")
									)}
								</span>
							</span>
						) : (
							<span
								className="absolute bottom-0 block text-center mb-2 text-sm"
								style={{
									fontSize: "0.72rem",
									lineHeight: "1.5",
								}}
							>
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
