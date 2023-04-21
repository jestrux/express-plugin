import React from "react";
import { camelCaseToSentenceCase } from "../utils";

function GridList({ choices = [], render, onChange, ...props }) {
	return (
		<div
			className="mt-1 flex flex-wrap"
			style={{
				display: "grid",
				gridTemplateColumns: "1fr 1fr 1fr 1fr",
				gap: "0.25rem",
			}}
		>
			{choices.map((choice, index) => {
				const isObject = typeof choice == "object";
				const label = isObject ? choice.label : choice;
				const value = isObject ? choice.value : choice;
				const selected = props.value == value;

				return (
					<div
						key={index}
						className={`hoverable aspect-square flex flex-col flex-wrap center-center border rounded ${
							selected
								? "bg-black26 border-dark-gray"
								: "text-darker-gray"
						}`}
						style={{
							width: "100%",
							overflow: "hidden",
							borderColor: selected ? "" : "#d5d5d5",
						}}
						onClick={() => onChange(value, index)}
					>
						{typeof render == "function" ? (
							render(value)
						) : (
							<span
								className="text-sm font-medium"
								style={{
									paddingLeft: "0.6rem",
									paddingRight: "0.6rem",
									fontSize: "12px",
									borderColor: selected ? "" : "#c5c5c5",
									width: "100%",
								}}
							>
								{camelCaseToSentenceCase(label).replace(
									"-",
									" "
								)}
							</span>
						)}
					</div>
				);
			})}
		</div>
	);
}
export default GridList;
