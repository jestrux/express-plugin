import React from "react";
import { camelCaseToSentenceCase } from "../utils";

function TagList({ choices = [], onChange, ...props }) {
	return (
		<div className="flex flex-wrap gap-1 mt-1 rounded-xs overflow-hidden">
			{choices.map((choice, index) => {
				const isObject = typeof choice == "object";
				const label = isObject ? choice.label : choice;
				const value = isObject ? choice.value : choice;
				const selected = props.value == value;

				return (
					<span
						key={index}
						className={`cursor-pointer py-1 px-2 border rounded-lg text-sm font-medium ${
							selected
								? "bg-dark-gray text-white"
								: "text-dark-gray"
						}`}
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
