import AddOnSdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import { Provider } from "@adobe/react-spectrum";
import { theme } from "@react-spectrum/theme-express";
import { ToastContainer } from "@react-spectrum/toast";

import "./App.css";
import { loadImageFromUrl, showPreview } from "./components/utils";

const render = (sdk = true) => {
	if (sdk) {
		console.log("AddOnSdk is ready for use.");
		window.AddOnSdk = AddOnSdk;
	} else {
		window.AddOnSdk = {
			app: {
				enableDragToDocument: (el, props = {}) => {
					if (!el) console.log("No element found");

					if (props.previewCallback) props.previewCallback(el);
					if (props.completionCallback) props.completionCallback(el);

					return;
				},
				document: {
					async addImage(blob) {
						fetch(URL.createObjectURL(blob))
							.then((response) => response.blob())
							.then((blob) => {
								var reader = new FileReader();

								reader.onload = () =>
									showPreview(reader.result);

								reader.readAsDataURL(blob);
							});
					},
				},
			},
		};
	}

	ReactDOM.createRoot(document.getElementById("root")).render(
		<React.StrictMode>
			<Provider theme={theme} colorScheme="light">
				<div className="bg-white">
					<App />

					<ToastContainer />
				</div>
			</Provider>
		</React.StrictMode>
	);
};

render(false);

// AddOnSdk.ready.then(render);
