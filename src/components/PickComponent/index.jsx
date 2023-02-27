import { useContext } from "preact/hooks";
import ArticulateConfig from "../../ArticulateConfig";

export default function PickComponent({
	selectedElement,
	opened = false,
	onClose,
	onComponentPicked,
}) {
	const {
		uiElements,
		overlayComponentPicker,
		centerComponentPicker,
		blurComponentPicker,
	} = useContext(ArticulateConfig);

	if (!uiElements) {
		console.error("Please add some ui elements.");
		return null;
	}

	let placementClasses = `h-full ${
		overlayComponentPicker && "w-1/3 max-w-[320px]"
	} ${!opened && " -translate-x-full opacity-0"}`;
	if (centerComponentPicker)
		placementClasses = `w-full max-w-5xl m-auto rounded-md ${
			!opened && " -translate-y-1/4 opacity-0"
		}`;

	return (
		<div
			class={
				overlayComponentPicker
					? `fixed flex inset-0 z-50 ${
							!opened && "pointer-events-none"
					  }`
					: "h-screen w-[320px]"
			}
		>
			{overlayComponentPicker && (
				<div
					class={`bg-black bg-opacity-25 fixed inset-0 transition ${
						!opened && "opacity-0"
					}`}
					onClick={onClose}
				></div>
			)}

			<div
				class={`flex flex-col relative z-10 bg-white overflow-hidden transition transform ${placementClasses}`}
				style={`${centerComponentPicker && "max-height:85%"}; ${
					blurComponentPicker
						? "background-color: rgba(255, 255, 255, 0.6); backdrop-filter: blur(20px);"
						: ""
				}`}
			>
				<div class="px-4 py-4 border-bs flex items-center justify-between">
					<h3 class="ml-0.5 text-lg font-medium">Plugins</h3>

					<button
						class="focus:outline-none w-7 h-7 rounded-full p-0 flex items-center justify-center hover:bg-neutral-200/90"
						onClick={onClose}
					>
						<svg
							class="w-5 h-5 opacity-60"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							></path>
						</svg>
					</button>
				</div>

				<div class="flex-1 overflow-y-auto">
					<div className="px-4 mb-2">
						<input
							class="py-2 px-3 w-full rounded shadow border"
							type="text"
							placeholder="Type to search your plugins"
						/>
					</div>

					<div
						class={`${
							centerComponentPicker
								? "grid grid-cols-3 gap-x-6"
								: "flex flex-col border-b border-neutral-200/60 divide-y divide-neutral-200/60"
						}`}
					>
						{Object.values(uiElements).map((el) => (
							<button
								class={`block w-full text-sm text-left focus:outline-none ${
									centerComponentPicker &&
									"flex flex-col items-center"
								}
									${selectedElement?.component == el.label && "bg-neutral-100"}
								`}
								onClick={() => onComponentPicked(el)}
							>
								<div
									class={`py-2 px-4 flex items-center gap-3 ${
										centerComponentPicker && "w-full"
									}`}
								>
									<div class="w-7 h-7 rounded-sm overflow-hidden bg-neutral-100">
										{el.thumb && (
											<div
												dangerouslySetInnerHTML={{
													__html: el.thumb(),
												}}
											></div>
										)}
									</div>

									{el.preview && (
										<div
											dangerouslySetInnerHTML={{
												__html: el.preview(),
											}}
										></div>
									)}

									<span class="py-2 block font-medium">
										{el.label}
									</span>
								</div>
								{centerComponentPicker && (
									<span class="flex-1"></span>
								)}

								{el.preview && (
									<span class="mt-1 block text-center font-medium">
										{el.label}
									</span>
								)}
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
