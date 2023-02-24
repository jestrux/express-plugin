export const appendScript = (
	filepath = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"
) => {
	return new Promise((resolve, reject) => {
		if (document.querySelector('head script[src="' + filepath + '"]'))
			return resolve();

		const script = document.createElement("script");
		script.setAttribute("type", "text/javascript");
		script.setAttribute("src", filepath);
		document.querySelector("head").appendChild(script);

		script.onload = resolve();
	});
};

{
	/* <canvas
	style="
		position: fixed;
		top: 145px;
		left: 400px;
		width: 415px;
		aspect-ratio: 1 / 1.545;
		z-index: 999999;
	"
></canvas>

const confettiGun = confetti.create(confettiCanvas, { resize: true, } ) */
}

// $0.removeAttribute("selected")

// $0.querySelectorAll(".folder-wrapper").forEach(node => node.style.display = "none")

// <theo-light-button type="action" icon-name="center" selected="" alt="Align center" tooltip="true" tooltipalignment="top-center"></theo-light-button>
