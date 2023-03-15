const CSS = require("./css");

async function errorDialog(title = "Error", message = "Unknwon error occured", callback) {
    try {
        const dialog = document.createElement("dialog");
        dialog.innerHTML = /*html*/`
            <style> 
                ${CSS}
                dialog{
                    padding: 0;
                }
            </style>

            <form method="dialog" style="width: 400px">
                <div class="py-2 mt-2 px-3 ml-3 flex items-center justify-between">
                    <h1 class="leading-none text-lg font-medium">
                        ${title}
                    </h1>

                    <div id="closeButton" class="cursor-pointer">
                        <svg height="20" viewBox="0 0 24 24"><path fill="#888" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>
                    </div>
                </div>

                <div class="px-3 text-md">
                    <div class="px-3 opacity-75">
                        ${message}
                    </div>
                </div>
                
                <div class="mt-3 py-1 px-3 bg-gray flex items-center justify-end">
                    <button class="cursor-pointer" uxp-variant="action">OKAY</button>
                </div>
            </form>
        `;

        dialog.querySelectorAll("#closeButton, button").forEach(button => {
            button.onclick = e => {
                e.preventDefault();
                dialog.close(null);
            }
        });

        document.body.appendChild(dialog);
        const res = await dialog.showModal();
        
        return res;
    } catch (error) {
        console.log("Error setting up color dialog", error);
        return {as: null};
    } finally {
        dialog.remove();
    }
}

export default errorDialog;