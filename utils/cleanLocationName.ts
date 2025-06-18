// utils/cleanLocationName.ts

// Regex to match common directional prefixes at the start of a string, case-insensitive.
// It covers N, S, E, W, NE, NW, SE, SW, NB, SB, EB, WB followed by a word boundary and one or more spaces.
const DIRECTIONAL_PREFIX_REGEX = /^(N|S|E|W|NE|NW|SE|SW|NB|SB|EB|WB)\b\s*/i;

// NEW Regex to match leading numbers at the start of a string, followed by zero or more spaces.
// const LEADING_NUMBER_REGEX = /^\d+\s*/;

/**
 * Cleans a location string by removing:
 * 1. Common directional prefixes (e.g., "EB", "WB").
 * 2. Leading street numbers (e.g., "2999").
 * It also standardizes spacing.
 *
 * @param location The raw location string (e.g., "EB 2999 Market St").
 * @returns The cleaned location string (e.g., "Market St").
 */
export default function cleanLocationName(location: string | null): string {
	if (!location) {
		return "";
	}

	// 1. Remove the directional prefix first (e.g., "EB 2999 Market St" -> "2999 Market St")
	let cleaned = location.replace(DIRECTIONAL_PREFIX_REGEX, "").trim();

	// // 2. Then, remove leading street numbers (e.g., "2999 Market St" -> "Market St")
	// cleaned = cleaned.replace(LEADING_NUMBER_REGEX, "").trim();

	// 3. Finally, replace any multiple spaces with a single space and trim any final leading/trailing spaces
	cleaned = cleaned.replace(/\s+/g, " ").trim();

	return cleaned;
}
