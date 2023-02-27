import { h } from "preact";
import { useState } from "preact/hooks";

const objectField = (object, field) => {
	return typeof object == "object" ? object?.[field] : object;
};

export default function RadioField({ field, onChange }) {
	const [customColor, setCustomColor] = useState();
	let { name, label, choices, defaultValue, value, type, ...fieldMeta } =
		field;
	if (value === undefined && defaultValue) value = defaultValue;

	const defaultStyle = field.renderChoice || field.choiceType == "color";

	function renderChoice(choice, selected, randomName) {
		return (
			<label
				class={`cursor-pointer text-sm font-medium inline-flex items-center justify-center rounded px-3 py-1 border mb-2 ${
					selected
						? "bg-neutral-200/60 border-neutral-400"
						: "border-neutral-300"
				}`}
			>
				<input
					class="hidden -ml-1 mr-2"
					type="radio"
					name={randomName}
					checked={selected}
					value={objectField(choice, "value")}
					onChange={onChange}
				/>
				{choice.label || choice}
			</label>
		);
	}

	function renderColorChoice(color, selected) {
		return `
            <span class="rounded-full bg-gray-500 inline-block p-0.5" style="width: 30px; height: 30px; background: ${color}">
                <span class="border-2 border-${
					selected ? "white" : "transparent"
				} rounded-full w-full h-full block"></span>
            </span>
        `;
	}

	function renderChoices() {
		return (
			<div
				class={`text-md text-gray-700 gap-2 ${
					defaultStyle
						? "flex items-center text-center"
						: "grid grid-cols-3"
				}`}
			>
				{choices.map((choice, index) => {
					const selected = objectField(choice, "value") == value;
					const randomName = (Math.random() * 1e32).toString(36);

					if (field.renderChoice) {
						return (
							<label class="cursor-pointer">
								<input
									class="hidden"
									type="radio"
									name={randomName}
									checked={selected}
									value={objectField(choice, "value")}
									onChange={onChange}
								/>

								{h("span", {
									innerHTML: field.renderChoice(
										choice.label || choice,
										selected
									),
								})}
							</label>
						);
					} else if (field.choiceType == "color") {
						let color = objectField(choice, "value");
						if (field.colors) color = field.colors[index];

						return (
							<label class="cursor-pointer">
								<input
									class="hidden"
									type="radio"
									name={randomName}
									checked={selected}
									value={objectField(choice, "value")}
									onChange={onChange}
								/>

								{h("span", {
									innerHTML: renderColorChoice(
										color,
										selected
									),
								})}
							</label>
						);
					}

					return renderChoice(choice, selected, randomName);
				})}

				{field.choiceType == "color" && (
					<label class="cursor-pointer">
						<input
							class="hidden"
							type="color"
							value={customColor}
							onChange={(e) => {
								setCustomColor(e.target.value);
								onChange(e.target.value);
							}}
						/>

						<span
							class="relative rounded-full bg-neutral-200 inline-flex items-center justify-center p-0.5"
							style={`width: 30px; height: 30px; background: ${customColor}`}
						>
							{/* <span
								class={`absolute inset-0 block border-2 border-${
									value == customColor
										? "white"
										: "transparent"
								} rounded-full w-full h-full block`}
							></span> */}

							<svg class="w-5" viewBox="0 0 24 24">
								<path d="M12,2C6.49,2,2,6.49,2,12s4.49,10,10,10c1.38,0,2.5-1.12,2.5-2.5c0-0.61-0.23-1.2-0.64-1.67c-0.08-0.1-0.13-0.21-0.13-0.33 c0-0.28,0.22-0.5,0.5-0.5H16c3.31,0,6-2.69,6-6C22,6.04,17.51,2,12,2z M17.5,13c-0.83,0-1.5-0.67-1.5-1.5c0-0.83,0.67-1.5,1.5-1.5 s1.5,0.67,1.5,1.5C19,12.33,18.33,13,17.5,13z M14.5,9C13.67,9,13,8.33,13,7.5C13,6.67,13.67,6,14.5,6S16,6.67,16,7.5 C16,8.33,15.33,9,14.5,9z M5,11.5C5,10.67,5.67,10,6.5,10S8,10.67,8,11.5C8,12.33,7.33,13,6.5,13S5,12.33,5,11.5z M11,7.5 C11,8.33,10.33,9,9.5,9S8,8.33,8,7.5C8,6.67,8.67,6,9.5,6S11,6.67,11,7.5z" />
							</svg>
						</span>
					</label>
				)}
			</div>
		);
	}

	return <div class="mt-1">{renderChoices()}</div>;
}
