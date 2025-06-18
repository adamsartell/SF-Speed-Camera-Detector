export default function Button({
	onClick,
	text,
}: {
	onClick: () => void;
	text: string;
}) {
	return (
		<div
			onClick={onClick}
			className="rounded-lg hover:cursor-pointer shadow-xs py-2 px-4 bg-[#f5f5f7]/10 hover:bg-[#f5f5f7]/80 backdrop-blur-xs border font-medium border-[#d6d6d6] transition-colors duration-150"
		>
			{text}
		</div>
	);
}
