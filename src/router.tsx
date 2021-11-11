import { Routes, Route } from "react-router-dom";
import App from "./App";

const PageRouter = () => {
	return (
		<Routes>
			<Route path="/" element={<App />} />
			<Route path="*">{/* <h1>Page not found</h1> */}</Route>
		</Routes>
	);
};

export default PageRouter;
