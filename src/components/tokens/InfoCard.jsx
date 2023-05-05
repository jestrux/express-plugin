import React from "react";

export default function InfoCard({ children }) {
	return (
		<div
			className="flex items-start px-12px text bg-light-gray"
			style={{
				fontSize: "11px",
				lineHeight: 1.3,
				paddingTop: "0.4rem",
				paddingBottom: "0.5rem",
				gap: "0.3rem",
			}}
		>
			<svg
				className="flex-shrink-0 text-primary"
				width="16px"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fillRule="evenodd"
					d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
					clipRule="evenodd"
				/>
			</svg>

			<div style={{ marginTop: "0.1rem" }}>
				{children
					? children
					: "Click or drag and drop to add to canvas"}
			</div>
		</div>
	);
}
