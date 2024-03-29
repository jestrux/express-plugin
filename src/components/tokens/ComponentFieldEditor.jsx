import React from "react";
import { camelCaseToSentenceCase } from "../utils";
import ButtonGroup from "./ButtonGroup";
import ColorList from "./ColorList";
import GradientList from "./GradientPicker/GradientList";
import IconList from "./IconPicker/IconList";
import TagList from "./TagList";
import Toggle from "./Toggle";
import ImagePicker from "./ImagePicker";
import ColorSwatch from "./ColorSwatch";
import GridList from "./GridList";
import SliderInput from "./SliderInput";
import CardList from "./CardList";
import InfoCard from "./InfoCard";
import BackgroundPicker from "./BackgroundPicker";

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
		hint: hintProp,
		type,
		choices,
		defaultValue,
		offValue,
		min,
		max,
		value,
		inline,
		meta = {},
		wrapperProps = {},
	} = {
		...(field ? field : {}),
	};
	const { text: hint, type: hintType } = !hintProp
		? { text: null }
		: typeof hintProp == "object"
		? hintProp
		: { text: hintProp };

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
		"background",
		"swatch",
		"gradient",
		"icon",
		"radio",
		"tag",
		"card",
		"grid",
		"image",
		"logo",
		"range",
	].includes(type);

	let { className: wrapperClassName, ...otherWrapperProps } = wrapperProps;
	let { className, ...otherMeta } = meta;
	let initialValue = value;

	if (type == "date") {
		try {
			initialValue = new Intl.DateTimeFormat("en-UK")
				.format(value)
				.split("/")
				.reverse()
				.map((entry) => entry.padStart(2, "0"))
				.join("-");
		} catch (error) {}
	}

	return (
		<div
			className={`ComponentFieldEditor mt-2 ${wrapperClassName} ${
				inline && "flex items-center justify-between"
			}`}
			{...otherWrapperProps}
		>
			{hint && hint.length && (
				<div
					className="-mx-12px mb-2"
					style={{ marginTop: "-0.75rem" }}
				>
					<InfoCard infoIcon={hintType == "info"}>{hint}</InfoCard>
				</div>
			)}

			{label && label.length && (
				<div
					className="flex items-center justify-between"
					style={{
						marginBottom:
							isCustomFieldType &&
							!inline &&
							type != "boolean" &&
							(!optional || value)
								? "0.4rem"
								: 0,
					}}
				>
					<label
						className={`fieldEditorLabel ${inset && "inset"}`}
						style={{
							paddingTop: inline ? "2px" : "",
						}}
					>
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
					{type == "grid" && (
						<GridList
							value={value}
							choices={choices}
							onChange={handleChange}
							{...meta}
						/>
					)}

					{type == "card" && (
						<CardList
							value={value}
							choices={choices}
							onChange={handleChange}
							{...meta}
						/>
					)}

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

					{type == "background" && (
						<BackgroundPicker
							optional={optional}
							value={value}
							onChange={handleChange}
							{...meta}
						/>
					)}

					{type == "swatch" && (
						<div className="mt-1">
							<ColorSwatch
								value={value}
								onChange={handleChange}
								{...meta}
							/>
						</div>
					)}

					{type == "gradient" && (
						<GradientList
							value={value}
							onChange={handleChange}
							{...meta}
						/>
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

					{type == "image" && (
						<div className="mt-1">
							<ImagePicker onChange={handleChange} {...meta} />
						</div>
					)}

					{type == "range" && (
						<div style={{ margin: "-0.25rem 0" }}>
							<SliderInput
								label={label}
								value={value}
								onChange={handleChange}
								{...meta}
							/>
						</div>
					)}

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
							className={`m-0 w-full ${
								type == "range"
									? "mt-1"
									: "py-2 px-2 border border-dark-gray rounded-xs"
							} ${className}`}
							type={type}
							// value={tempValue}
							defaultValue={initialValue}
							uxp-quiet="true"
							{...otherMeta}
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
