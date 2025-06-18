import { useState, useEffect, useRef } from "react";
import type { CurrentPosition } from "../../types/types";
import {
	STATIONARY_LAT_LNG_THRESHOLD,
	THROTTLE_INTERVAL_MS,
} from "../constants/common";

export function useGeolocation() {
	const [currentPosition, setCurrentPosition] =
		useState<CurrentPosition | null>(null);
	const [error, setError] = useState<string | null>(null);
	const previousRawPositionRef = useRef<{
		latitude: number;
		longitude: number;
	} | null>(null);
	const lastUpdateTimeRef = useRef<number>(0);

	useEffect(() => {
		if (!navigator.geolocation) {
			setError("Geolocation is not supported by your browser.");
			return;
		}

		const handleSuccess = (position: GeolocationPosition) => {
			const currentTime = Date.now();
			if (
				currentTime - lastUpdateTimeRef.current <
				THROTTLE_INTERVAL_MS
			) {
				return;
			}
			lastUpdateTimeRef.current = currentTime;

			const newLat = position.coords.latitude;
			const newLng = position.coords.longitude;
			const nativeSpeed = position.coords.speed;

			let calculatedHeading: number | null = null;
			if (previousRawPositionRef.current) {
				const prevLat = previousRawPositionRef.current.latitude;
				const prevLng = previousRawPositionRef.current.longitude;

				const diffLat = newLat - prevLat;
				const diffLng = newLng - prevLng;
				const movementThreshold = STATIONARY_LAT_LNG_THRESHOLD;

				if (
					Math.abs(diffLat) > movementThreshold ||
					Math.abs(diffLng) > movementThreshold
				) {
					const angleRad = Math.atan2(diffLat, diffLng);
					const angleDeg = (angleRad * 180) / Math.PI;
					calculatedHeading = (90 - angleDeg + 360) % 360;
				} else {
					// Maintain previous heading if not moving significantly
					calculatedHeading = currentPosition
						? currentPosition.calculatedHeading
						: 0;
				}
			} else {
				calculatedHeading = 0; // Default heading for first position
			}

			setCurrentPosition({
				latitude: newLat,
				longitude: newLng,
				calculatedHeading: calculatedHeading,
				speed: nativeSpeed,
			});
			previousRawPositionRef.current = {
				latitude: newLat,
				longitude: newLng,
			};
			setError(null);
		};

		const handleError = (geoError: GeolocationPositionError) => {
			let errorMessage = "An unknown error occurred.";
			switch (geoError.code) {
				case geoError.PERMISSION_DENIED:
					errorMessage =
						"Location permission denied. To be alerted to nearby speed cameras, please grant access in your device's privacy settings.";
					break;
				case geoError.POSITION_UNAVAILABLE:
				case geoError.TIMEOUT:
					errorMessage =
						"Location unavailable. Please check your signal and location services.";
					break;
				default:
					errorMessage = `Geolocation error: ${geoError.message}`;
			}
			setError(errorMessage);
			setCurrentPosition(null);
		};

		const watchId = navigator.geolocation.watchPosition(
			handleSuccess,
			handleError,
			{ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
		);

		return () => {
			navigator.geolocation.clearWatch(watchId);
		};
	}, [currentPosition]);

	return { currentPosition, geolocationError: error };
}
