import React, { useEffect, useState } from "react";
import { Popover } from "react-tiny-popover";
import gradients from "./gradients";
import { hexAverage } from "../../utils";

const GradientEditor = ({ showPresets = true, value, onChange }) => {
	const [shiftHeld, setShiftHeld] = useState(false);
	const [_value, setValue] = useState(value || ["#737DFE", "#FFCAC9"]);
	const valueString = _value
		.map((color, idx) => {
			return `${color} ${(idx * 100) / (_value.length - 1)}%`;
		})
		.join(", ");

	const handleSetValue = (value) => {
		setValue(value);
		if (typeof onChange == "function") onChange(value);
	};

	const updateColor = (e) => {
		const { value: val, name } = e.target || { name: e };
		let newValue;

		if (["new", "remove"].includes(name)) {
			newValue = [...value];
			if (name == "new") newValue.splice(1, 0, val);
			else newValue.splice(1, 1);
		} else {
			newValue = value.map((color, i) => {
				if (i == name) return val;
				return color;
			});
		}

		handleSetValue(newValue);
	};

	const handleShiftPress = (e) => setShiftHeld(e.shiftKey);

	useEffect(() => {
		document.addEventListener("keyup", handleShiftPress, false);
		document.addEventListener("keydown", handleShiftPress, false);

		return () => {
			document.removeEventListener("keydown", handleShiftPress, false);
			document.removeEventListener("keyup", handleShiftPress, false);
		};
	}, []);

	return (
		<div
			className="ml-3 rounded-sm overflow-hidden bg-white shadow"
			style={{
				width: "250px",
				boxShadow: "2px 2px 15px -2px rgba(0, 0, 0, 0.4)",
			}}
		>
			<div
				className="border-b border-gray"
				style={{
					aspectRatio: 2 / 0.8,
					background: `linear-gradient(90deg, ${valueString})`,
				}}
			></div>

			<div
				className="flex items-center justify-between p-2"
				style={{ height: "36px" }}
			>
				{_value.map((color, index) => {
					const label = (color, index) => {
						const removeMidColor =
							_value.length == 3 && index == 1 && shiftHeld;

						return (
							<label
								className="hoverable h-full aspect-square rounded-xs border flex center-center"
								style={{
									background: index == "new" ? "" : color,
								}}
								onClick={
									removeMidColor
										? (e) => {
												e.preventDefault();
												updateColor("remove");
										  }
										: null
								}
							>
								<input
									className="absolute opacity-0"
									style={{ width: 0, height: 0 }}
									type="color"
									value={color}
									name={index}
									onChange={updateColor}
								/>

								{(index == "new" || removeMidColor) && (
									<svg
										className="opacity-50"
										width={12}
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={3}
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d={
												index == "new"
													? "M12 4.5v15m7.5-7.5h-15"
													: "M19.5 12h-15"
											}
										/>
									</svg>
								)}
							</label>
						);
					};

					return (
						<React.Fragment key={index}>
							{label(color, index)}
							{index == 0 &&
								_value.length == 2 &&
								label(hexAverage(_value[0], _value[1]), "new")}
						</React.Fragment>
					);
				})}
			</div>

			{showPresets && (
				<div
					className="border-t border-gray py-2 px-1"
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(7, 1fr)",
						gap: "0.25rem",
					}}
				>
					{Object.values(gradients).map((colors, index) => {
						const gradient = colors
							.map((color, idx) => {
								return `${color} ${
									(idx * 100) / (colors.length - 1)
								}%`;
							})
							.join(", ");

						const selected = gradient == valueString;

						return (
							<div
								key={index}
								className={`relative cursor-pointer border rounded-sm ${
									selected && "bg-primary"
								}`}
								style={{ padding: "0.125rem" }}
								onClick={() => handleSetValue(colors)}
							>
								{selected && (
									<div
										className="absolute top-0 right-0 bg-primary rounded-xs flex center-center"
										style={{
											width: "12px",
											height: "12px",
											zIndex: 1,
										}}
									>
										<svg
											width={6}
											viewBox="0 0 24 24"
											fill="none"
											stroke="#fff"
											strokeWidth={5}
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M4.5 12.75l6 6 9-13.5"
											/>
										</svg>
									</div>
								)}

								<div className="flex-shrink-0">
									<div
										className="bg-gray rounded-xs relative overflow-hidden"
										style={{
											aspectRatio: 1,
											background: `linear-gradient(90deg, ${gradient})`,
										}}
									></div>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

const GradientCard = ({ showPresets = false, value, selected, onChange }) => {
	const [_value, setValue] = useState(value);
	const gradient = value
		.map((color, idx) => {
			return `${color} ${(idx * 100) / (value.length - 1)}%`;
		})
		.join(", ");
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);

	return (
		<Popover
			isOpen={isPopoverOpen}
			padding={10}
			onClickOutside={() => setIsPopoverOpen(false)}
			content={() => (
				<GradientEditor
					showPresets={showPresets}
					value={value}
					onChange={(value) => {
						setValue(value);
						onChange(value);
					}}
				/>
			)}
		>
			<div
				className={`relative cursor-pointer border rounded-sm overflow-hidden ${
					selected && "bg-primary"
				}`}
				style={{ padding: showPresets ? 0 : "0.125rem" }}
				onClick={() => {
					setIsPopoverOpen(!isPopoverOpen);
					onChange(value);
				}}
			>
				{selected && (
					<div
						className="absolute top-0 right-0 bg-primary rounded-sm flex center-center"
						style={{
							width: "12px",
							height: "12px",
							zIndex: 1,
						}}
					>
						<svg
							width={6}
							viewBox="0 0 24 24"
							fill="none"
							stroke="#fff"
							strokeWidth={5}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M4.5 12.75l6 6 9-13.5"
							/>
						</svg>
					</div>
				)}

				<div className="flex-shrink-0">
					<div
						className="bg-gray rounded-sm relative overflow-hidden"
						style={{
							height: showPresets ? 28 : 40,
							background: `linear-gradient(90deg, ${gradient})`,
							borderRadius: showPresets ? 0 : "",
						}}
					></div>
				</div>
			</div>
		</Popover>
	);
};

const GradientList = ({ value, onChange, singleChoice }) => {
	if (singleChoice) {
		return (
			<GradientCard
				showPresets={true}
				value={value}
				onChange={onChange}
			/>
		);
	}

	const valueString = (value || [])
		.map((color, idx) => {
			return `${color} ${(idx * 100) / (value.length - 1)}%`;
		})
		.join(", ");

	return (
		<div
			className=""
			style={{
				display: "grid",
				gridTemplateColumns: "1fr 1fr 1fr 1fr",
				gap: "0.35rem",
			}}
		>
			{Object.keys(gradients).map((name, index) => {
				const colors = gradients[name];
				const gradient = colors
					.map((color, idx) => {
						return `${color} ${(idx * 100) / (colors.length - 1)}%`;
					})
					.join(", ");

				const selected = gradient == valueString;

				return (
					<GradientCard
						key={index}
						value={colors}
						selected={selected}
						onChange={onChange}
					/>
				);
			})}
		</div>
	);
};

export default GradientList;
