import { useState } from "react";
import { Switch } from "@headlessui/react";
import "../styles/toggle.css";

const Toggle = ({ state = false, label, onChange }: ToggleProps) => {
	const [enabled, setEnabled] = useState(state);

	return (
		<Switch.Group>
			<div className="toggleGroup">
				<Switch.Label className="toggleLabel">{label}</Switch.Label>
				<Switch
					checked={enabled}
					onChange={() => {
						setEnabled(!enabled);
						onChange(!enabled);
					}}
					className="toggle"
					style={enabled ? { backgroundColor: "rgb(37, 99, 235)" } : { backgroundColor: "rgb(229, 231, 235)" }}
				>
					<span style={enabled ? { transform: "translateX(20px)" } : { transform: "translateX(0px)" }} />
				</Switch>
			</div>
		</Switch.Group>
	);
};

interface ToggleProps {
	state?: boolean;
	label: string;
	onChange: (enabled: boolean) => void;
}

export default Toggle;
