import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../svg/Logo.svg";

import "../styles/navbar.css";

const Navbar = () => {
	const navigate = useNavigate();

	return (
		<nav>
			<Logo
				onClick={() => {
					navigate("/");
				}}
			/>
			<div>
				<Link to="/">Editor</Link>
				<Link to="/cheatsheet">Cheat sheet</Link>
			</div>
		</nav>
	);
};

export default Navbar;
