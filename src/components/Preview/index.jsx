import { useContext } from "preact/hooks";
import PreviewElement from "./PreviewElement";
import ArticulateConfig from "../../ArticulateConfig";
import { Fragment } from "preact";

export default function Preview({
	className,
	elements,
	selectedElement,
	onTextChange,
}) {
	const { wrapperClass } = useContext(ArticulateConfig);

	return (
		<Fragment>
			{elements.map((el) => (
				<PreviewElement
					element={el}
					selected={
						el.id && selectedElement && el.id == selectedElement.id
					}
					onTextChange={(value) =>
						onTextChange({
							...el,
							options: { ...el.options, text: value },
						})
					}
				/>
			))}
		</Fragment>
	);
}
