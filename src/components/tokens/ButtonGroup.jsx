import React from "react";

function ButtonGroup({ choices = [], onChange, ...props }) {
	return (
		<div
			className="inline-flex border bg-white rounded-sm overflow-hidden"
			style={{ padding: "0.1rem", borderColor: "#ccc" }}
		>
			{choices.map((choice, index) => {
				const isObject = typeof choice == "object";
				const label = isObject ? choice.label : choice;
				const value = isObject ? choice.value : choice;
				const selected = props.value == value;

				return (
					<span
						key={index}
						className={`capitalize rounded-xs cursor-pointer font-medium ${
							index < choices.length - 1 && `border-r`
						} ${
							selected
								? "bg-dark-gray text-white"
								: "text-darker-gray"
						}`}
						style={{
							fontSize: "12px",
							padding: "0.2rem 0.5rem",
						}}
						onClick={() => onChange(value, index)}
					>
						{label.toString()}
					</span>
				);
			})}
		</div>
	);
}
export default ButtonGroup;
