import AddOnSdk from "https://preview.projectx.corp.adobe.com/static/add-on-sdk/sdk.js";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

AddOnSdk.ready.then(() => {
    console.log("AddOnSdk is ready for use.");
    window.AddOnSdk = AddOnSdk;

    const root = createRoot(document.getElementById("root"));
    root.render(<App addOnSdk={AddOnSdk} />);
});
