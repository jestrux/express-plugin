import { useContext } from "preact/hooks";
import PreviewElement from "./PreviewElement";
import ArticulateConfig from "../../ArticulateConfig";

export default function Preview({
	className,
	elements,
	selectedElement,
	onTextChange,
}) {
	const { wrapperClass } = useContext(ArticulateConfig);

	return (
		<div class={`${wrapperClass} ${className}`}>
			{elements.map((el) => (
				<div class={`articulate-element ${el.component}`}>
					<PreviewElement
						element={el}
						selected={
							el.id &&
							selectedElement &&
							el.id == selectedElement.id
						}
						onTextChange={(value) =>
							onTextChange({
								...el,
								options: { ...el.options, text: value },
							})
						}
					/>
				</div>
			))}
		</div>
	);
}
