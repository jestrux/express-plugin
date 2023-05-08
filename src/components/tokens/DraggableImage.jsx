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

		window.AddOnSdk?.app.enableDragToDocument(
			wrapped ? imageRef.current.parentElement : imageRef.current,
			{
				previewCallback: () => new URL(src()),
				completionCallback: exportImage,
			}
		);
	}, [loading, props.src]);

	const exportImage = async (e) => {
		const fromDrag = e?.target?.nodeName != "IMG";
		const blob = await fetch(src()).then((response) => response.blob());

		if (fromDrag) return [{ blob }];
		else window.AddOnSdk?.app.document.addImage(blob);
	};

	if (!wrapped) {
		return loading || !src() ? (
			<Loader />
		) : (
			<div className="w-full h-full flex center-center" ref={imageRef}>
				{props.children ? (
					props.children
				) : (
					<img
						className="hoverable"
						{...props}
						onClick={exportImage}
					/>
				)}
			</div>
		);
	}

	return (
		<>
			<div
				draggable
				className="hoverable relative relative bg-transparent"
				style={{ height: "20vh" }}
				onClick={exportImage}
			>
				{props.loading || src() ? (
					<Loader />
				) : (
					<div
						ref={imageRef}
						className="h-full w-full flex center-center p-3"
					>
						<img className="max-h-full max-w-full" {...props} />
					</div>
				)}
			</div>
			{info && <InfoCard />}
		</>
	);
}
