import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useState } from "react";
import { Text, StyleSheet, View, Button } from "react-native";
import { Login } from "../Auth/components";
import { AppContext } from "../contexts/AppContext";
import { StorageKeys } from "../database/AsyncStorage/StorageKeys";
import { Loading } from "../general/Loading";
import { colors } from "../styles/Colors";

function Main() {
	const { isLoading, isAuth } = useContext(AppContext);

	return (
		<View style={style.container}>
			{isLoading ? (
				<Loading />
			) : (
				<View>
					{isAuth ? (
						<View>
							<Text style={{ color: "white" }}>Already authenticated</Text>
						</View>
					) : (
						<Login />
					)}
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
