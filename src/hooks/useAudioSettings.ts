import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { AUDIO_ENABLED_COOKIE_NAME } from "../constants/common";

export function useAudioSettings() {
	const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const savedAudioSetting = Cookies.get(AUDIO_ENABLED_COOKIE_NAME);
		if (savedAudioSetting === "true") {
			setIsAudioEnabled(true);
		} else {
			setIsAudioEnabled(false);
		}
	}, []);

	const toggleAudioEnabled = useCallback(() => {
		setIsAudioEnabled((prev) => {
			const newState = !prev;
			try {
				Cookies.set(AUDIO_ENABLED_COOKIE_NAME, String(newState), {
					expires: 365,
				});
			} catch (e: unknown) {
				console.error("Failed to set audio settings cookie:", e);
				setError("Failed to save audio preference.");
			}
			return newState;
		});
	}, []);

	return { isAudioEnabled, toggleAudioEnabled, audioSettingsError: error };
}
