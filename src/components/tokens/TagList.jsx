import React from "react";
import { camelCaseToSentenceCase } from "../utils";

function TagList({ choices = [], onChange, ...props }) {
	return (
		<div
			className="flex flex-wrap mt-1 rounded-xs overflow-hidden"
			style={{ rowGap: "0.35rem", columnGap: "0.25rem" }}
		>
			{choices.map((choice, index) => {
				const isObject = typeof choice == "object";
				const label = isObject ? choice.label : choice;
				const value = isObject ? choice.value : choice;
				const selected = props.value == value;

				return (
					<span
						key={index}
						className={`cursor-pointer py-1 border rounded-lg text-sm font-medium ${
							selected
								? "bg-primary border-primary text-white"
								: "text-darker-gray"
						}`}
						style={{
							paddingLeft: "0.6rem",
							paddingRight: "0.6rem",
							fontSize: "12px",
							borderColor: selected ? "" : "#c5c5c5",
						}}
						onClick={() => onChange(value, index)}
					>
						{/* { label.toString().toUpperCase() } */}
						{camelCaseToSentenceCase(label).replace("-", " ")}
					</span>
				);
			})}
		</div>
	);
}
export default TagList;
