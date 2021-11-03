import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
	// const [count, setCount] = useState(0);

	return (
		<>
			<Navbar />
			<aside id="cheatsheet"></aside>
			<main>
				<textarea># Markup online</textarea>
				<div>
					<h1>Markup online</h1>
				</div>
			</main>
		</>
	);
}

const Navbar = () => {
	return (
		<nav>
			<span>//Logo //</span>
			<div>
				<a href="/cheatsheet">Cheat sheet</a>
			</div>
		</nav>
	);
};

export default App;
