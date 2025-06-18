import { useState, useEffect } from "react";
import type { SpeedCamera } from "../../types/types";
import { removeDuplicatesByLocation } from "../../utils/removeDuplicatesByLocation";

export function useSpeedCameras() {
	const [speedCameras, setSpeedCameras] = useState<SpeedCamera[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchSpeedCameraData() {
			setIsLoading(true);
			setError(null);
			try {
				const response = await fetch(
					"https://data.sfgov.org/resource/d5uh-bk84.json"
				);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const speedCameraData = await response.json();
				const filteredSpeedCameraData =
					removeDuplicatesByLocation(speedCameraData);
				setSpeedCameras(filteredSpeedCameraData);
			} catch (error: unknown) {
				console.error("Failed to fetch speed camera data:", error);
				setError(
					`Failed to load speed camera data: ${
						error instanceof Error ? error.message : String(error)
					}`
				);
			} finally {
				setIsLoading(false);
			}
		}
		fetchSpeedCameraData();
	}, []);

	return { speedCameras, isLoadingCameras: isLoading, cameraError: error };
}
