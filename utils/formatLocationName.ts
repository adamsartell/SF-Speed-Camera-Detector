export default function formatLocationName(locationString: string): string {
	if (!locationString || typeof locationString !== "string") {
		return ""; // Handle empty or invalid input
	}

	// Split by space, then filter out empty strings in case of multiple spaces
	const parts = locationString.split(" ").filter((part) => part.length > 0);
	if (parts.length === 0) {
		return ""; // No parts to process
	}

	let rawAddressPart = ""; // Stores the address part, potentially with number
	// let formattedDirection = "";

	const possibleDirectionAbbreviation = parts[0].toUpperCase();

	// Check if the first part is a known direction abbreviation
	switch (possibleDirectionAbbreviation) {
		case "NB":
		case "SB":
		case "EB":
		case "WB":
			// If it's a direction, store it and process the rest of the string as the raw address
			// formattedDirection = `(${possibleDirectionAbbreviation})`;
			rawAddressPart = parts.slice(1).join(" ");
			break;
		default:
			// If it's not a direction, assume the whole string is the raw address
			rawAddressPart = locationString;
			// formattedDirection = ""; // No direction to append
			break;
	}

	// --- NEW LOGIC TO REMOVE STREET NUMBER ---
	// Split the raw address part to check for a leading number
	const addressWords = rawAddressPart
		.split(" ")
		.filter((word) => word.length > 0);
	let addressWithoutNumber = addressWords;

	// If the first word of the address is a number, remove it
	if (addressWords.length > 0 && !isNaN(Number(addressWords[0]))) {
		addressWithoutNumber = addressWords.slice(1);
	}
	// --- END NEW LOGIC ---

	// Capitalize the first letter of each significant word in the address.
	// This is a basic attempt; for robust address formatting, you might need a more sophisticated library.
	const formattedAddress = addressWithoutNumber
		.map((word) => {
			// Capitalize first letter of each word and convert rest to lowercase
			return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
		})
		.join(" ");

	// Combine the formatted address and direction, then trim any extra spaces
	// This will result in "Market St (WB)" or "Market St"
	// return `${formattedAddress} ${formattedDirection}`.trim();
	return `${formattedAddress}`.trim();
}
