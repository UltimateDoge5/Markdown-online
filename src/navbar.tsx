import { Link } from "react-router-dom";

const Navbar = () => {
	return (
		<nav>
			<span>//Logo //</span>
			<div>
				<Link to="/">Editor</Link>
				<Link to="/cheatsheet">Cheat sheet</Link>
			</div>
		</nav>
	);
};

export default Navbar;
