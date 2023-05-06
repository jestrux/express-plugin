import React, { useEffect, useRef, useState } from "react";
import ImagePicker from "../components/tokens/ImagePicker";

export default function useImage(src) {
	const [loading, setLoading] = useState(false);
	const image = useRef(null);
	const images = useRef(null);

	const loadImage = (url, imageId) => {
		if (imageId) images.current[imageId] = null;
		else image.current = null;

		return new Promise((resolve) => {
			if (!imageId) setLoading(true);

			const img = new Image();

			img.onload = () => {
				if (imageId) images.current[imageId] = img;
				else {
					image.current = img;
					setLoading(false);
				}

				resolve(img);
			};

			img.src = url;
		});
	};

	const loadImages = async (urls) => {
		images.current = {};
		setLoading(true);
		await Promise.all(
			Object.entries(urls).map(([id, image]) => loadImage(image, id))
		);
		setLoading(false);
	};

	useEffect(() => {
		if (!src) return;

		if (typeof src == "object") loadImages(src);
		else loadImage(src);
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
		images: images.current,
		image: image.current,
		loading,
	};
}
