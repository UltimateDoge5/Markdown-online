import { Link } from "react-router-dom";
// import { ReactSVG } from "react-svg";

const Navbar = () => {
	return (
		<nav>
			<span>//Logo //</span>
			{/* <ReactSVG src={"../svg/Logo.svg"} alt="Logo" /> */}
			<div>
				<Link to="/">Editor</Link>
				<Link to="/cheatsheet">Cheat sheet</Link>
			</div>
		</nav>
	);
};

export default Navbar;
