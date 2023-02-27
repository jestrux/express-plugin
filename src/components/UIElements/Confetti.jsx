import { useLayoutEffect, useRef } from "preact/hooks";
import { appendScript } from "../../utils";
function Confetti(values) {
	this.values = values;
	// this.render = () => Confetti.doRender(this.values, this.images);
}

Confetti.meta = {
	// aspectRatio: "portrait",
	autosize: true,
	onPlay: (options) => {
		if (!window.confettiCanvas) return console.log("No confetti canvas");

		window.confettiCanvas.playing = !window.confettiCanvas.playing;

		if (!window.confettiCanvas.playing) {
			window.confettiCanvas.handler.reset();
			return;
		}

		// setTimeout(() => {
		// 	const canvas = document.querySelector("canvas");
		// 	const dataURL = canvas.toDataURL();
		// 	navigator.clipboard.writeText(dataURL);
		// 	console.log(dataURL);
		// }, 200);

		const props = {
			spread: 120,
			startVelocity: 35,
			gravity: 0.7,
			particleCount: 200,
			origin: { y: 1.1 },
			colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
			// decay: 0.92,
			// scalar: 1.2,
			// spread: 100,
		};

		const confettiGun = window.confettiCanvas.handler;

		(async function frame() {
			await Promise.all([
				// await confettiGun(props),
				await confettiGun({
					...props,
					// particleCount: 7,
					angle: 60,
					// spread: 55,
					origin: { x: 0, y: 1.1 },
				}),
				await confettiGun({
					...props,
					// particleCount: 60,
					angle: 120,
					// spread: 55,
					origin: { x: 1, y: 1.1 },
				}),
				confettiGun(props),
				// confettiGun({
				// 	...props,
				// 	particleCount: 100,
				// 	angle: 60,
				// 	// spread: 55,
				// 	origin: { x: 0, y: 1.1 },
				// }),
				// confettiGun({
				// 	...props,
				// 	particleCount: 100,
				// 	angle: 120,
				// 	// spread: 55,
				// 	origin: { x: 1, y: 1.1 },
				// }),
			]);

			if (window.confettiCanvas.playing) requestAnimationFrame(frame);
			else cancelAnimationFrame(frame);
		})();
	},
};

Confetti.label = "Confetti";

Confetti.props = {
	text: {
		type: "text",
		defaultValue: "Because you deserve this wonderful moment",
	},
	background: {
		type: "image",
		defaultValue:
			"https://images.unsplash.com/photo-1593697821094-53ed19153f21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjE2NXwwfDF8c2VhcmNofDMyfHxwb2RjYXN0fGVufDB8fHx8MTY3NzEzNjcyNQ&ixlib=rb-4.0.3&q=80&w=600",
	},
	screenshot: {
		type: "image",
		// defaultValue:
		// 	"https://assets.uigarage.net/content/uploads/2019/07/signup_android_airbnb_uigarage-.png",
		defaultValue: "app.png",
	},
};

Confetti.render = ({ id, options }) => {
	const canvas = useRef();

	useLayoutEffect(() => {
		loadScript();
	}, [id]);

	const loadScript = async () => {
		await appendScript(
			"https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"
		);
		// console.log("Script loaded");

		setTimeout(() => {
			window.confettiCanvas = window.confettiCanvas || {};
			if (!window.confettiCanvas.handler) {
				window.confettiCanvas.handler = window.confetti.create(
					canvas.current,
					{
						resize: true,
					}
				);
			}
		}, 50);
	};

	return <canvas ref={canvas} class="w-full h-full"></canvas>;
};

Confetti.thumb = function () {
	return ` 
		<img class="" src="logos/confetti.png" />
    `;
};

export default Confetti;
