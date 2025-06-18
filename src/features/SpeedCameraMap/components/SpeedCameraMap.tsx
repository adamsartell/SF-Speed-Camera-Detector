import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import type { SpeedCameraMapProps } from "../../../../types/types";
import {
	SPEED_THRESHOLD_M_PER_S,
	STATIONARY_LAT_LNG_THRESHOLD,
} from "../../../constants/common";
import LocationIcon from "./LocationIcon";
import SpeedCameraMarker from "./SpeedCameraMarker";
import CurrentPositionMarker from "./CurrentPositionMarker";

export default function SpeedCameraMap({
	currentPosition,
	speedCameras,
	error,
}: SpeedCameraMapProps) {
	const [map, setMap] = useState<google.maps.Map | null>(null);
	const [userPanned, setUserPanned] = useState(false);
	const [recenterRequested, setRecenterRequested] = useState(false);

	const lastCenteredPositionRef = useRef<{ lat: number; lng: number } | null>(
		null
	);
	const lastZoomLevelRef = useRef<number | null>(null);

	const { isLoaded } = useJsApiLoader({
		id: "google-map-script",
		googleMapsApiKey: import.meta.env.VITE_PUBLIC_GOOGLE_MAPS_API_KEY || "",
	});

	const options = {
		streetViewControl: false,
		zoomControl: true,
		disableDefaultUI: true,
	};

	const containerStyle = {
		width: "100vw",
		height: "100vh",
	};

	const isTrulyMoving =
		(currentPosition?.speed ?? 0) > SPEED_THRESHOLD_M_PER_S;

	const zoomLevel = isTrulyMoving ? 17 : 15;

	const targetMapCenter = useMemo(() => {
		return {
			lat: currentPosition?.latitude ?? 37.7749, // Default to San Francisco latitude
			lng: currentPosition?.longitude ?? -122.4194, // Default to San Francisco longitude
		};
	}, [currentPosition?.latitude, currentPosition?.longitude]);

	const onLoad = useCallback(
		function callback(mapInstance: google.maps.Map) {
			setMap(mapInstance);

			// Initial map setup
			mapInstance.setCenter(targetMapCenter);
			mapInstance.setZoom(zoomLevel);
			// Set initial heading if available
			if (
				currentPosition?.calculatedHeading !== null &&
				currentPosition?.calculatedHeading !== undefined
			) {
				mapInstance.setHeading(currentPosition.calculatedHeading);
			} else {
				mapInstance.setHeading(0); // Default to North if no heading
			}

			lastCenteredPositionRef.current = targetMapCenter;
			lastZoomLevelRef.current = zoomLevel;
		},
		[targetMapCenter, zoomLevel, currentPosition?.calculatedHeading]
	);

	const onUnmount = useCallback(function callback() {
		setMap(null);
	}, []);

	const onDragStart = useCallback(() => {
		setUserPanned(true);
		setRecenterRequested(false);
	}, []);

	useEffect(() => {
		const mapCurrentCenter = map?.getCenter()?.toJSON();
		const isMapCurrentlyAtTargetCenter =
			mapCurrentCenter &&
			Math.abs(mapCurrentCenter.lat - targetMapCenter.lat) <
				STATIONARY_LAT_LNG_THRESHOLD &&
			Math.abs(mapCurrentCenter.lng - targetMapCenter.lng) <
				STATIONARY_LAT_LNG_THRESHOLD;
		const isMapCurrentlyAtTargetZoom = map?.getZoom() === zoomLevel;
		const isMapCurrentlyAtTargetHeading =
			map?.getHeading() === (currentPosition?.calculatedHeading ?? 0);

		if (recenterRequested) {
			if (!isMapCurrentlyAtTargetCenter) {
				map?.panTo(targetMapCenter);
			}
			if (!isMapCurrentlyAtTargetZoom) {
				map?.setZoom(zoomLevel);
			}
			if (!isMapCurrentlyAtTargetHeading) {
				map?.setHeading(currentPosition?.calculatedHeading ?? 0);
			}
			lastCenteredPositionRef.current = targetMapCenter;
			lastZoomLevelRef.current = zoomLevel;
			setRecenterRequested(false);
			setUserPanned(false);
			return;
		}

		const hasMovedSignificantlySinceLastCenter =
			lastCenteredPositionRef.current && currentPosition
				? Math.abs(
						currentPosition?.latitude -
							lastCenteredPositionRef.current.lat
				  ) > STATIONARY_LAT_LNG_THRESHOLD ||
				  Math.abs(
						currentPosition?.longitude -
							lastCenteredPositionRef.current.lng
				  ) > STATIONARY_LAT_LNG_THRESHOLD
				: true;

		const shouldAutoTrack =
			!userPanned &&
			(isTrulyMoving || hasMovedSignificantlySinceLastCenter);

		if (shouldAutoTrack) {
			if (!isMapCurrentlyAtTargetCenter) {
				map?.panTo(targetMapCenter);
			}
			if (!isMapCurrentlyAtTargetZoom) {
				map?.setZoom(zoomLevel);
			}
			if (!isMapCurrentlyAtTargetHeading) {
				map?.setHeading(currentPosition?.calculatedHeading ?? 0);
			}

			if (
				!isMapCurrentlyAtTargetCenter ||
				!isMapCurrentlyAtTargetZoom ||
				!isMapCurrentlyAtTargetHeading
			) {
				lastCenteredPositionRef.current = targetMapCenter;
				lastZoomLevelRef.current = zoomLevel;
			}
		}
	}, [
		map,
		currentPosition,
		userPanned,
		recenterRequested,
		zoomLevel,
		isTrulyMoving,
		targetMapCenter,
	]);

	const handleRecenterClick = useCallback(() => {
		setUserPanned(false);
		setRecenterRequested(true);
	}, []);

	return (
		<>
			{isLoaded ? (
				<GoogleMap
					mapContainerStyle={containerStyle}
					center={targetMapCenter}
					zoom={map?.getZoom() ?? zoomLevel}
					heading={map?.getHeading() ?? 0}
					onLoad={onLoad}
					onUnmount={onUnmount}
					options={options}
					onDragStart={onDragStart}
				>
					{currentPosition && (
						<CurrentPositionMarker
							currentPosition={currentPosition}
						/>
					)}
					{speedCameras.map((camera, index) => {
						if (camera.latitude && camera.longitude) {
							return (
								<SpeedCameraMarker
									key={`camera-${index}`}
									camera={camera}
								/>
							);
						}
						return null;
					})}
				</GoogleMap>
			) : (
				!isLoaded &&
				!error &&
				currentPosition === null && (
					<div className="h-[100vh] bg-[#f5f5f7] w-full animate-pulse rounded-lg flex items-center justify-center text-gray-500">
						Loading Map...
					</div>
				)
			)}

			{userPanned && currentPosition && (
				<LocationIcon handleRecenterClick={handleRecenterClick} />
			)}
		</>
	);
}
