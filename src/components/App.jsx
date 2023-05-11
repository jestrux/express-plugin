import React, { useRef, useState } from "react";
import PresetGrid from "./tokens/PresetGrid";
import { camelCaseToSentenceCase } from "./utils";
import { componentMap } from "./components";

export default function App() {
	const [currentComponent, setCurrentComponent] = useState();
	// const component = useRef(RibbonComponent);
	const component = useRef();

	function handleSetCurrentComponent(currentComponent, name = "") {
		component.current = componentMap[currentComponent];
		setCurrentComponent(name);
	}

	if (component.current) {
		const Component = component.current;

		return (
			<>
				<div className="px-2 border-b pb-3 flex items-center gap-2">
					<button
						className="back-button border hoverable inline-flex center-center cursor-pointer bg-black26 rounded-sm aspect-square"
						onClick={() => handleSetCurrentComponent(null)}
						style={{
							width: "24px",
							padding: 0,
							paddingRight: "1px",
						}}
					>
						<svg
							height="16"
							viewBox="0 0 24 24"
							strokeWidth={2.6}
							stroke="currentColor"
							fill="none"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M15.75 19.5L8.25 12l7.5-7.5"
							/>
						</svg>
					</button>

					<span
						className="capitalize font-medium"
						style={{
							fontSize: "1rem",
							lineHeight: "1",
							fontWeight: "bold",
							letterSpacing: "-0.03em",
						}}
					>
						{camelCaseToSentenceCase(currentComponent)}
					</span>
				</div>

				<Component />
			</>
		);
	}

	return <PresetGrid onSelect={handleSetCurrentComponent} />;
}
