import React from "react";
import { StyleSheet } from "react-native";
import { colors } from "./src/styles/Colors";
import AppProvider from "./src/contexts/AppContext";
import { Main } from "./src/Main";

export default function App() {
	return (
		<AppProvider>
			<Main />
		</AppProvider>
	);
}
