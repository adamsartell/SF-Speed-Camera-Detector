import "./App.css";
import { useState, useEffect, useRef, useCallback } from "react";
import SpeedCameraMap from "./features/SpeedCameraMap/components/SpeedCameraMap";
import ActiveWarningAlert from "./features/ActiveWarningAlert/components/ActiveWarningAlert";
import SimulateWarningAlert from "./features/AlertSettings/components/SimulateWarningAlert";
import AlertSettings from "./features/AlertSettings/components/AlertSettings";
import ToggleWarningAlertVolume from "./features/AlertSettings/components/ToggleWarningAlertVolume";
import type {
	CurrentPosition,
	SpeedCamera,
	ManagedWarningAlert,
	WarningAlert,
} from "../types/types.d";
import {
	THROTTLE_INTERVAL_MS,
	WARNING_DISTANCE_METERS,
	MIN_ALERT_DISPLAY_DURATION_MS,
	AUDIO_ENABLED_COOKIE_NAME,
} from "./constants/common";
import { calculateDistance } from "./../utils/calculateDistance";
import { removeDuplicatesByLocation } from "./../utils/removeDuplicatesByLocation";
import Cookies from "js-cookie";

function App() {
	const [currentPosition, setCurrentPosition] =
		useState<CurrentPosition | null>(null);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isAudioEnabled, setIsAudioEnabled] = useState(false);
	const [speedCameras, setSpeedCameras] = useState<SpeedCamera[]>([]);
	const [activeAlertsMap, setActiveAlertsMap] = useState<
		Map<string, ManagedWarningAlert>
	>(new Map());
	const [nearbyCameraAlerts, setNearbyCameraAlerts] = useState<
		WarningAlert[]
	>([]);

	const previousRawPositionRef = useRef<{
		latitude: number;
		longitude: number;
	} | null>(null);
	const lastUpdateTimeRef = useRef<number>(0);
	const warnedCameraIds = useRef(new Set<string>());

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

				const movementThreshold = 0.00001;

				if (
					Math.abs(diffLat) > movementThreshold ||
					Math.abs(diffLng) > movementThreshold
				) {
					const angleRad = Math.atan2(diffLat, diffLng);
					const angleDeg = (angleRad * 180) / Math.PI;
					calculatedHeading = (90 - angleDeg + 360) % 360;
				} else {
					calculatedHeading = currentPosition
						? currentPosition.calculatedHeading
						: 0;
				}
			} else {
				calculatedHeading = 0;
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
					errorMessage =
						"Location unavailable. Please check your signal and location services.";
					break;
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
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 0,
			}
		);

		return () => {
			navigator.geolocation.clearWatch(watchId);
		};
	}, [currentPosition]);

	useEffect(() => {
		const newActiveAlertsMap = new Map(activeAlertsMap);
		let playSoundFlag = false;
		const now = Date.now();

		if (currentPosition && speedCameras.length > 0) {
			const currentlyNearbyCameraIds = new Set<string>();

			speedCameras.forEach((camera, index) => {
				const uniqueCameraId = `camera-${index}`;
				if (camera.latitude && camera.longitude) {
					const distance = calculateDistance(
						currentPosition.latitude,
						currentPosition.longitude,
						Number(camera.latitude),
						Number(camera.longitude)
					);

					if (distance <= WARNING_DISTANCE_METERS) {
						currentlyNearbyCameraIds.add(uniqueCameraId);

						if (
							!newActiveAlertsMap.has(uniqueCameraId) ||
							!newActiveAlertsMap.get(uniqueCameraId)!.active
						) {
							if (!warnedCameraIds.current.has(uniqueCameraId)) {
								warnedCameraIds.current.add(uniqueCameraId);
								playSoundFlag = true;
							}
							const alert: WarningAlert = {
								location: camera.location,
								distance: distance.toFixed(0),
								posted_speed: camera.posted_speed,
							};
							newActiveAlertsMap.set(uniqueCameraId, {
								alert,
								timeoutId: null,
								active: true,
								displayUntil: null,
							});
						} else {
							const existingEntry =
								newActiveAlertsMap.get(uniqueCameraId)!;
							existingEntry.alert.distance = distance.toFixed(0);
							existingEntry.active = true;
							existingEntry.displayUntil = null;
							if (existingEntry.timeoutId) {
								clearTimeout(existingEntry.timeoutId);
								existingEntry.timeoutId = null;
							}
						}
					}
				}
			});

			newActiveAlertsMap.forEach((entry, id) => {
				if (!currentlyNearbyCameraIds.has(id)) {
					if (entry.active) {
						entry.active = false;
						entry.displayUntil =
							now + MIN_ALERT_DISPLAY_DURATION_MS;

						const timeoutId = setTimeout(() => {
							setActiveAlertsMap((prev) => {
								const updated = new Map(prev);
								updated.delete(id);
								return updated;
							});
						}, MIN_ALERT_DISPLAY_DURATION_MS);
						entry.timeoutId = timeoutId;
					} else if (
						entry.displayUntil !== null &&
						now >= entry.displayUntil
					) {
						if (entry.timeoutId) clearTimeout(entry.timeoutId);
						newActiveAlertsMap.delete(id);
					}
				}
			});

			if (playSoundFlag && isAudioEnabled && audioRef.current) {
				audioRef.current.play().catch(() => {});
			}

			warnedCameraIds.current.forEach((id) => {
				if (!newActiveAlertsMap.has(id)) {
					warnedCameraIds.current.delete(id);
				}
			});
		} else {
			newActiveAlertsMap.forEach((entry) => {
				if (entry.timeoutId) clearTimeout(entry.timeoutId);
			});
			newActiveAlertsMap.clear();
			warnedCameraIds.current.clear();
		}
		setActiveAlertsMap(newActiveAlertsMap);
	}, [currentPosition, speedCameras, isAudioEnabled]);

	useEffect(() => {
		setNearbyCameraAlerts(
			Array.from(activeAlertsMap.values()).map((entry) => entry.alert)
		);
	}, [activeAlertsMap]);

	const handleSimulateWarning = useCallback(() => {
		const simulatedAlert: WarningAlert = {
			location: "MARKET ST",
			distance: Math.floor(Math.random() * 500 + 50).toString(),
			posted_speed: 30,
		};

		const simulatedAlertId = "simulated-alert";
		setActiveAlertsMap((prev) => {
			const updated = new Map(prev);
			const newManagedAlert: ManagedWarningAlert = {
				alert: simulatedAlert,
				timeoutId: null,
				active: true,
				displayUntil: null,
			};
			updated.set(simulatedAlertId, newManagedAlert);
			return updated;
		});

		if (isAudioEnabled && audioRef.current) {
			audioRef.current.currentTime = 0;
			audioRef.current.play();
		}

		setTimeout(() => {
			setActiveAlertsMap((prev) => {
				const updated = new Map(prev);
				const entry = updated.get(simulatedAlertId);
				if (entry && entry.timeoutId) {
					clearTimeout(entry.timeoutId);
				}
				updated.delete(simulatedAlertId);
				return updated;
			});
		}, MIN_ALERT_DISPLAY_DURATION_MS + 500);
	}, [isAudioEnabled]);

	useEffect(() => {
		async function fetchSpeedCameraData() {
			try {
				const response = await fetch(
					"https://data.sfgov.org/resource/d5uh-bk84.json"
				);
				const speedCameraData = await response.json();
				const filteredSpeedCameraData =
					removeDuplicatesByLocation(speedCameraData);
				setSpeedCameras(filteredSpeedCameraData);
			} catch (error) {
				console.error(error);
			}
		}
		fetchSpeedCameraData();
	}, []);

	useEffect(() => {
		const savedAudioSetting = Cookies.get(AUDIO_ENABLED_COOKIE_NAME);
		if (savedAudioSetting === "true") {
			setIsAudioEnabled(true);
		} else {
			setIsAudioEnabled(false);
		}
	}, []);

	return (
		<>
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
					setIsAudioEnabled={setIsAudioEnabled}
					audioRef={audioRef}
					setError={setError}
				/>
			</AlertSettings>
		</>
	);
}

export default App;
