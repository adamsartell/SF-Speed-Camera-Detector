import { TiLocationArrowOutline } from "react-icons/ti";

export default function LocationIcon({
	handleRecenterClick,
}: {
	handleRecenterClick: () => void;
}) {
	return (
		<button
			onClick={handleRecenterClick}
			className="absolute bottom-[115px] right-[10px] z-50 p-[10px] bg-[#0f69f5]/70 backdrop-blur-xs text-white border-none rounded-full cursor-pointer shadow-md flex items-center justify-center w-[40px] h-[40px]"
			title="Recenter Map"
		>
			<TiLocationArrowOutline size={25} />
		</button>
	);
}
