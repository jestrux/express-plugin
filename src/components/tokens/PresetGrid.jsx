import React from "react";
import staticImages from "../../staticImages";
import { camelCaseToSentenceCase } from "../utils";

const Preview1 = () => {
	return (
		<div className="mb-2">
			<div className="px-12px">
				<div
					className="relative border shadow rounded overflow-hidden bg-primary-light flex flex-col justify-end"
					style={{ aspectRatio: 2 / 1 }}
				>
					<div
						className="flex-1 flex center-center"
						style={{
							backgroundImage: `url(${staticImages.videoPoster})`,
							backgroundSize: "cover",
						}}
					></div>
					<div className="absolute inset-0 flex center-center gap-2 py-2 pl-3 pr-2">
						<div className="w-full h-full bg-black opacity-40 absolute inset-0"></div>

						<svg
							className="relative text-primary"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							width="44"
						>
							<path
								fillRule="evenodd"
								d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z"
								clipRule="evenodd"
							/>

							<path
								transform="scale(0.5) translate(14,12)"
								fill="white"
								fillRule="evenodd"
								d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
				</div>
			</div>

			<div
				className="text-lg px-12px mb-1"
				style={{ marginTop: "0.35rem", marginLeft: "0.2rem" }}
			>
				{/* <div className="text-lg">How to use this addon</div>

				<div
					style={{
						fontSize: "0.8rem",
						lineHeight: 1.5,
						opacity: 0.65,
					}}
				>
					A quick tour of the add-on's features
				</div> */}

				<span
					className="block opacity-75"
					style={{ fontSize: "0.82rem", lineHeight: 1.5 }}
				>
					{/* Learn how to make a vibrant vision board in just a few
					minutes. */}
					How to use the Vision Board add-on for express
				</span>
			</div>
		</div>
	);
};

const Preview2 = () => {
	return (
		<div className="px-12px mb-3">
			<div className="relative border shadow rounded overflow-hidden bg-primary-light aspect-video flex flex-col justify-end">
				<div
					className="flex-1"
					style={{
						backgroundImage: `url(${staticImages.videoPoster})`,
						backgroundSize: "cover",
					}}
				></div>
				<div className="flex center-center gap-2 py-2 pl-3 pr-2">
					<div className="flex-1">
						<span
							className="block"
							style={{ fontSize: "0.82rem", lineHeight: 1.5 }}
						>
							How to use the Vision Board add-on for express
						</span>
					</div>

					<div className="flex-shrink-0">
						<svg
							className="text-primary"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							width="30"
						>
							<path
								fillRule="evenodd"
								d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
				</div>
			</div>
		</div>
	);
};

const Preview3 = () => {
	return (
		<div className="px-12px mb-3">
			<div
				className="relative border shadow rounded overflow-hidden bg-primary-light sborder-primary"
				style={{
					background: "white",
					boxShadow: "1px 1px 3px rgba(0,0,0,0.08)",
				}}
			>
				<div className="flex center-center gap-1">
					<div
						className="relative overflow-hidden border border-dark-gray flex center-center"
						style={{
							borderRadius: "6px",
							borderColor: "rgba(0,0,0,0.1)",
							margin: "0.35rem",
							width: "50px",
							height: "50px",
							backgroundImage: `url(${staticImages.videoPoster})`,
							backgroundSize: "cover",
							boxShadow: "inset 0px 0px 1px solid #000",
						}}
					>
						<div
							className="absolute inset-0 bg-black"
							style={{ opacity: 0.2 }}
						></div>
						<span
							className="relative rounded-full aspect-square bg-primary text-white flex center-center"
							style={{
								padding: "0.35rem",
							}}
						>
							<svg
								viewBox="0 0 24 24"
								fill="currentColor"
								width="11"
								style={{
									marginLeft: "2px",
								}}
							>
								<path
									fillRule="evenodd"
									d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
									clipRule="evenodd"
								/>
							</svg>
						</span>
					</div>

					<div className="flex-1 pr-3">
						<span
							className="block"
							style={{
								fontSize: "0.82rem",
								lineHeight: 1.55,
								paddingBottom: "2px",
							}}
						>
							How to use the Vision Board add-on for express
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

const PresetGrid = ({ presets, onSelect }) => {
	return (
		<div className="flex flex-col">
			{/* <a
				className="flex flex-col"
				href="https://www.youtube.com/watch?v=CkE6l_KIACc"
				target="_blank"
				style={{ textDecoration: "none", color: "inherit" }}
			>
				<Preview1 />
				<Preview2 />
				<Preview3 />
			</a> */}

			{/* <div className="text-lg px-12px mb-1">Components</div> */}

			<div className="flex flex-wrap border-t">
				{Object.entries(presets).map(([name, value], index) => {
					const { props, component, ...styles } = value;
					const {
						height = 35,
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
		</div>
	);
};

export default PresetGrid;
