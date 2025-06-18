export default function SpeedLimitIcon({
	posted_speed,
}: {
	posted_speed: number;
}) {
	return (
		<div className="bg-white h-fit flex flex-col gap-1 p-2 rounded-md border-2 border-[#333]">
			<div className="font-bold text-center uppercase leading-tight">
				<div>Speed</div>
				<div>Limit</div>
			</div>
			<div className="text-center font-bold text-4xl leading-8">
				{posted_speed && posted_speed}
			</div>
		</div>
	);
}
