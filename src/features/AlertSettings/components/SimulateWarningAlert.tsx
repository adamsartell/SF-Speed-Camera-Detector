import Button from "../../../components/Button";

export default function SimulateWarningAlert({
	handleSimulateWarning,
}: {
	handleSimulateWarning: () => void;
}) {
	return (
		<Button
			ariaLabel="Simulate an alert"
			onClick={handleSimulateWarning}
			text="Simulate Alert"
		/>
	);
}
