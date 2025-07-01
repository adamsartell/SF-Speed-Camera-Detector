export default function IconButton({
	onClick,
	ariaLabel,
	children,
}: {
	onClick: () => void;
	ariaLabel: string;
	children: React.ReactNode;
}) {
	return (
		<button
			onClick={onClick}
			aria-label={ariaLabel}
			className="rounded-full bg-[#f5f5f7]/10 hover:bg-[#f5f5f7]/80 hover:cursor-pointer shadow-xs transition-colors duration-300 border border-[#d6d6d6] p-2"
		>
			{children}
		</button>
	);
}
