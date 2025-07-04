import "./App.css";
import { useState, useRef } from "react";
import SpeedCameraMap from "./features/SpeedCameraMap/components/SpeedCameraMap";
import ActiveWarningAlert from "./features/ActiveWarningAlert/components/ActiveWarningAlert";
import SimulateWarningAlert from "./features/AlertSettings/components/SimulateWarningAlert";
import AlertSettings from "./features/AlertSettings/components/AlertSettings";
import ToggleWarningAlertVolume from "./features/AlertSettings/components/ToggleWarningAlertVolume";
import Notification from "./components/Notification";
import Terms from "./features/Legal/Terms";

import { useGeolocation } from "./hooks/useGeoLocation";
import { useSpeedCameras } from "./hooks/useSpeedCameras";
import { useWarningAlerts } from "./hooks/useWarningAlerts";
import { useAudioSettings } from "./hooks/useAudioSettings";
import { TbLocationBroken } from "react-icons/tb";

function App() {
	const [error, setError] = useState<string | null>(null);
	const { currentPosition, geolocationError } = useGeolocation();
	const { speedCameras, cameraError } = useSpeedCameras();
	const { isAudioEnabled, toggleAudioEnabled, audioSettingsError } =
		useAudioSettings();

	const audioRef = useRef<HTMLAudioElement | null>(null);
	const audioRefEnabled = useRef<HTMLAudioElement | null>(null);

	const { nearbyCameraAlerts, handleSimulateWarning } = useWarningAlerts(
		currentPosition,
		speedCameras,
		isAudioEnabled,
		audioRef,
		audioRefEnabled
	);

	const combinedError = geolocationError || cameraError || audioSettingsError;

	return (
		<div className="text-[#202020]">
			<audio
				ref={audioRef}
				src="/audio/speed-camera-warning.mp3"
				preload="auto"
			/>
			<audio
				ref={audioRefEnabled}
				src="/audio/notification.mp3"
				preload="auto"
			/>
			<ActiveWarningAlert nearbyCameraAlerts={nearbyCameraAlerts} />
			<AlertSettings>
				<SimulateWarningAlert
					handleSimulateWarning={handleSimulateWarning}
				/>
				<ToggleWarningAlertVolume
					isAudioEnabled={isAudioEnabled}
					setIsAudioEnabled={toggleAudioEnabled}
					setError={setError}
				/>
			</AlertSettings>
			<Terms />
			{combinedError && (
				<Notification>
					<span className="w-[25px]">
						<TbLocationBroken size={20} />
					</span>
					{combinedError}
				</Notification>
			)}
			<SpeedCameraMap
				currentPosition={currentPosition}
				speedCameras={speedCameras}
				error={error}
			/>
		</div>
	);
}

export default App;
