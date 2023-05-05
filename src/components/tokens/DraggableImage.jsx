import React, { useEffect, useRef } from "react";

export default function DraggableImage({ wrapped, ...props }) {
	const imageRef = useRef();

	useEffect(() => {
		window.AddOnSdk?.app.enableDragToDocument(
			wrapped ? imageRef.current.parentElement : imageRef.current,
			{
				previewCallback: () => new URL(imageRef.current.src),
				completionCallback: exportImage,
			}
		);
	}, []);

	const exportImage = async (e) => {
		const fromDrag = e?.target?.nodeName != "IMG";
		const blob = await fetch(imageRef.current.src).then((response) =>
			response.blob()
		);

		if (fromDrag) return [{ blob }];
		else window.AddOnSdk?.app.document.addImage(blob);
	};

	if (!wrapped)
		return (
			<img
				className="hoverable"
				ref={imageRef}
				{...props}
				onClick={exportImage}
			/>
		);

	return (
		<div
			draggable
			className="hoverable relative relative bg-transparent flex center-center p-3"
			style={{ height: "20vh" }}
			onClick={exportImage}
		>
			<img ref={imageRef} className="max-h-full max-w-full" {...props} />
		</div>
	);
}
