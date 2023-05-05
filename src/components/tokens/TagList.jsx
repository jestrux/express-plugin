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
					<button
						key={index}
						className={`cursor-pointer py-1 border rounded-sm ${
							selected
								? "bg-dark-gray border-dark-gray text-white"
								: "bg-transparent text-darker-gray"
						}`}
						style={{
							fontSize: "13px",
							lineHeight: 1,
							padding: "0.35rem 0.55rem",
							borderColor: selected ? "" : "#c5c5c5",
						}}
						onClick={() => onChange(value, index)}
					>
						{camelCaseToSentenceCase(label).replace("-", " ")}
					</button>
				);
			})}
		</div>
	);
}
export default TagList;
