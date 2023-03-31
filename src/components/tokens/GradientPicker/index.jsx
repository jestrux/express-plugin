import React from "react";
import GradientList from "./GradientList";
import Toggle from "../Toggle";

const GradientPicker = ({
	label = "GRADIENT",
	value,
	showToggle = true,
	compact = false,
	onChange = () => {},
}) => {
	const [selectedGradient, setSelectedGradient] = React.useState("");

	React.useEffect(() => {
		if (value && value != selectedGradient) setSelectedGradient(value);
	}, [value]);

	React.useEffect(() => {
		// if(selectedGradient != value)
		//     onChange(selectedGradient);
	}, [selectedGradient]);

	function toggleColorList() {
		const color = selectedGradient.length ? "" : colors[0];
		setSelectedGradient(color);
	}

	return (
		<div className={`${!compact && "py-2"}`}>
			{!compact && ((label && label.length > 0) || showToggle) && (
				<div className="flex items-center justify-between mb-1">
					<label className="text-md" style={{ marginTop: "0.15rem" }}>
						{label}
					</label>

					{showToggle && (
						<Toggle
							checked={selectedGradient.length}
							onChange={toggleColorList}
						/>
					)}
				</div>
			)}

			{selectedGradient.length > 0 && (
				<GradientList
					value={selectedGradient}
					onChange={setSelectedGradient}
				/>
			)}
		</div>
	);
};

export default GradientPicker;
