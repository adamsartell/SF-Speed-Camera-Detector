// import { FiAlertTriangle } from "react-icons/fi";
// import { TbAlertCircle } from "react-icons/tb";
import type {
	ActiveWarningAlertProps,
	WarningAlert,
} from "../../../../types/types.d";
import formatLocationName from "../../../../utils/formatLocationName";
import { GiCctvCamera } from "react-icons/gi";
import SpeedLimitIcon from "./SpeedLimitIcon";

export default function ActiveWarningAlert({
	nearbyCameraAlerts,
}: ActiveWarningAlertProps) {
	return (
		<div className="absolute left-[10px] lg:left-[25%] top-[10px] lg:w-[50%] w-[calc(100%-20px)] z-50">
			{nearbyCameraAlerts.length > 0 && (
				<>
					{nearbyCameraAlerts.map(
						(alert: WarningAlert, index: number) => (
							<div
								key={index}
								className="p-4 bg-red-500/80 backdrop-blur-xs rounded-lg gap-1 flex flex-col mb-2"
							>
								<>
									<div className="flex gap-2 items-center">
										{/* <TbAlertCircle size={30} /> */}
										{/* <GiCctvCamera size={30} />
									<h2 className="font-medium text-[27px]">
										SPEED CAMERA
									</h2> */}
									</div>
									<div className="flex justify-between items-center">
										<div className="flex-col gap-1 justify-between flex">
											<div className="font-bold text-3xl flex gap-2 items-center justify-between">
												<GiCctvCamera size={30} />
												{`${formatLocationName(
													alert.location
												)}`}
											</div>
											<div className="font-bold text-5xl">
												{`${alert.distance}ft`}
											</div>
										</div>
										<SpeedLimitIcon
											posted_speed={alert.posted_speed}
										/>
									</div>
								</>
							</div>
						)
					)}
				</>
			)}
		</div>
	);
}
