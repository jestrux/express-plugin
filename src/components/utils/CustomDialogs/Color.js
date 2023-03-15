const CSS = require("./css");

async function colorDialog(callback) {
    try {
        const dialog = document.createElement("dialog");
        dialog.innerHTML = /*html*/`
            <style> 
                ${CSS}
                dialog{
                    padding: 0;
                }
            </style>

            <form method="dialog" style="width: 302px">
                <div class="mt-3 px-3 ml-2 flex items-center justify-between">
                    <h1 class="text-lg font-semibold">
                        Custom Color
                    </h1>

                    <div id="closeButton" class="cursor-pointer">
                        <svg height="20" viewBox="0 0 24 24"><path fill="#888" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>
                    </div>
                </div>

                <div class="px-2 mb-3 pb-1">
                    <div action="#" class="px-3 mt-2">
                        <label class="text-md block">Enter A Color</label>
                        <input type="text" class="w-full" placeholder="E.g. #FFE98A or blanchedAlmond" />
                    </div>
                </div>

                <div id="assetColorsWrapper" class="hidden">
                    <div class="px-2">
                        <label class="text-md mb-1 mx-3">Pick Asset Color</label>
                    </div>

                    <div class="px-2 bg-gray">
                        <div id="assetColors" class="px-2 pb-3 flex flex-wrap">
    
                        </div>
                    </div>
                </div>
            </form>
        `;

        const { Color } = require("scenegraph");
        const assets = require("assets");
        let assetColors = assets.colors.get().filter(({color}) => color instanceof Color).map(({color}) => color.toHex());
        assetColors = [...new Set(assetColors)];

        const assetColorsWrapper = dialog.querySelector("#assetColorsWrapper");
        const assetColorList = dialog.querySelector("#assetColors");
        if(assetColors.length)
            assetColorsWrapper.classList.remove("hidden");
            
        assetColorList.innerHTML = "";
        assetColors.forEach(color => {
            const colorItem = document.createElement("div");
            colorItem.className = "cursor-pointer rounded-full mx-1 mt-2";
            colorItem.style.cssText = `width: 22px; height: 22px; background: ${color}`;
            
            colorItem.onclick = e => dialog.close(color);

            assetColorList.appendChild(colorItem);
        });

        const closeButton = dialog.querySelector("#closeButton");
        closeButton.onclick = e => {
            e.preventDefault();
            dialog.close(null);
        }

        const colorInput = dialog.querySelector("input");

        document.body.appendChild(dialog);
        const res = await dialog.showModal();

        if((res && res != "reasonCanceled") || colorInput.value.length)
            callback(res ? res : colorInput.value);
        
        return res;
    } catch (error) {
        console.log("Error setting up color dialog", error);
        return {as: null};
    } finally {
        dialog.remove();
    }
}

export default colorDialog;