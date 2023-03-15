import React from "react";
import { DEFAULT_COLORS } from "../../constants";
import Toggle from "../Toggle";
import IconList from "./IconList";

const IconPicker = ({
	colors = DEFAULT_COLORS,
	label = "ICON",
	value,
	showToggle = true,
	compact = false,
	onChange = () => {},
}) => {
	const [selectedIcon, setSelectedIcon] = React.useState("");

	React.useEffect(() => {
		if (value && value != selectedIcon) setSelectedIcon(value);
	}, [value]);

	React.useEffect(() => {
		if (selectedIcon != value) onChange(selectedIcon);
	}, [selectedIcon]);

	function toggleColorList() {
		const color = selectedIcon.length ? "" : colors[0];
		setSelectedIcon(color);
	}

	return (
		<div className={`${!compact && "py-2"}`}>
			{!compact && ((label && label.length > 0) || showToggle) && (
				<div className="flex items-center justify-between">
					<label className="text-md">{label}</label>

					{showToggle && (
						<Toggle
							checked={selectedIcon.length}
							onChange={toggleColorList}
						/>
					)}
				</div>
			)}

			{selectedIcon.length > 0 && (
				<IconList
					icons={[
						"circle",
						"airfield",
						"cafe",
						"bar",
						"car",
						"chargin-station",
					]}
					selectedIcon={selectedIcon}
					onChangeColor={setSelectedIcon}
				/>
			)}
		</div>
	);
};

export default IconPicker;
