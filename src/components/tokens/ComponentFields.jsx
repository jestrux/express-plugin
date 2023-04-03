import React from "react";
import { camelCaseToSentenceCase } from "../utils";
import ComponentFieldEditor from "./ComponentFieldEditor";
import Toggle from "./Toggle";

function schemaToFields(schema, data) {
	const fields = [];

	Object.entries(schema).forEach(([label, props]) => {
		if (typeof props == "string") props = { type: props };

		props.__id = label;
		props.label = ["undefined", null].includes(typeof props.label)
			? label
			: props.label;

		// if(data) props.value = data;
		props.value = data ? data[label] : props.defaultValue;

		if (!props.group && !props.sectionedGroup) fields.push(props);
		else {
			const groupIndex = fields.findIndex((group) =>
				[props.group, props.sectionedGroup].includes(group.label)
			);

			if (groupIndex != -1) fields[groupIndex].children.push(props);
			else {
				const group = {
					type: "group",
					label: props.group || props.sectionedGroup,
					section: props.sectionedGroup,
					optional: props.optional == "group",
					children: [props],
				};

				fields.push(group);
			}
		}
	});

	return fields;
}

function ComponentFieldSection({
	field,
	data,
	isLast = false,
	rootLevel = false,
	onChange,
}) {
	function handleChange(key, newValue) {
		const updatedProps = typeof key == "string" ? { [key]: newValue } : key;

		onChange(field.__id, {
			...data,
			...updatedProps,
		});
	}

	function handleToggle(newValue) {
		const newProps = !newValue
			? null
			: schemaToFields(field.children, data).reduce((agg, child) => {
					return {
						...agg,
						[child.__id]: child.optional
							? child.offValue || false
							: child.defaultValue == undefined
							? true
							: child.defaultValue,
					};
			  }, {});

		onChange({
			...data,
			[field.__id]: newProps,
		});
	}

	const children = !data ? [] : schemaToFields(field.children, data);

	return (
		<div
			className={`SectionField -mx-12px ${
				data && (rootLevel || !isLast) && "border-b"
			}`}
		>
			<div className="relative">
				{data && (
					<div
						className="absolute inset-0"
						style={{
							background: "#E6E6E6",
							top: "-0.25rem",
							bottom: "-0.25rem",
						}}
					>
						<div className="bg-light-gray w-full h-full"></div>
					</div>
				)}

				<div className="relative flex items-center justify-between px-12px py-2">
					<label>{camelCaseToSentenceCase(field.label)}</label>

					{field.optional && (
						<Toggle checked={data} onChange={handleToggle} />
					)}
				</div>
			</div>

			<div className="mt-1 overflow-hidden">
				{data && (
					<div className={`${rootLevel ? "px-12px" : ""}`}>
						<div className={rootLevel ? "" : "px-12px"}>
							{children.map((field, index) => {
								if (
									typeof field.show == "function" &&
									!field.show(data)
								) {
									return null;
								}

								if (field.type == "section")
									return (
										<ComponentFieldSection
											key={index}
											isLast={
												index == children.length - 1
											}
											field={field}
											data={data[field.__id]}
											onChange={handleChange}
										/>
									);
								else if (field.type == "group")
									return (
										<ComponentFieldGroup
											key={index}
											field={field}
											data={data}
											onChange={handleChange}
										/>
									);

								return (
									<div className="mb-4" key={index}>
										<ComponentFieldEditor
											inset
											field={{ ...field, __data: data }}
											onChange={handleChange}
										/>
									</div>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

function ComponentFieldGroup({ field, data, onChange }) {
	function handleToggle(newValue) {
		const newProps = field.children.reduce((agg, child) => {
			const childTypeIsText =
				!child.type ||
				!child.type.length ||
				child.type.toLowerCase() == "text";
			const offValue = child.offValue || childTypeIsText ? "" : null;

			return {
				...agg,
				[child.__id]: !newValue
					? offValue
					: child.defaultValue == undefined
					? true
					: child.defaultValue,
			};
		}, {});
		onChange(newProps);
	}

	const checked = field.children.some((child) => child.value);
	let label = camelCaseToSentenceCase(field.label);
	if (field.section) label = label.toUpperCase();

	return (
		<div
			className={`${
				field.section
					? "mb-3s border-t sborder-b-2 -mx-12px px-12px pb-1"
					: "mb-2"
			}`}
		>
			<div className="mt-2 flex items-center justify-between">
				<label
					className={`${
						field.section
							? "text-sm tracking-widest text-blue"
							: "text-md"
					}`}
				>
					{label}
				</label>

				{field.optional && (
					<Toggle checked={checked} onChange={handleToggle} />
				)}
			</div>

			{checked &&
				field.children.map((child, index) => (
					<div className="mb-1" key={index}>
						<ComponentFieldEditor
							field={{ ...child, __data: data }}
							onChange={onChange}
						/>
					</div>
				))}
		</div>
	);
}

function ComponentFields({ schema, data, onChange }) {
	const fields = schemaToFields(schema, data);

	return (
		<div className="flex flex-col gap-4">
			{fields.map((field, index) => {
				if (typeof field.show == "function" && !field.show(data)) {
					return null;
				}

				if (field.type == "section")
					return (
						<ComponentFieldSection
							key={index}
							rootLevel
							field={field}
							data={data[field.__id]}
							onChange={onChange}
						/>
					);
				else if (field.type == "group")
					return (
						<ComponentFieldGroup
							key={index}
							field={field}
							data={data}
							onChange={onChange}
						/>
					);

				return (
					<div key={index} className="relative">
						<ComponentFieldEditor
							field={{ ...field, __data: data }}
							onChange={onChange}
						/>

						<div
							className="border-b absolute"
							style={{
								top: "auto",
								left: "-12px",
								right: "-12px",
								bottom: "-0.75rem",
								opacity: 0.5,
							}}
						></div>
					</div>
				);
			})}
		</div>
	);
}

export default ComponentFields;
