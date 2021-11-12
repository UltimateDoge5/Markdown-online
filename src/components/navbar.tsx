import { Link } from "react-router-dom";
// import { ReactComponent as Logo } from "../svg/Logo.svg";

const Navbar = () => {
	return (
		<nav>
			<span>Logo</span>
			{/* <Logo /> */}
			<div>
				<Link to="/">Editor</Link>
				<Link to="/cheatsheet">Cheat sheet</Link>
			</div>
		</nav>
	);
};

export default Navbar;
