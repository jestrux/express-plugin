const ScreenshotSVG = (screenshot) => {
	return /*html*/ `
		<svg
			class="w-full"
			viewBox="0 0 256 512"
		>
			<defs>
				<clipPath id="myMask">
					<rect
						x="2"
						y="2"
						width="255"
						height="512"
						rx="60"
						ry="60"
					/>
				</clipPath>
			</defs>

			<image
				x="5"
				y="5"
				width="246"
				height="496"
				xlink:href="${screenshot}"
				style="clip-path: url(#myMask)"
			></image>

			<image
				width="256"
				height="512"
				xlink:href="iphone14.png"
			></image>
		</svg>
	`;
};

const ScreenshotDiv = (screenshot) => {
	return /*html*/ `
		<div class="w-full relative flex justify-center border-8 border-black rounded-[30px]">
			<span
				id="notch"
				class="absolute border border-black bg-black w-20 h-6 mt-1.5 rounded-full"
			></span>

			<span
				id="rightBtn"
				class="absolute -right-2.5 top-20 border-2 border-black h-10 rounded-md"
			></span>

			<div class="h-full w-full rounded-[21px] overflow-hidden">
				<img
					src="${screenshot}"
					alt=""
				/>
			</div>

			<span
				id="leftBtn"
				class="absolute -left-2.5 top-16 border-2 border-black h-6 rounded-md"
			></span>
			<span
				id="leftBtn"
				class="absolute -left-2.5 top-32 border-2 border-black h-12 rounded-md"
			></span>
			<span
				id="leftBtn"
				class="absolute -left-2.5 top-48 border-2 border-black h-12 rounded-md"
			></span>
		</div>
	`;
};

function AppScreenshot(values) {
	this.values = values;
	this.render = () => AppScreenshot.doRender(this.values, this.images);
}

AppScreenshot.meta = { aspectRatio: "portrait" };

AppScreenshot.label = "App Screenshot";

AppScreenshot.props = {
	text: {
		type: "text",
		defaultValue: "Discover your very own unique voice",
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

AppScreenshot.doRender = function (options, images) {
	return /*html*/ `
        <div class="aspect-[1/2] bg-gradient-to-br from-blue-600 to-green-900 text-white flex flex-col items-center justify-around">
			<div class="mx-6 my-8 font-bold text-2xl text-center">
				${options.text}
			</div>
			<div class="w-full px-4 -mb-9">
				${ScreenshotSVG(options.screenshot)}
			</div>
		</div>
    `;
};

export default AppScreenshot;
