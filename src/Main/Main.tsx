import React, { useContext, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import { Login } from "../Auth/components";
import { AppContext } from "../contexts/AppContext";
import { Loading } from "../general/Loading";
import { colors } from "../styles/Colors";

function Main() {
	const { isLoading, isAuth } = useContext(AppContext);

	console.log(isLoading);
	return (
		<View style={style.container}>
			{isLoading ? (
				<Loading />
			) : (
				<View>
					{isAuth ? <Text style={{ color: "white" }}>Already authenticated</Text> : <Login />}
				</View>
			)}
		</View>
	);
}

const style = StyleSheet.create({
	container: {
		width: "100%",
		height: "100%",
		backgroundColor: colors.backgroundColor,
	},
});

export default Main;
