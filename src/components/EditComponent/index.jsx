import { useContext, useEffect, useState } from "preact/hooks";
import ArticulateConfig from "../../ArticulateConfig";
import EditField from "../EditField";
import EditorField from "./EditorField";

export default function EditComponent({
	opened = false,
	selectedElement,
	onChange,
	onClose,
}) {
	const [el, setEl] = useState(null);
	const {
		uiElements,
		onCustomFieldChanged = () => {},
		...context
	} = useContext(ArticulateConfig);
	const [showFieldEditor, setShowFieldEditor] = useState(false);
	const [selectedField, setSelectedField] = useState(null);

	if (!uiElements) return null;

	function fields() {
		if (!el || !el.component) return [];

		if (!el.options) el.options = {};

		const component = uiElements[el.component];
		const fields = [];

		for (const key in component.props) {
			const { type, defaultValue, ...otherFields } = component.props[key];
			const field = { type, defaultValue, ...otherFields };

			if (el.options[key] !== undefined) field.value = el.options[key];
			else if (defaultValue !== undefined) {
				el.options[key] = defaultValue;
				field.value = defaultValue;
			}

			field.name = key;
			fields.push(field);
		}

		return fields;
	}

	useEffect(() => {
		setEl(JSON.parse(JSON.stringify({ ...selectedElement })));
	}, [selectedElement]);

	function handleChange(value, field) {
		const options = {
			...el.options,
			[field]: value,
		};

		setEl({ ...el, options });

		onChange({ ...el, options });
	}

	function handleSaveElement(e) {
		e.preventDefault();
		onChange({ ...el, options });
		onClose();
	}

	function handleChangeCustomField(field) {
		setSelectedField({ ...field, autoSave: true });
		setTimeout(() => {
			setShowFieldEditor(true);
		}, 100);
	}

	function handleCustomFieldChanged(value) {
		handleChange(value, selectedField.name);
		onCustomFieldChanged(selectedField, value);
	}

	function handleCloseCustomFieldEditor() {
		setShowFieldEditor(false);
		onCustomFieldChanged(selectedField, undefined);
	}

	return (
		<div class="flex fixed inset-0 top-16 z-50 z-999 pointer-events-none">
			{/* <div
				class={`bg-black bg-opacity-25 fixed inset-0 transition ${
					opened ? "pointer-events-all" : "opacity-0"
				}`}
				onClick={onClose}
			></div> */}

			<div
				class={`ml-auto flex flex-col h-full relative z-10 w-[320px] bg-white shadow overflow-hidden transition
				${opened ? "pointer-events-auto" : "translate-x-full opacity-0"}
				`}
			>
				<div class="p-4 border-bs flex items-center justify-between">
					<h3 class="ml-1 text-lg font-medium">
						Customize {el ? el.label || "Component" : ""}
					</h3>

					<button
						class="focus:outline-none w-7 h-7 rounded-full p-0 flex items-center justify-center hover:bg-neutral-200/90"
						onClick={onClose}
					>
						<svg
							class="w-5 h-5 opacity-60"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							></path>
						</svg>
					</button>
				</div>

				<div class="mt-1 px-4 flex-1 overflow-y-auto">
					{/* <form action="#" onSubmit={handleSaveElement}> */}
					{fields().map((field) => (
						<div class="mb-4">
							<EditorField
								field={field}
								inlineCustomEditor={false}
								onEditCustomField={handleChangeCustomField}
								onChange={(value) =>
									handleChange(value, field.name)
								}
							/>
						</div>
					))}

					{typeof context.onComponentSaved == "function" && (
						<div class="mt-3 flex justify-end">
							<button
								type="button"
								class="px-5 py-1 border-2 border-red-500 uppercase text-xs tracking-wide font-semibold bg-red-500 text-white rounded-full"
								onClick={() => {
									onClose();
									context.onComponentSaved(el);
								}}
							>
								Save Changes
							</button>
						</div>
					)}
					{/* </form> */}

					<EditField
						selectedField={selectedField}
						opened={showFieldEditor}
						onChange={handleCustomFieldChanged}
						onClose={handleCloseCustomFieldEditor}
					/>
				</div>
			</div>
		</div>
	);
}
