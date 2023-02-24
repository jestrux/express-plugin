import { render } from "preact";
import "./index.css";

import Confetti from "./components/UIElements/Confetti";
// import UIElements from "./components/UIElements";
// import * as UIElements from "./components/UIElements";
import App from "./components/App";

function ArticulateRef(userOptions = {}) {
	const defaultOptions = {
		highlightSelected: false,
		editOnFocus: true,
		// wrapperClass: "flex gap-3",
		uiElements: {
			Confetti,
		},
		elements: [],
		autoSaveCustomField: true,
		onComponentPicked: (component) => {
			this.editElement(component);
		},
		onCustomFieldChanged: (el) => {},
		onElementAdded: (el) => {},
		onElementUpdated: (el) => {},
		onElementsChanged: (elements) => {},
	};

	const { extend, ...options } = userOptions;

	const fullOptions = {
		...defaultOptions,
		...options,
	};

	for (const [key, value] of Object.entries(fullOptions)) {
		if (!extend || !extend[key]) this[key] = value;
		else {
			if (Array.isArray(value)) this[key] = [...value, ...extend[key]];
			else if (typeof value === "object")
				this[key] = { ...value, ...extend[key] };
			else this[key] = value;
		}
	}

	return this;
}

const articulateRef = new ArticulateRef({
	elements: [
		{
			component: "Confetti",
			options: {
				text: "Because you deserve this wonderful moment",
			},
			label: "Confetti 1",
			meta: {
				aspectRatio: "portrait",
				onPlay: () => {
					console.log("Play confetting");
				},
			},
			id: "20wff9rnb0fafa1s000000000",
		},
	],
});

render(<App articulateRef={articulateRef} />, document.querySelector("#app"));
