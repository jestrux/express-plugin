import grad from "./grad.png";
const Graduation = () => {
	return (
		<div class="w-[400px] aspect-[1/1.6] relative bg-blue-600 text-white flex flex-col items-center justify-around">
			<img
				class="backdrop-blur-[3px] w-full h-full object-cover"
				src={grad}
				alt=""
			/>
		</div>
	);
};

export default Graduation;
