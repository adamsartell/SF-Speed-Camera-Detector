import { Marker } from "@react-google-maps/api";
import type { CurrentPosition } from "../../../../types/types.d";

export default function CurrentPositionMarker({
	currentPosition,
}: {
	currentPosition: CurrentPosition;
}) {
	return (
		<Marker
			position={{
				lat: currentPosition.latitude,
				lng: currentPosition.longitude,
			}}
			icon={{
				path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
				scale: 6,
				fillColor: "#0f69f5",
				fillOpacity: 1,
				strokeColor: "#FFFFFF",
				strokeWeight: 1,
				rotation:
					currentPosition?.calculatedHeading !== null
						? currentPosition.calculatedHeading
						: 0,
				anchor: new google.maps.Point(0, 0),
			}}
		/>
	);
}
