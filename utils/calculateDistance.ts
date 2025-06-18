function toRad(value: number): number {
	return (value * Math.PI) / 180;
}

export function calculateDistance(
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number
): number {
	const R = 6371e3; // Earth's radius in metres
	const FEET_PER_METER = 3.28084; // Conversion factor from meters to feet

	const φ1 = toRad(lat1);
	const φ2 = toRad(lat2);
	const Δφ = toRad(lat2 - lat1);
	const Δλ = toRad(lon2 - lon1);

	const a =
		Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
		Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	const distanceInMeters = R * c; // Distance in meters
	const distanceInFeet = distanceInMeters * FEET_PER_METER; // Convert to feet

	return distanceInFeet;
}
