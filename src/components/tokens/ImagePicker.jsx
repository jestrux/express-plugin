import React from "react";
import Input from "./Input";

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
				{...(multiple ? { multiple: true } : {})}
			/>
			{multiple ? "Select images" : "Select image"}
		</label>
	);
}
