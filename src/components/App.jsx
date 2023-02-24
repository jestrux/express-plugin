import { useCallback, useEffect, useState } from "preact/hooks";

import ArticulateConfig from "../ArticulateConfig";
import PickComponent from "./PickComponent";
import EditComponent from "./EditComponent";
import Preview from "./Preview";

export default function App({ articulateRef }) {
	const [elements, setElements] = useState(articulateRef.elements || []);
	const [showEditor, setShowEditor] = useState(false);
	const [selectedElement, setSelectedElement] = useState(elements?.[0]);
	const [showComponentPicker, setShowComponentPicker] = useState(false);

	const meta = () => {
		const meta =
			selectedElement &&
			articulateRef.uiElements[selectedElement.component].meta;

		if (!meta) {
			console.log("No meta:");
			return null;
		}

		if (meta.onPlay) meta.animate = () => meta.onPlay(selectedElement);

		return meta;
	};

	useEffect(() => {
		setElements(articulateRef.elements);
	}, []);

	articulateRef.pickComponent = () => {
		setShowComponentPicker(true);
	};

	articulateRef.editElement = (element) => {
		setSelectedElement(element);

		setTimeout(() => {
			setShowEditor(true);
		});
	};

	articulateRef.removeElement = function (element) {
		if (
			!articulateRef.elements ||
			!articulateRef.elements.length ||
			!element ||
			!element.id
		)
			return;

		const newElements = articulateRef.elements.filter(
			({ id }) => id != element.id
		);
		articulateRef.elements = newElements;

		if (selectedElement && element.id == selectedElement.id)
			setSelectedElement(null);

		setElements(newElements);
		handleElementsChanged();
	};

	function handleElementsChanged() {
		articulateRef.onElementsChanged(articulateRef.elements);
	}

	function handleComponentPicked(component) {
		setShowComponentPicker(false);

		const { label, name, props, meta = {} } = component;
		const element = { label, component: name, options: {}, meta };

		let editBeforeAdding = false;
		for (const [key, { defaultValue, optional }] of Object.entries(props)) {
			element.options[key] = defaultValue;
			if (!optional && !defaultValue) editBeforeAdding = true;
		}

		if (editBeforeAdding) articulateRef.onComponentPicked(element);
		else handleSaveElement(element);
	}

	function handleSaveElement(element) {
		let newElements;

		if (!element.id) {
			element.id = (Math.random() * 1e32).toString(36);
			newElements = [element];
			// newElements = [...articulateRef.elements, element];

			articulateRef.onElementAdded(element);

			setTimeout(() => {
				var focusedElement = document.querySelector(
					`#ArticulateElement${element.id}`
				);
				if (focusedElement) {
					focusedElement.scrollIntoView();
				}
			}, 20);
		} else {
			newElements = elements.map((el) => {
				if (el.id === element.id) {
					articulateRef.onElementUpdated(element);
					return element;
				}

				return el;
			});
		}

		articulateRef.elements = newElements;
		setElements(newElements);
		setSelectedElement(newElements?.[0]);
		setShowEditor(true);
		handleElementsChanged(newElements);

		if (meta().animate) meta().animate();
	}

	return (
		<ArticulateConfig.Provider value={articulateRef}>
			<div class="bg-neutral-200/40 fixed inset-0">
				<div class="h-16 flex items-center border-b z-10 shadow-xs bg-white">
					<div class="w-20 flex justify-center">
						<a aria-current="page" class="active" href="/">
							<img
								class="h-11 rounded-lg"
								src="logo.webp"
								alt=""
							/>
						</a>
					</div>

					<nav class="ml-3 flex items-center gap-3 text-sm text-black/50 leading-none font-semibold">
						<a href="#">Home</a>
						<svg
							class="w-4"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={4}
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M8.25 4.5l7.5 7.5-7.5 7.5"
							/>
						</svg>
						<a href="#">Projects</a>
						<svg
							class="w-4"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={4}
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M8.25 4.5l7.5 7.5-7.5 7.5"
							/>
						</svg>
						<a href="#" class="text-black">
							My Project
						</a>
					</nav>
				</div>
				<main class="overflow-hidden flex items-start">
					<div class="flex-shrink-0 bg-white shadow border border-neutral-100 flex">
						<div class="flex-shrink-0 w-20 border-r">
							<ul class="py-1 flex flex-col space-y-4">
								<a
									class="active"
									href="/ui"
									aria-current="page"
								>
									<div class="flex flex-col gap-1 items-center mx-1 py-2.5 justify-center rounded-md bg-black/10">
										<svg
											class="w-6"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M10.5 4.5c.28 0 .5.22.5.5v2h6v6h2c.28 0 .5.22.5.5s-.22.5-.5.5h-2v6h-2.12c-.68-1.75-2.39-3-4.38-3s-3.7 1.25-4.38 3H4v-2.12c1.75-.68 3-2.39 3-4.38 0-1.99-1.24-3.7-2.99-4.38L4 7h6V5c0-.28.22-.5.5-.5m0-2C9.12 2.5 8 3.62 8 5H4c-1.1 0-1.99.9-1.99 2v3.8h.29c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-.3c0-1.49 1.21-2.7 2.7-2.7s2.7 1.21 2.7 2.7v.3H17c1.1 0 2-.9 2-2v-4c1.38 0 2.5-1.12 2.5-2.5S20.38 11 19 11V7c0-1.1-.9-2-2-2h-4c0-1.38-1.12-2.5-2.5-2.5z" />
										</svg>

										<span class="text-[11px] -mb-0.5 font-medium">
											Plugins
										</span>
									</div>
								</a>
							</ul>
						</div>

						<div class="flex-shrink-0">
							<PickComponent
								// opened={showComponentPicker}
								opened={true}
								onClose={() => setShowComponentPicker(false)}
								onComponentPicked={handleComponentPicked}
							/>
						</div>
					</div>

					<div className="flex-1 relative">
						<div class="max-w-3xl mx-auto h-screen p-10 -mt-8 flex justify-center items-center relative">
							<Preview
								className={`shadow-lg rounded-xl overflow-hidden
								${
									meta().autosize
										? ""
										: meta().aspectRatio == "portrait"
										? "w-[300px]"
										: "w-full"
								}
							`}
								elements={elements}
								selectedElement={selectedElement}
								onTextChange={handleSaveElement}
							/>
						</div>

						{meta().animate && (
							<button
								className="absolute bottom-12 left-6"
								onClick={meta().animate}
							>
								PLAY
							</button>
						)}
					</div>

					<EditComponent
						selectedElement={selectedElement}
						opened={showEditor}
						onClose={() => {
							setShowEditor(false);
						}}
						onChange={handleSaveElement}
						onSave={handleSaveElement}
					/>

					<div class="flex-shrink-0 h-screen w-20 border-l shadow bg-white">
						<ul class="py-1 flex flex-col space-y-4">
							<a class="active" href="/ui" aria-current="page">
								<div class="flex flex-col gap-1 items-center mx-1 py-2.5 justify-center rounded-md bg-black/10">
									<svg
										class="w-6"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M12,2C6.49,2,2,6.49,2,12s4.49,10,10,10c1.38,0,2.5-1.12,2.5-2.5c0-0.61-0.23-1.2-0.64-1.67c-0.08-0.1-0.13-0.21-0.13-0.33 c0-0.28,0.22-0.5,0.5-0.5H16c3.31,0,6-2.69,6-6C22,6.04,17.51,2,12,2z M17.5,13c-0.83,0-1.5-0.67-1.5-1.5c0-0.83,0.67-1.5,1.5-1.5 s1.5,0.67,1.5,1.5C19,12.33,18.33,13,17.5,13z M14.5,9C13.67,9,13,8.33,13,7.5C13,6.67,13.67,6,14.5,6S16,6.67,16,7.5 C16,8.33,15.33,9,14.5,9z M5,11.5C5,10.67,5.67,10,6.5,10S8,10.67,8,11.5C8,12.33,7.33,13,6.5,13S5,12.33,5,11.5z M11,7.5 C11,8.33,10.33,9,9.5,9S8,8.33,8,7.5C8,6.67,8.67,6,9.5,6S11,6.67,11,7.5z" />
									</svg>

									<span class="text-[11px] -mb-0.5 font-medium">
										Colors
									</span>
								</div>
							</a>
						</ul>
					</div>
				</main>
			</div>
		</ArticulateConfig.Provider>
	);
}
