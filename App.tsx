import React, { useState } from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import { Video, AVPlaybackStatus, AVPlaybackStatusSuccess, ResizeMode } from "expo-av";
import { Login } from "./src/Auth/components";
import { colors } from "./src/styles/Colors";

export default function App() {
	const [isAuth, setIsAuth] = useState(false);
	return (
		<View style={style.container}>{isAuth ? <Text>Already authenticated</Text> : <Login />}</View>
	);
}

const style = StyleSheet.create({
	container: {
		backgroundColor: colors.backgroundColor,
	},
});
