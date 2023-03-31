import { useState } from "react";

export default function useDataSchema(defaultValue, mainCallback = () => {}) {
	const [data, setData] = useState(defaultValue || {});
	const updateField = (field, newValue, callback) => {
		const keyValueUpdate = typeof field == "string";
		callback = (keyValueUpdate ? callback : newValue) || mainCallback;

		const updatedProps = keyValueUpdate ? { [field]: newValue } : field;
		const newData = { ...data, ...updatedProps };
		setData(newData);

		callback(newData);
	};

	return [data, updateField];
}
