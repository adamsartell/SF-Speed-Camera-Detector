import { Marker } from "@react-google-maps/api";
import type { SpeedCamera } from "../../../../types/types.d";

export default function SpeedCameraMarker({ camera }: { camera: SpeedCamera }) {
	return (
		<Marker
			position={{
				lat: Number(camera.latitude),
				lng: Number(camera.longitude),
			}}
			icon={{
				url: "/images/camera-icon.png",
				scaledSize: new google.maps.Size(30, 30),
			}}
			title={camera.location}
		/>
	);
}
