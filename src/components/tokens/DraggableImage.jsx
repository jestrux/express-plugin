import React, { useEffect, useRef } from "react";
import Loader from "./Loader";
import InfoCard from "./InfoCard";

export default function DraggableImage({
	wrapped,
	loading = false,
	info = false,
	wrapperProps,
	...props
}) {
	const imageRef = useRef();
	const src = () => {
		if (!props.src) return null;
		if (typeof props.src == "function") return props.src();

		return props.src;
	};

	useEffect(() => {
		if (loading || !props.src) return;

		window.AddOnSdk?.app.enableDragToDocument(imageRef.current, {
			previewCallback: () => new URL(src()),
			completionCallback: exportImage,
		});
	}, [loading, props.src]);

	const exportImage = async (e) => {
		const fromDrag = !e?.target;
		const blob = await fetch(src()).then((response) => response.blob());

		if (fromDrag) return [{ blob }];
		else window.AddOnSdk?.app.document.addImage(blob);
	};

	if (loading || !src())
		return (
			<div
				className="w-full h-full flex center-center relative"
				style={{ height: wrapped ? "20vh" : "", minHeight: "50px" }}
			>
				<Loader fillParent />
			</div>
		);

	if (!wrapped) {
		return (
			<div
				key={src()}
				ref={imageRef}
				draggable
				className="w-full h-full flex center-center"
				onClick={exportImage}
			>
				{props.children ? (
					props.children
				) : (
					<img className="hoverable" {...props} />
				)}
			</div>
		);
	}

	return (
		<>
			<div
				key={src()}
				ref={imageRef}
				draggable
				className="hoverable relative relative bg-transparent"
				style={{ height: "20vh" }}
				onClick={exportImage}
			>
				<div className="h-full w-full flex center-center p-3">
					{props.children ? (
						props.children
					) : (
						<img className="max-h-full max-w-full" {...props} />
					)}
				</div>
			</div>
			{info && <InfoCard />}
		</>
	);
}
