import React from "react";
// import { Button } from "@adobe/react-spectrum";
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

				// return (
				// 	<Button
				// 		key={index}
				// 		size="m"
				// 		style={selected ? "fill" : "outline"}
				// 		variant={selected ? "accent" : "secondary"}
				// 		onClick={() => onChange(value, index)}
				// 	>
				// 		<small className="capitalize">
				// 			{camelCaseToSentenceCase(label).replace("-", " ")}
				// 		</small>
				// 	</Button>
				// );

				return (
					<span
						key={index}
						className={`cursor-pointer py-1 border rounded-sm text-sm font-medium ${
							selected
								? "bg-dark-gray border-dark-gray text-white"
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
