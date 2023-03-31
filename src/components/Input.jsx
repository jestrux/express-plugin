import React, { useRef, useState } from "react";
import useKeyDetector from "../hooks/useKeyDetector";

export default function Input({ onSubmit = () => {}, ...props }) {
	const inputRef = useRef(null);

	useKeyDetector({
		element: inputRef.current,
		key: "Enter",
		action: onSubmit,
	});

	return <input ref={inputRef} {...props} />;
}
