export interface SpeedCameraMapProps {
	currentPosition: CurrentPosition | null;
	speedCameras: SpeedCamera[];
	error: string | null;
}

export interface CurrentPosition {
	latitude: number;
	longitude: number;
	calculatedHeading: number | null;
	speed?: number | null;
}

export interface SpeedCamera {
	location: string;
	latitude: number;
	longitude: number;
	posted_speed: number;
}

export interface ManagedWarningAlert {
	alert: WarningAlert;
	timeoutId: NodeJS.Timeout | null;
	active: boolean;
	displayUntil: number | null;
}

export interface WarningAlert {
	location: string;
	distance: string;
	posted_speed: number;
}

export interface ActiveWarningAlertProps {
	nearbyCameraAlerts: WarningAlert[];
}

export interface AlertSettingsProps {
	isAudioEnabled: boolean;
	setIsAudioEnabled: Dispatch<SetStateAction<boolean>>;
	setError: (errMsg: string) => void;
}
