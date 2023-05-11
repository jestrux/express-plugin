import React from "react";
import staticImages from "../../staticImages";
import { camelCaseToSentenceCase } from "../utils";
import { componentMap, presets } from "../components";

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
				<span
					className="block opacity-75"
					style={{ fontSize: "0.82rem", lineHeight: 1.5 }}
				>
					Quickly learn how to use this add-on
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
							Quickly learn how to use this add-on
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
							Quickly learn how to use this add-on
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

const PlayIcon = () => {
	return (
		<span
			className="visible-on-parent-hover bg-white rounded-full absolute top-0 right-0 mx-1 my-1 flex center-center"
			style={{ width: "20px", height: "20px" }}
		>
			<svg
				className="text-primary"
				width="20"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fillRule="evenodd"
					d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm6.39-2.908a.75.75 0 01.766.027l3.5 2.25a.75.75 0 010 1.262l-3.5 2.25A.75.75 0 018 12.25v-4.5a.75.75 0 01.39-.658z"
					clipRule="evenodd"
				/>
			</svg>
		</span>
	);
};

const Card1 = ({ component, name, onSelect }) => {
	return (
		<div
			className="w-full rounded-sm border cusor-pointer parent gray-on-hover relative overflow-hidden"
			onClick={() => onSelect(component, name)}
		>
			<div
				className="flex center-center relative"
				style={{
					width: "100%",
					height: "70px",
				}}
			>
				<img
					loading="lazy"
					className="p-2 object-contain object-center"
					src={staticImages.posters[name]}
					alt=""
					style={{
						minWidth: 0,
						maxWidth: "100%",
						maxHeight: "100%",
						filter: "drop-shadow(0.5px 0.5px 1px rgba(0, 0, 0, 0.2))",
					}}
				/>

				<PlayIcon />
			</div>

			<div
				className="border-t border-light-gray bg-black26"
				style={{
					// background: "#f7f7f7",
					textAlign: "center",
					padding: "0.5rem 0.6rem",
					fontSize: "0.75rem",
					lineHeight: "1.5",
					whiteSpace: "nowrap",
					overflow: "hidden",
					textOverflow: "ellipsis",
				}}
			>
				{camelCaseToSentenceCase(name.replaceAll("-", " "))}
			</div>
		</div>
	);
};

const Card2 = ({ component, name, onSelect }) => {
	return (
		<div
			className="w-full rounded-sm border cusor-pointer parent gray-on-hover relative overflow-hidden"
			onClick={() => onSelect(component, name)}
			style={{
				minWidth: 0,
				// background:
				// 	"linear-gradient(180deg, transparent 40%, #EEE 100%)",
			}}
		>
			<div
				className="flex center-center relative"
				style={{
					width: "100%",
					height: "70px",
				}}
			>
				<img
					loading="lazy"
					className="p-2 object-contain object-center"
					src={staticImages.posters[name]}
					alt=""
					style={{
						minWidth: 0,
						maxWidth: "100%",
						maxHeight: "100%",
						filter: "drop-shadow(0.5px 0.5px 1px rgba(0, 0, 0, 0.2))",
					}}
				/>

				<PlayIcon />
			</div>

			<div
				className="border-t border-light-gray flex center-center bg-black26"
				style={{
					height: "52px",
					textAlign: "center",
					padding: "0.6rem 0.6rem",
					fontSize: "0.75rem",
					lineHeight: "1.5",
					overflow: "hidden",
					textOverflow: "ellipsis",
				}}
			>
				{camelCaseToSentenceCase(name.replaceAll("-", " "))}
			</div>
		</div>
	);
};

const Card3 = ({ component, name, onSelect }) => {
	const { quickAction, preview, styles } =
		componentMap[component]?.usePreview?.() || {};

	return (
		<div
			className="p-2 flex gap-3s w-full rounded border parent cursor-pointer gray-on-hover relative overflow-hidden"
			onClick={() => onSelect(component, name)}
			style={{
				// aspectRatio: "2/0.65",
				aspectRatio: "2/0.78",
			}}
		>
			<div
				className="flex-1 flex flex-col gap-2s justify-between"
				style={{
					padding: "0 0.65rem 0.2rem 0.5rem",
					fontSize: "0.9rem",
					lineHeight: 1.5,
					overflow: "hidden",
					textOverflow: "ellipsis",
				}}
			>
				<div className="flex-1 flex items-center">
					{camelCaseToSentenceCase(name.replaceAll("-", " "))}
				</div>

				{typeof quickAction == "function" &&
					quickAction((label) => {
						return (
							<div className="group flex items-center gap-1">
								<svg
									className="show-on-group-hover text-primary"
									width="12"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z" />
								</svg>

								<svg
									className="hide-on-group-hover opacity-40"
									width="12"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z" />
								</svg>

								<span
									className="text-sm"
									style={{
										marginBottom: "2px",
									}}
								>
									<span className="show-on-group-hover">
										{label}
									</span>
									<span className="hide-on-group-hover opacity-65">
										{label}
									</span>
								</span>
							</div>
						);
					})}
			</div>

			<div
				className="relative flex center-center rounded-sm overflow-hidden sbg-black26 border border-light-gray"
				style={{
					width: "40%",
					height: "100%",
				}}
			>
				<img
					loading="lazy"
					className="object-contain object-center"
					src={preview || staticImages.posters[name]}
					alt=""
					style={{
						padding: "0.4rem 0",
						maxWidth: "100%",
						maxHeight: "100%",
						filter: "drop-shadow(0.5px 0.5px 1px rgba(0, 0, 0, 0.3))",
						...(styles || {}),
					}}
				/>

				<PlayIcon />
			</div>
		</div>
	);
};

const PresetGrid = ({ onSelect }) => {
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
			</a>

			<div className="text-lg px-12px mb-1">Components</div> */}

			<div
				className="grid p-2 gap-2 border-t"
				// style={{ gridTemplateColumns: "1fr 1fr" }}
			>
				{Object.entries(presets).map(([name, value], index) => {
					const { props, component, ...styles } = value;

					return (
						// <Card1
						// 	key={index}
						// 	name={name}
						// 	component={component}
						// 	onSelect={onSelect}
						// />

						// <Card2
						// 	key={index}
						// 	name={name}
						// 	component={component}
						// 	onSelect={onSelect}
						// />

						<Card3
							key={index}
							name={name}
							component={component}
							onSelect={onSelect}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default PresetGrid;
