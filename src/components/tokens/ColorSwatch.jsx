import React from "react";

export default function ColorSwatch({ value, onChange }) {
	const choiceSize = 28;
	const updateColor = (key, newColor) => {
		onChange({ ...value, [key]: newColor });
	};

	return (
		<div className="flex flex-wrap items-center rounded-sm overflow-hidden border border-black divide-y">
			{Object.entries(value).map(([name, color]) => {
				return (
					<label
						key={name}
						title={name}
						className="relative cursor-pointer"
						style={{
							flex: 1,
							flexShrink: 0,
							backgroundColor: color,
						}}
					>
						<input
							type="color"
							defaultValue={color}
							className="absolute opacity-0"
							style={{ width: 0, height: 0 }}
							onChange={(e) => updateColor(name, e.target.value)}
						/>

						<div
							style={{
								width: choiceSize,
								height: choiceSize,
							}}
						></div>
					</label>
				);
			})}
		</div>
	);
}
