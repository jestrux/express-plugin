import React from "react";
import Input from "./Input";
import { Button } from "@adobe/react-spectrum";

const readFile = (file) => {
	return new Promise((res) => {
		const reader = new FileReader();
		reader.onload = (e) => res(e.target.result);
		reader.readAsDataURL(file);
	});
};

export default function ImagePicker({ multiple, onChange }) {
	const processImage = async (e) => {
		const files = e.target.files;

		if (!files?.length) return;

		onChange(null);

		const res = await (multiple
			? Promise.all(Array.from(files).map(readFile))
			: readFile(files[0]));

		onChange(res);

		e.target.value = "";
	};

	// return (
	// 	<Button elementType="label" width="100%" variant="accent">
	// 		<Input
	// 			className="hidden"
	// 			type="file"
	// 			name="image"
	// 			onChange={processImage}
	// 			{...(multiple ? { multiple: true } : {})}
	// 		/>
	// 		{multiple ? "Add images from device" : "Add image from device"}
	// 	</Button>
	// );

	return (
		<label
			className="hoverable border border-primary bg-primary text-white block w-full text-center flex center-center gap-2 rounded-full"
			style={{ height: "40px", fontSize: "0.82rem" }}
		>
			<Input
				className="hidden"
				type="file"
				name="image"
				onChange={processImage}
				{...(multiple ? { multiple: true } : {})}
			/>

			{multiple ? (
				<svg fill="currentColor" height="18" viewBox="0 0 24 24">
					<path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z" />
				</svg>
			) : (
				<svg fill="currentColor" height="18" viewBox="0 0 24 24">
					<path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
				</svg>
			)}

			{multiple ? "Add images from device" : "Add image from device"}
		</label>
	);
}
