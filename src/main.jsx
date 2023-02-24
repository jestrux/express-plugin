import { render } from "preact";
import "./index.css";

import Confetti from "./components/UIElements/Confetti";
import { useEffect, useState } from "preact/hooks";

const Component = Confetti.render;

const Confetiffects = {
	"Center Flowers": async (props) =>
		confettiGun({
			...props,
			origin: { y: 1.1 },
		}),
	"Left Flowers": async (props) =>
		confettiGun({
			...props,
			angle: 60,
			origin: { x: 0, y: 1.1 },
		}),
	"Right Flowers": async (props) =>
		confettiGun({
			...props,
			angle: 120,
			origin: { x: 1, y: 1.1 },
		}),
	"Left Flowers Then Right Flowers": async (props) => {
		Confetiffects["Left Flowers"]({ ...props });
		setTimeout(() => {
			Confetiffects["Right Flowers"]({ ...props });
		}, 580);
	},
	"Left And Right Flowers": async (props) => {
		Confetiffects["Left Flowers"]({ ...props, particleCount: 80 });
		Confetiffects["Right Flowers"]({ ...props, particleCount: 80 });
	},
	Snow: snow,
	Fireworks: fireworks,
	"Star Bust": starBust,
};

function randomInRange(min, max) {
	return Math.random() * (max - min) + min;
}

function snow() {
	var duration = 2 * 1000;
	var animationEnd = Date.now() + duration;
	var skew = 1;

	window.confettiLoop = () => {
		var timeLeft = animationEnd - Date.now();
		var ticks = Math.max(500, 500 * (timeLeft / duration));
		skew = Math.max(0.8, skew - 0.001);

		window.confettiGun({
			// ...window.confettiProps,
			particleCount: 1,
			startVelocity: 0,
			ticks: ticks,
			origin: {
				x: Math.random(),
				// since particles fall down, skew start toward the top
				y: Math.random() * skew - 0.2,
			},
			colors: ["#ffffff"],
			shapes: ["circle"],
			gravity: randomInRange(0.4, 0.6),
			scalar: randomInRange(0.4, 1),
			drift: randomInRange(-0.4, 0.4),
		});

		if (timeLeft > 0) requestAnimationFrame(confettiLoop);
	};

	confettiLoop();
}

function starBust() {
	var defaults = {
		spread: 360,
		ticks: 50,
		gravity: 0,
		decay: 0.94,
		startVelocity: 30,
		shapes: ["star"],
		colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
	};

	function shoot() {
		window.confettiGun({
			...defaults,
			particleCount: 40,
			scalar: 1.2,
			shapes: ["star"],
			// shapes: window.confettiProps.shapes,
			colors: window.confettiProps.colors,
		});

		window.confettiGun({
			...defaults,
			particleCount: 10,
			scalar: 0.75,
			shapes: ["circle"],
			// shapes: window.confettiProps.shapes,
			colors: window.confettiProps.colors,
		});
	}

	setTimeout(shoot, 0);
	setTimeout(shoot, 100);
	setTimeout(shoot, 200);
}

function fireworks() {
	var duration = 5 * 1000;
	var animationEnd = Date.now() + duration;
	var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

	window.confettiLoop = setInterval(function () {
		var timeLeft = animationEnd - Date.now();

		if (timeLeft <= 0) return clearInterval(window.confettiLoop);

		var particleCount = 50 * (timeLeft / duration);
		// since particles fall down, start a bit higher than random
		window.confettiGun(
			Object.assign({}, defaults, {
				particleCount,
				origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
			})
		);
		window.confettiGun(
			Object.assign({}, defaults, {
				particleCount,
				origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
			})
		);
	}, 250);
}

const Shapes = {
	ribbons: ["circle", "square"],
	circle: ["circle"],
	square: ["square"],
	star: ["star"],
};

