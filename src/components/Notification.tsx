export default function Notification({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="absolute top-3 z-40 left-1/2 -translate-x-1/2 text-medium bg-[#f5f5f7]/60 border border-[#d6d6d6] backdrop-blur-xs p-4 rounded-lg shadow-lg flex gap-3 items-center w-[calc(100%-20px)] lg:w-fit font-medium">
			{children}
		</div>
	);
}
