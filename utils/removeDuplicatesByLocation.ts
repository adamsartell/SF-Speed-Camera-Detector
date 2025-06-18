import { type SpeedCamera } from "../types/types";
import cleanLocationName from "./cleanLocationName";

export function removeDuplicatesByLocation(arr: SpeedCamera[]) {
	const seenLocations = new Set();
	return arr.filter((obj) => {
		const location = cleanLocationName(obj.location);
		// console.log("LOCATION", location);
		if (seenLocations.has(location)) {
			return false; // This is a duplicate, so filter it out
		} else {
			seenLocations.add(location);
			return true; // This is a new location, so keep it
		}
	});
}
