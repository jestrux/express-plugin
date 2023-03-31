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
		<label className="cursor-pointer p-2 bg-gray text-md block w-full text-center">
			<Input
				className="hidden"
				type="file"
				name="image"
				onChange={processImage}
			/>
			Pick photo
		</label>
	);
}
