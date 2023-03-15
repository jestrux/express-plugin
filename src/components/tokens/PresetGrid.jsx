import React from "react";
// const Creators = require('../Creators');

const PresetGrid = ({ component, presets, onPresetScreen }) => {
	function handlePresetClicked(name) {
		// Creators[component](presets[name].props, { fromPreset: onPresetScreen });
	}

	return (
		<div className="flex flex-wrap">
			{Object.entries(presets).map(([name, value], index) => {
				const { props, ...styles } = presets[name];
				const {
					height = 30,
					noContainer,
					fullWidth,
					floatingLabel = true,
				} = styles || {};
				const image = `images/presets/${component.toLowerCase()}/${name}.png`;

				return (
					<div
						key={index}
						className={`
                        parent relative py-3 flex-shrink-0 font-bold text-center bg-gray-100 overflow-hidden relative flex flex-col center-center
                        ${!floatingLabel ? "hoverable" : "cursor-pointer"}
                    `}
						style={{
							width: fullWidth ? "100%" : "50%",
							border: "solid #e5e5e5",
							borderWidth: "0 1px 1px 0",
						}}
						onClick={() => handlePresetClicked(name)}
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
								src={image}
								alt=""
								style={{
									maxWidth: "95%",
									maxHeight: `${height}px`,
								}}
							/>
						</div>

						{floatingLabel ? (
							<span className="show-on-parent-hover absolute inset-x-0 bottom-0 mb-1 font-normal block text-center text-sm">
								{name.replaceAll("-", " ")}
							</span>
						) : (
							<span className="font-normal block text-center mt-1 text-sm">
								{name.replaceAll("-", " ")}
							</span>
						)}
					</div>
				);
			})}
		</div>
	);
};

export default PresetGrid;
