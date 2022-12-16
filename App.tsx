import React from "react";
import AppProvider from "./src/core/shared/contexts/AppContext";

import { Main } from "intus-core/main/components/Main";

export default function App() {
	return (
		<AppProvider>
			<Main />
		</AppProvider>
	);
}
