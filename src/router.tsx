import { Routes, Route } from "react-router-dom";
import App from "./App";
import Cheatsheet from "./components/cheatsheet";

const PageRouter = () => {
	return (
		<Routes>
			<Route path="/" element={<App />} />
			<Route path="/cheatsheet" element={<Cheatsheet />} />
			<Route path="*">{/* <h1>Page not found</h1> */}</Route>
		</Routes>
	);
};

export default PageRouter;
