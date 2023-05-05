import React, { useEffect, useRef, useState } from "react";
import ImagePicker from "../components/tokens/ImagePicker";

export default function useImage(src) {
	const [loading, setLoading] = useState(false);
	const image = useRef(null);

	const loadImage = (url) => {
		setLoading(true);

		image.current = new Image();

		image.current.onload = () => setLoading(false);

		image.current.src = url;
	};

	useEffect(() => {
		if (src) loadImage(src);
	}, [src]);

	const picker = () => {
		return (
			<div className="px-12px border-b mt-3 pb-3 mb-1 flex items-center">
				<ImagePicker onChange={loadImage} />
			</div>
		);
	};

	return {
		picker,
		image: image.current,
		loading,
	};
}
