import { FaVolumeHigh, FaVolumeXmark } from "react-icons/fa6";
import type { AlertSettingsProps } from "../../../../types/types";
import Cookies from "js-cookie";
import { useEffect, useRef } from "react";
import { AUDIO_ENABLED_COOKIE_NAME } from "../../../constants/common";
import IconButton from "../../../components/IconButton";

export default function ToggleWarningAlertVolume({
	isAudioEnabled,
	setIsAudioEnabled,
	setError,
}: AlertSettingsProps) {
	const audioRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		if (typeof window !== "undefined") {
			if (isAudioEnabled) {
				audioRef.current = new Audio(
					"/audio/notification-disabled.mp3"
				);
				audioRef.current.load();
			} else {
				audioRef.current = new Audio("/audio/notification.mp3");
				audioRef.current.load();
			}
		}
	}, [isAudioEnabled, audioRef]);

	const handleToggleAudio = async () => {
		// If audio is currently enabled, we are turning it OFF
		if (isAudioEnabled) {
			setIsAudioEnabled(false);
			// Optionally, you might want to pause any currently playing sound
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current.currentTime = 0; // Reset for next play
				audioRef.current.volume = 0.5;
				await audioRef.current.play();
			}
		} else {
			// If audio is currently disabled, we are attempting to turn it ON
			if (audioRef.current) {
				// Capture the current audio element instance
				const currentAudio = audioRef.current;
				try {
					currentAudio.currentTime = 0; // Start from beginning
					currentAudio.volume = 0.5; // Play at a noticeable volume
					await currentAudio.play();

					// Pause after a very short delay to make it a "click" sound for testing
					setTimeout(() => {
						if (currentAudio) {
							currentAudio.pause();
							currentAudio.volume = 1.0; // Reset to full volume for actual alerts
						}
					}, 300); // Play for 300ms

					setIsAudioEnabled(true); // Set to true only if play() was successful
					setError(""); // Clear any previous error message related to audio
				} catch (e) {
					// Handle cases where autoplay is blocked or permission is denied
					const errMsg = `Audio playback permission denied: ${
						e instanceof Error ? e.message : String(e)
					}. Please click the sound icon and check browser/device sound settings. On iOS, ensure your device is not in silent mode.`;
					setError(errMsg);
					setIsAudioEnabled(false); // Ensure state is off if test fails
				}
			} else {
				// This case handles if audioRef.current is null when trying to enable
				const errMsg =
					"Audio element not available to enable playback.";
				setError(errMsg);
				setIsAudioEnabled(false);
			}
		}
	};

	useEffect(() => {
		if (isAudioEnabled) {
			Cookies.set(AUDIO_ENABLED_COOKIE_NAME, "true", { expires: 30 });
		}
	}, [isAudioEnabled]);

	return (
		<>
			{!isAudioEnabled && (
				<IconButton onClick={handleToggleAudio}>
					<FaVolumeXmark />
				</IconButton>
			)}
			{isAudioEnabled && (
				<IconButton onClick={handleToggleAudio}>
					<FaVolumeHigh />
				</IconButton>
			)}
		</>
	);
}
