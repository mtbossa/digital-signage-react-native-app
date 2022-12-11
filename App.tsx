import React from "react";
import AppProvider from "./src/contexts/AppContext";
import { Main } from "./src/core/main/Main";

export default function App() {
	return (
		<AppProvider>
			<Main />
		</AppProvider>
	);
}
