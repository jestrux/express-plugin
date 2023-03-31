import { useEffect, useRef } from "react";

const useKeyDetector = ({
	element = document,
	key,
	global = true,
	delayBy = 0,
	action,
}) => {
	const listenerSet = useRef();

	useEffect(() => {
		if (element == null) return;

		if (!listenerSet.current) listenerSet.current = true;
		else return;

		let delayTimeout, clearListeners;

		const setupListeners = () => {
			element.addEventListener("keyup", onKeyUp, false);
			element.addEventListener("keydown", onKeyDown, false);

			return () => {
				element.removeEventListener("keydown", onKeyDown, false);
				element.removeEventListener("keyup", onKeyUp, false);
			};
		};

		if (delayBy) {
			delayTimeout = setTimeout(() => {
				clearListeners = setupListeners();
			}, delayBy);
		} else clearListeners = setupListeners();

		return () => {
			clearTimeout(delayTimeout);
			if (clearListeners) clearListeners();
		};
	}, [element]);

	function onKeyUp(e) {
		// if (global && e.target.nodeName !== "BODY") return;
		if (key == e.key) action(e, element);
	}

	function onKeyDown(e) {
		// if (global && e.target.nodeName !== "BODY") return;

		const validKey = key
			.replace("Shift", "")
			.replace("Ctrl", "")
			.replace("Cmd", "")
			.replace("+", "")
			.trim();

		if (["Meta", "Shift", "Control"].includes(e.key)) return;

		if (
			(key.includes("Shift") && e.shiftKey) ||
			(key.includes("Cmd") && (e.metaKey || e.ctrlKey)) ||
			(key.includes("Ctrl") && e.ctrlKey)
		) {
			if (validKey != e.key && validKey != e.code) return;

			action(e, element);
		}
	}

	return null;
};

export default useKeyDetector;
