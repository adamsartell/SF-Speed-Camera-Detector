import Button from "../../../components/Button";

export default function SimulateWarningAlert({
	handleSimulateWarning,
}: {
	handleSimulateWarning: () => void;
}) {
	return <Button onClick={handleSimulateWarning} text="Simulate Alert" />;
}
