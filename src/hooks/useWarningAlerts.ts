import {
	useState,
	useEffect,
	useRef,
	useCallback,
	type RefObject,
} from "react";
import type {
	CurrentPosition,
	SpeedCamera,
	ManagedWarningAlert,
	WarningAlert,
} from "../../types/types";
import { calculateDistance } from "../../utils/calculateDistance";
import {
	WARNING_DISTANCE_METERS,
	MIN_ALERT_DISPLAY_DURATION_MS,
} from "../constants/common";

export function useWarningAlerts(
	currentPosition: CurrentPosition | null,
	speedCameras: SpeedCamera[],
	isAudioEnabled: boolean,
	audioRef: RefObject<HTMLAudioElement | null>,
	audioRefEnabled: RefObject<HTMLAudioElement | null>
) {
	const [activeAlertsMap, setActiveAlertsMap] = useState<
		Map<string, ManagedWarningAlert>
	>(new Map());
	const [nearbyCameraAlerts, setNearbyCameraAlerts] = useState<
		WarningAlert[]
	>([]);
	const warnedCameraIds = useRef(new Set<string>());

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

			if (
				playSoundFlag &&
				isAudioEnabled &&
				audioRef.current &&
				audioRefEnabled.current
			) {
				audioRefEnabled.current?.play().catch(() => {});
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
	}, [currentPosition, speedCameras, isAudioEnabled, audioRef]); // audioRef as dependency

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

		if (isAudioEnabled && audioRef.current && audioRefEnabled.current) {
			// Reset current time for both audio elements
			audioRef.current.currentTime = 0;
			audioRefEnabled.current.currentTime = 0;

			// Pause duration in milliseconds
			const pauseDuration = 400;

			audioRefEnabled.current
				.play()
				.then(() => {
					return new Promise((resolve) =>
						setTimeout(resolve, pauseDuration)
					);
				})
				.then(() => {
					audioRef.current?.play().catch((error) => {
						console.error("Error playing audioRef:", error);
					});
				})
				.catch((error) => {
					console.error(
						"Error playing audioRefEnabled or during pause:",
						error
					);
				});
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
	}, [isAudioEnabled, audioRef]); // audioRef as dependency

	return {
		nearbyCameraAlerts,
		handleSimulateWarning,
		activeAlertsMapDebug: activeAlertsMap,
	};
}
