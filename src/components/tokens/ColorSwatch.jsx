import React, { useEffect, useRef, useState } from "react";

function SingleSwatch({ value, onChange }) {
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

export default function ({ themes, value, onChange }) {
	const [_themes, setThemes] = useState([]);
	const [theme, setTheme] = useState(value);

	const themesRef = useRef();

	useEffect(() => {
		if (themesRef?.current == null) {
			themesRef.current = themes;
			setThemes(themes);
		}
	}, [value]);

	if (!themes) return <SingleSwatch value={value} onChange={onChange} />;

	return (
		<div className="my-2 flex flex-col gap-3">
			{_themes.map((colors, index) => (
				<button
					style={{
						border: "none",
						padding: 0,
					}}
					key={index}
					onClick={() => {
						setTheme(theme);
						onChange(colors);
					}}
				>
					<SingleSwatch
						value={colors}
						onChange={(newColors) => {
							setThemes(
								_themes.map((theme, i) =>
									i == index ? newColors : theme
								)
							);
							setTheme(newColors);
							onChange(newColors);
						}}
					/>
				</button>
			))}
		</div>
	);
}
