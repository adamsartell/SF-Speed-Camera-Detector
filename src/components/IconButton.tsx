export default function IconButton({
	onClick,
	children,
}: {
	onClick: () => void;
	children: React.ReactNode;
}) {
	return (
		<button
			onClick={onClick}
			className="rounded-full bg-[#f5f5f7]/10 hover:bg-[#f5f5f7]/80 hover:cursor-pointer transition-colors duration-300 border border-[#d6d6d6] p-2"
		>
			{children}
		</button>
	);
}
