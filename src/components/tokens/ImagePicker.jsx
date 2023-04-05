import React from "react";
import Input from "./Input";

export default function ImagePicker({ onChange }) {
	const processImage = (e) => {
		const files = e.target.files;
		if (!files?.length) return;

		const file = files[0];
		const reader = new FileReader();

		onChange(null);
		reader.onload = (e) => onChange(e.target.result);
		reader.readAsDataURL(file);

		e.target.value = "";
	};

	return (
		<label
			className="hoverable bg-gray border text-primary font-medium block w-full text-center flex center-center rounded-sm"
			style={{ height: "34px", fontSize: "13px" }}
		>
			<Input
				className="hidden"
				type="file"
				name="image"
				onChange={processImage}
			/>
			Select image
		</label>
	);
}
