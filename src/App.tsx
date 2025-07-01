import "./App.css";
import { useState, useRef } from "react";
import SpeedCameraMap from "./features/SpeedCameraMap/components/SpeedCameraMap";
import ActiveWarningAlert from "./features/ActiveWarningAlert/components/ActiveWarningAlert";
import SimulateWarningAlert from "./features/AlertSettings/components/SimulateWarningAlert";
import AlertSettings from "./features/AlertSettings/components/AlertSettings";
import ToggleWarningAlertVolume from "./features/AlertSettings/components/ToggleWarningAlertVolume";
import Notification from "./components/Notification";

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

	const { nearbyCameraAlerts, handleSimulateWarning } = useWarningAlerts(
		currentPosition,
		speedCameras,
		isAudioEnabled,
		audioRef
	);

	const combinedError = geolocationError || cameraError || audioSettingsError;

	return (
		<div className="text-[#202020]">
			<audio
				ref={audioRef}
				src="/audio/speed-camera-warning.mp3"
				preload="auto"
			/>
			<ActiveWarningAlert nearbyCameraAlerts={nearbyCameraAlerts} />
			<SpeedCameraMap
				currentPosition={currentPosition}
				speedCameras={speedCameras}
				error={error}
			/>
			<AlertSettings>
				<SimulateWarningAlert
					handleSimulateWarning={handleSimulateWarning}
				/>
				<ToggleWarningAlertVolume
					isAudioEnabled={isAudioEnabled}
					setIsAudioEnabled={toggleAudioEnabled}
					audioRef={audioRef}
					setError={setError}
				/>
			</AlertSettings>
			{combinedError && (
				<Notification>
					<span className="w-[25px]">
						<TbLocationBroken size={20} />
					</span>
					{combinedError}
				</Notification>
			)}
		</div>
	);
}

export default App;
