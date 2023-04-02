import React from "react";
import { camelCaseToSentenceCase } from "../utils";
import ButtonGroup from "./ButtonGroup";
import ColorList from "./ColorList";
import GradientList from "./GradientPicker/GradientList";
import IconList from "./IconPicker/IconList";
// import ImageEditorField from "./ImageEditorField";
import LogoEditorField from "./LogoEditorField";
import TagList from "./TagList";
import Toggle from "./Toggle";

function ListEditor({ links, activeLink, onChange, onChangeActiveLink }) {
	const [linkBeingEdited, setLinkBeingEdited] = React.useState(null);
	function handleSetLinks(links) {
		onChange(links);
	}

	function handleLinkTextChanged(e) {
		e.preventDefault();
		const form = e.target;
		const newValue = form.elements[0].value;

		if (links[linkBeingEdited] != newValue) {
			const newLinks = [...links];
			newLinks.splice(linkBeingEdited, 1, newValue);

			const wasSelected = linkBeingEdited === links.indexOf(activeLink);
			onChange(newLinks, wasSelected ? newValue : null);
		} else setLinkBeingEdited(null);
	}

	function handleMoveLink(e, linkIndex) {
		const isLastItem = linkIndex === links.length - 1;
		const { shiftKey, altKey } = e;
		const leap = shiftKey ? 3 : 1;
		let newIndex =
			isLastItem || altKey ? linkIndex - leap : linkIndex + leap;

		// clamp
		newIndex = Math.max(0, Math.min(newIndex, links.length - 1));

		const newLinks = [...links];
		const link = newLinks.splice(linkIndex, 1)[0];
		newLinks.splice(newIndex, 0, link);

		onChange(newLinks);
	}

	return (
		<div className="pt-2 mt-3">
			<div className="flex items-center justify-between px-3">
				<label className="text-md">Links</label>

				<Toggle checked={links} onChange={handleSetLinks} />
			</div>

			{links && (
				<div className="-mx-12pxs mt-1">
					<div className="bg-white">
						{links.map((link, index) => {
							const selected = activeLink === link;
							const editting = linkBeingEdited === index;

							return (
								<div
									key={index}
									className={`parent bg-white py-2 px-3 border-b border-light-gray flex items-center ${
										selected ? "text-blue" : ""
									}`}
								>
									<div
										className={`mr-2 rounded-full border ${
											selected
												? "bg-blue border-blue"
												: "border-dark-gray cursor-pointer"
										}`}
										style={{
											width: "10px",
											height: "10px",
										}}
										onClick={() =>
											selected
												? null
												: onChangeActiveLink(link)
										}
									></div>

									{editting && (
										<form
											action="#"
											className="flex-1 bg-gray"
											onSubmit={handleLinkTextChanged}
										>
											<input
												autoFocus
												className="w-full"
												defaultValue={link}
												name="link"
												uxp-quiet="true"
												onKeyDown={(e) =>
													e.key == "Escape"
														? setLinkBeingEdited(
																null
														  )
														: null
												}
											/>
										</form>
									)}

									{!editting && (
										<React.Fragment>
											<h5
												className="flex-1 text-base font-normal cursor-pointer"
												onClick={() =>
													setLinkBeingEdited(index)
												}
											>
												{link}
											</h5>

											<div
												className="visible-on-parent-hover cursor-pointer rounded-full bg-light-gray flex center-center"
												style={{
													width: "20px",
													height: "20px",
												}}
												onClick={(e) =>
													handleMoveLink(e, index)
												}
											>
												<svg
													width="14px"
													height="14px"
													viewBox="0 0 24 24"
												>
													<polygon points="13,6.99 16,6.99 12,3 8,6.99 11,6.99 11,17.01 8,17.01 12,21 16,17.01 13,17.01" />
												</svg>
											</div>
										</React.Fragment>
									)}
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}

const ComponentFieldEditor = function ({ inset, field = {}, onChange }) {
	const {
		__id,
		__data,
		optional,
		label,
		type,
		choices,
		defaultValue,
		offValue,
		min,
		max,
		value,
		meta = {},
	} = {
		...(field ? field : {}),
	};

	function handleToggle(newValue) {
		const fieldTypeIsText =
			!type || !type.length || type.toLowerCase() == "text";
		const derivedOffValue = offValue || fieldTypeIsText ? "" : null;

		handleChange(!newValue ? derivedOffValue : defaultValue || true);
	}

	const [tempValue, setTempValue] = React.useState(value);

	function handleChange(newValue) {
		if (min != undefined) {
			let minValue = min;
			if (typeof min == "function") minValue = min(__data);
			if (newValue < minValue) newValue = minValue;
		}
		if (max != undefined) {
			let maxValue = max;
			if (typeof max == "function") maxValue = max(__data);
			if (newValue > maxValue) newValue = maxValue;
		}

		onChange(__id, newValue);
	}

	const isCustomFieldType = [
		"boolean",
		"color",
		"gradient",
		"icon",
		"radio",
		"tag",
		"image",
		"logo",
	].includes(type);

	return (
		<div className="ComponentFieldEditor">
			{label && label.length && (
				<div
					className="mt-2 flex items-center justify-between"
					style={{ marginBottom: isCustomFieldType ? "0.1rem" : 0 }}
				>
					<label className={` ${inset && "text-md"}`}>
						{camelCaseToSentenceCase(label)}
					</label>

					{type == "boolean" && (
						<Toggle checked={value} onChange={handleChange} />
					)}
					{optional == true && (
						<Toggle checked={value} onChange={handleToggle} />
					)}
				</div>
			)}

			{(!optional || value) && (
				<React.Fragment>
					{type == "tag" && (
						<TagList
							value={value}
							choices={choices}
							onChange={handleChange}
							{...meta}
						/>
					)}

					{type == "radio" && (
						<ButtonGroup
							value={value}
							choices={choices}
							onChange={handleChange}
							{...meta}
						/>
					)}

					{type == "color" && (
						<ColorList
							colors={choices}
							selectedColor={value}
							onChange={handleChange}
							{...meta}
						/>
					)}

					{type == "gradient" && (
						<GradientList value={value} onChange={handleChange} />
					)}

					{type == "icon" && (
						<div
							className="-mx-12px p-2 mt-1 bg-white overflow-y-auto"
							style={{ maxHeight: "140px" }}
						>
							<IconList
								onChange={handleChange}
								iconNames={choices}
								{...meta}
							/>
						</div>
					)}

					{/* {type == "logo" && (
						<LogoEditorField {...meta} onChange={handleChange} />
					)} */}

					{/* {type == "image" && (
						<ImageEditorField key={meta} {...meta} />
					)} */}

					{!isCustomFieldType && (
						// <form
						// 	className="w-full"
						// 	onSubmit={(e) => {
						// 		e.preventDefault();
						// 		handleChange(
						// 			type == "number"
						// 				? Number(tempValue)
						// 				: tempValue
						// 		);
						// 	}}
						// >
						<input
							className="m-0 w-full"
							type={type}
							// value={tempValue}
							value={value}
							uxp-quiet="true"
							{...meta}
							// onChange={(e) => setTempValue(e.target.value)}
							onChange={(e) => handleChange(e.target.value)}
						/>
						// </form>
					)}
				</React.Fragment>
			)}
		</div>
	);
};

export default ComponentFieldEditor;
