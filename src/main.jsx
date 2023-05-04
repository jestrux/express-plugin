import AddOnSdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import { Provider } from "@adobe/react-spectrum";
import { theme } from "@react-spectrum/theme-express";

import "./App.css";

const render = (sdk = true) => {
	if (sdk) {
		console.log("AddOnSdk is ready for use.");
		window.AddOnSdk = AddOnSdk;
	}

	ReactDOM.createRoot(document.getElementById("root")).render(
		<React.StrictMode>
			<Provider theme={theme} colorScheme="light">
				<div className="bg-white">
					<App />
				</div>
			</Provider>
		</React.StrictMode>
	);
};

render(false);

// AddOnSdk.ready.then(render);
