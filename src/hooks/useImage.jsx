import React, { useEffect, useRef, useState } from "react";
import ImagePicker from "../components/tokens/ImagePicker";
import { loadImageFromUrl } from "../components/utils";

export default function useImage(src) {
	const [loading, setLoading] = useState(false);
	const [image, setImage] = useState(null);
	const [images, setImages] = useState(null);
	const imagesRef = useRef({});

	const updateImage = (id, newValue) => {
		updateImages({
			...(imagesRef.current || {}),
			[id]: newValue,
		});
	};

	const updateImages = (newValue) => {
		imagesRef.current = newValue;
		setImages(imagesRef.current);
	};

	const loadImage = async (url, imageId) => {
		if (imageId) updateImage(imageId, null);
		else setImage(null);

		const img = await loadImageFromUrl(url);

		if (imageId) updateImage(imageId, img);
		else {
			setLoading(false);
			setImage(img);
		}

		return img;
	};

	const loadImages = async (urls) => {
		updateImages({});
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
		images,
		image,
		loading,
	};
}