const Colors = {
	confetti: [
		"#26ccff",
		"#a25afd",
		"#ff5e7e",
		"#88ff5a",
		"#fcff42",
		"#ffa62d",
		"#ff36ff",
	],
	gold: ["#FFE400", "#FFBD00", "#E89400", "#FFCA6C", "#FDFFB8"],
	christmas: ["#C30F16", "#FFFFFF"],
	olympics: ["#0081C8", "#FCB131", "#00A651", "#EE334E"],
	// snow: ["#FFFAFA"],
};

window.confettiProps = {
	spread: 120,
	startVelocity: 35,
	gravity: 1,
	particleCount: 150,
	origin: { y: 1.1 },
	color: "confetti",
	shape: "ribbons",
	// decay: 0.92,
	// scalar: 1.2,
	// spread: 100,
};

const makePlayer = (options) => {
	window.confettiProps = {
		...confettiProps,
		...(options.props || {}),
	};

	const effect = options.effect || "Center Flowers";
	const colors = Colors[window.confettiProps.color || "confetti"];
	const shapes = Shapes[window.confettiProps.shape || "ribbons"];

	window.confettiProps = {
		...window.confettiProps,
		colors,
		shapes,
	};

	window.confettiGun = window.confettiCanvas.handler;

	return () => Confetiffects[effect](window.confettiProps);
};

const App = () => {
	const [options, setOptions] = useState({
		color: "confetti",
		shape: "ribbons",
	});
	const [effect, setEffect] = useState("Center Flowers");
	useEffect(() => {
		// if (effect) setTimeout(() => {}, 200);
		// if (effect) setupConfetti();
	}, []);

	const handleSetEffect = (newEffect) => {
		setEffect(newEffect);

		replayAnimation({
			props: options,
			effect: newEffect,
		});
	};

	const handleSetOptions = (newOptions) => {
		newOptions = { ...options, ...newOptions };
		setOptions(newOptions);
		replayAnimation({ props: newOptions, effect });
	};

	const replayAnimation = (props) => {
		try {
			window.confettiGun.reset();
			cancelAnimationFrame(window.confettiLoop);
			clearInterval(window.confettiLoop);
		} catch (error) {
			console.log("Error: ", error);
		}

		window.confettiPlayer = makePlayer(props);

		window.confettiPlayer();
	};

	return (
		<div class="bg-neutral-200/40 h-screen grid place-content-center pb-36">
			<div class="rounded-xl shadow-2xl  overflow-hidden">
				<Component id="12" options={options} />
			</div>

			<div class="fixed bottom-0 w-full bg-white grid grid-cols-6 gap-2">
				<div class="p-3 border-r col-span-2">
					Effects:
					<div className="grid grid-cols-6 gap-1 text-xs">
						{Object.keys(Confetiffects).map((eff, index) => (
							<button
								class={`py-1 px-2 rounded border ${
									index > 2 ? "col-span-3" : "col-span-2"
								}
									${effect == eff && "bg-blue-500 text-white"}
								`}
								onClick={() => handleSetEffect(eff)}
							>
								{eff}
							</button>
						))}
					</div>
				</div>

				<div class="p-3 border-r col-span-2">
					Colors:
					<div className="grid grid-cols-2 gap-1 text-xs">
						{Object.keys(Colors).map((color) => (
							<button
								class={`py-1 px-2 rounded border
								${options?.color == color && "bg-blue-500 text-white"}
								`}
								onClick={() => handleSetOptions({ color })}
							>
								{color}
							</button>
						))}
					</div>
				</div>

				<div class="p-3 border-r col-span-2">
					Shapes:
					<div className="grid grid-cols-2 gap-1 text-xs">
						{Object.keys(Shapes).map((shape) => (
							<button
								class={`py-1 px-2 rounded border
							${options?.shape == shape && "bg-blue-500 text-white"}
							`}
								onClick={() => handleSetOptions({ shape })}
							>
								{shape}
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

render(<App />, document.querySelector("#app"));
