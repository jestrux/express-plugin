import { useState } from "react";

export default function useDataSchema(defaultValue, mainCallback = () => {}) {
	const [data, setData] = useState(defaultValue || {});
	const updateField = (field, newValue, callback) => {
		const keyValueUpdate = typeof field == "string";
		callback = (keyValueUpdate ? callback : newValue) || mainCallback;

		const updatedProps = keyValueUpdate ? { [field]: newValue } : field;
		const newData = { ...data, ...updatedProps };

		handleSetData(newData, callback);
	};

	const handleSetData = (data, callback = mainCallback) => {
		setData(data);
		callback(data);
	};

	return [data, updateField, handleSetData];
}
