const { getMapImageByCoordinates, openWebsite, saveCustomTheme } = require("..");
const CSS = require("./css");

async function themeDialog(callback) {
    try {
        const dialog = document.createElement("dialog");
        dialog.innerHTML = /*html*/`
            <style> 
                ${CSS}
                strong{
                    font-weight: bold;
                }
                dialog{
                    padding: 0;
                }

                #themePreviewWrapper,
                #themePreviewWrapper:not([mode="preview"]) #themePreview,
                #themePreviewWrapper:not([mode="loading"]) #themeLoader,
                #themePreviewWrapper:not([mode="error"]) #themeError{
                    display: none;
                }

                #themePreviewWrapper[mode="preview"],
                #themePreviewWrapper[mode="loading"],
                #themePreviewWrapper[mode="error"]{
                    display: block;
                }
            </style>

            <div class="relative" style="width: 400px">
                <div class="py-2 mt-2 px-3 ml-3 flex items-center justify-between">
                    <h1 class="leading-none text-lg font-medium">
                        Add Custom Theme
                    </h1>

                    <div id="closeButton" class="cursor-pointer">
                        <svg height="20" viewBox="0 0 24 24"><path fill="#888" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>
                    </div>
                </div>

                <div class="mx-3 px-3 pb-3 text-md">
                    <label class="mb-1 text-black opacity-75">How to create a custom theme</label>

                    <ol class="p-0 m-0 text-sm">
                        <li class="mb-1">
                            <strong>1.</strong> Go to <strong id="mapboxLink" class="text-blue cursor-pointer">Mapbox Studio</strong>
                            and select the style you want to use. 
                        </li>
                        <li class="mb-1">
                            <strong>2.</strong> Add a new style or select an existing style.
                        </li>
                        <li class="mb-1">
                        <strong>3.</strong> Click the <strong>Share</strong> button on the top menu.
                        </li>
                        <li class="mb-1">
                            <strong>4.</strong>
                            On the dialog that appears, look for Developer resources and copy the <strong>Style Url</strong>.
                        </li>
                    </ol>

                    <form id="styleUrlForm" class="mt-3">
                        <label class="text-md block text-black opacity-75">Mapbox Theme Style Url</label>
                        <div class="py-1 rounded-sm bg-light-gray border flex items-center relative">
                            <div class="flex-1 ml-2">
                                <input id="styleUrlInput" name="url" class="w-full" type="text" uxp-quiet="true" placeholder="Paste your style asset url here" />
                            </div>

                            <button type="submit" id="pasteThemeButton" class="mx-1 flex-shrink-0" uxp-variant="action">Continue</button>
                        </div>
                    </form>

                    <div id="themePreviewWrapper" class="mt-3">
                        <label class="text-md block text-black opacity-75">Theme Name & Preview</label>

                        <div id="themePreview" class="mt-1 rounded-sm border p-2 flex items-center">
                            <div class="flex-shrink-0 bg-gray border rounded-sm overflow-hidden">
                                <img style="width: 60px; height: 60px" src="" alt="" />
                            </div>

                            <div class="ml-2 flex-1 mb-1">
                                <label class="text-md opacity-75">Name this theme</label>
                                <input id="themeNameInput" uxp-quiet="true" type="text" class="w-full" placeholder="E.g. Autumn Sky or Valyrian Steel" />
                            </div>
                        </div>

                        <div id="themeLoader" class="mt-1 rounded-sm border p-2 flex items-center">
                            <img style="margin: -6px; height: 40px" src="images/spinner.gif" alt="" />
                            <span class="ml-3 text-md opacity-65">Fetching theme...</span>
                        </div>

                        <div id="themeError" class="mt-1 rounded-sm border py-2 px-3">
                            <div class="flex items-center">
                                <svg width="18px" viewBox="0 0 24 24"><path fill="none" stroke="#C00" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                <span class="ml-2 font-normal opacity-75 text-md">Uh oh! We couldn't find that theme</span>
                            </div>
                            <div class="text-sm px-1">
                                <p class="mx-0 my-0 py-0">
                                    <strong>1.</strong> Make sure you havea working internet connection.
                                </p>

                                <p class="mx-0 my-0 py-0">
                                    <strong>2.</strong> The theme belongs to the same account you use for Fancy Maps or it is publicly available.
                                </p>

                                <p class="mx-0 my-0 py-0">
                                    <strong>3.</strong> Make sure the url you copied has a format similar to:
                                </p>

                                <strong style="color: #888">mapbox://styles/fancymaps/ckpyx036g2hye17lmnyr9k6tp</strong>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-1 py-1 px-3 bg-gray flex items-center justify-end">
                    <button id="saveThemeButton" uxp-variant="cta" disabled>Save Theme</button>
                </div>

                <div id="savingThemeLoader" class="hidden absolute inset-0 z-20 bg-black70 text-white flex flex-col center-center">
                    <img width="80px" src="images/spinner.gif" />

                    <button uxp-variant="action" class="cursor-pointer mt-4 bg-transparent py-2 px-3">
                        CANCEL
                    </button>
                </div>
            </div>
        `;

        dialog.querySelector("#mapboxLink").onclick = e => {
            e.preventDefault();
            openWebsite("https://studio.mapbox.com/");
        };

        dialog.querySelector("#closeButton").onclick = e => {
            e.preventDefault();
            dialog.close(null);
        };

        const saveThemeButton = dialog.querySelector("#saveThemeButton");
        const img = dialog.querySelector("img");
        const styleUrlInput = dialog.querySelector("#styleUrlInput");
        const themePreviewWrapper = dialog.querySelector("#themePreviewWrapper");
        const themeNameInput = dialog.querySelector("#themeNameInput");
        const savingThemeLoader = dialog.querySelector("#savingThemeLoader");

        saveThemeButton.onclick = async e => {
            e.preventDefault();
            // dialog.close(null);
            savingThemeLoader.classList.remove("hidden");
            try {
                const savedTheme = await saveCustomTheme(styleUrlInput.value.trim(), themeNameInput.value.trim());
                savingThemeLoader.classList.add("hidden");
                console.log("Saved theme: ", savedTheme);
                dialog.close(savedTheme);
            } catch (error) {
                savingThemeLoader.classList.add("hidden");
                console.log("Save theme error: ", error);
            }
        };

        savingThemeLoader.querySelector("button").onclick = e => {
            e.preventDefault();
            savingThemeLoader.classList.add("hidden");
        };

        dialog.querySelector("#styleUrlForm").onsubmit = async e => {
            e.preventDefault();
            const styleUrl = styleUrlInput.value.trim();
            themePreviewWrapper.setAttribute("mode", "loading");
            img.src = "";
            saveThemeButton.setAttribute("disabled", "disabled");

            const themePreviewUrl = await getMapImageByCoordinates({theme: styleUrl, zoomLevel: 9});
            // const themePreviewUrl = await getMapImageByCoordinates({theme: "mapbox/streets-v11", zoomLevel: 9});
            try {
                console.log("Theme preview: ", themePreviewUrl);
                const res = await fetch(themePreviewUrl);
                if(res.ok){
                    const themePreview = await res.text();
                    console.log("Theme preview: ", themePreview);
                    themePreviewWrapper.setAttribute("mode", "preview");
                    img.src = themePreviewUrl;
                    saveThemeButton.removeAttribute("disabled");
                }
                else
                    throw(res.statusText);
            } catch (error) {
                if(error.toString().indexOf("Failed to decode") != -1){
                    themePreviewWrapper.setAttribute("mode", "preview");
                    img.src = themePreviewUrl;
                    saveThemeButton.removeAttribute("disabled");
                }
                else{
                    console.log("Error getting form data: ", error);
                    themePreviewWrapper.setAttribute("mode", "error");
                }
            }
        };

        document.body.appendChild(dialog);
        const res = await dialog.showModal();

        if((res && res != "reasonCanceled"))
            callback(res);
        
        return res;
    } catch (error) {
        console.log("Error setting up color dialog", error);
        return {as: null};
    } finally {
        dialog.remove();
    }
}

export default themeDialog;