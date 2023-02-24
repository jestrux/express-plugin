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
			colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8'],
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

	return (
		<div class="relative">
			<div class="w-[400px] aspect-[1/1.6] relative bg-blue-600 text-white flex flex-col items-center justify-around">
				{/* <img
					class="w-full h-full object-cover absolute top-0 left-0"
					src="https://images.unsplash.com/photo-1625061770820-514e6228f4ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjE2NXwwfDF8c2VhcmNofDEwfHxncmFkdWF0aW9ufGVufDB8fHx8MTY3NzE5NzkxNQ&ixlib=rb-4.0.3&q=80&w=1080"
					alt=""
				/> */}

				<img
					class="backdrop-blur-[3px] w-full h-full object-cover"
					src="grad.png"
					alt=""
				/>

				{/* <div class="absolute mx-6 top-8 font-semibold text-2xl text-center">
					<span style="color: rgb(236 161 50); border-radius: 3px; background-color: currentColor; font-size: 18px; line-height : 42px; padding: 8px; padding-left:0px; box-shadow: -8px 0 0 currentColor; -webkit-box-decoration-break: clone;">
						<span class="text-white">{options.text}</span>
					</span>
				</div> */}
			</div>

			<div class="absolute inset-0 z-10 pointer-events-none">
				<canvas ref={canvas} class="w-full h-full"></canvas>
			</div>
		</div>
	);
};

Confetti.preview = function () {
	return `    
        <img class="h-20 w-full object-cover" src="confetti.png" />
    `;
};

export default Confetti;
