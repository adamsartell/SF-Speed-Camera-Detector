export default function AlertSettings({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="absolute bottom-14 md:bottom-6 max-md:left-[calc(50%-105px)] md:right-16 z-50 shadow-sm py-2 px-3 rounded-lg bg-[#f5f5f7]/50 backdrop-blur-xs border border-[#d6d6d6] flex justify-between items-center gap-3 w-fit">
			{children}
		</div>
	);
}
