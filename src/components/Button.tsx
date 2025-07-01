export default function Button({
	onClick,
	ariaLabel,
	text,
}: {
	onClick: () => void;
	ariaLabel: string;
	text: string;
}) {
	return (
		<div
			onClick={onClick}
			aria-label={ariaLabel}
			tabIndex={0}
			className="rounded-lg hover:cursor-pointer shadow-xs py-2 px-4 bg-[#f5f5f7]/10 hover:bg-[#f5f5f7]/80 backdrop-blur-xs border font-medium border-[#d6d6d6] transition-colors duration-150"
		>
			{text}
		</div>
	);
}
