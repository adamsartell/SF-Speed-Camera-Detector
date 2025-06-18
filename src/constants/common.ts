// Maximum distance, in meters, a speed camera can be from the currentPosition to trigger a warning alert.
export const WARNING_DISTANCE_METERS = 325;
// export const WARNING_DISTANCE_METERS = 1000;

// Minimum time interval, in milliseconds, between processing new geolocation updates
export const THROTTLE_INTERVAL_MS = 500;

// Minimum duration, in milliseconds, that a warning alert will remain visible on the screen after the user has moved outside the WARNING_DISTANCE_METERS threshold for that camera
export const MIN_ALERT_DISPLAY_DURATION_MS = 8000;

// Minimum duration, in milliseconds, that the map should recent after the user has panned/zoomed
export const RECENTER_DELAY_MS = 5000;

// Latitude/longitude difference threshold. It's used to determine if the map's current center or the user's currentPosition has "significantly moved" since the last known centered position.
export const STATIONARY_LAT_LNG_THRESHOLD = 0.00001;

// Speed threshold, measured in meters per second (m/s). If the currentPosition.speed (which comes from the device's geolocation sensor) is greater than this threshold, the application considers the user to be in motion.
export const SPEED_THRESHOLD_M_PER_S = 0.5;

// Name of the cookie used to store the user's preference for whether audio alerts are enabled or disabled
export const AUDIO_ENABLED_COOKIE_NAME = "audioEnabled";
