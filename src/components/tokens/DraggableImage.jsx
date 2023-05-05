import React, { useEffect, useRef } from "react";

export default function DraggableImage(props) {
	const imageRef = useRef();

	useEffect(() => {
		window.AddOnSdk?.app.enableDragToDocument(imageRef.current, {
			previewCallback: (element) => new URL(element.src),
			completionCallback: exportImage,
		});
	}, []);

	const exportImage = async (e) => {
		const fromDrag = e?.target?.nodeName != "IMG";
		const blob = await fetch(imageRef.current.src).then((response) =>
			response.blob()
		);

		if (fromDrag) return [{ blob }];
		else window.AddOnSdk?.app.document.addImage(blob);
	};

	return <img ref={imageRef} draggable onClick={exportImage} {...props} />;
}
