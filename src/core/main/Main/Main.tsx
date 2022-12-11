import React, { useContext } from "react";
import { Text, StyleSheet, View } from "react-native";

import { Login } from "@intus/core/auth/components/Login";
import { AppContext } from "@intus/contexts/AppContext";
import { Loading } from "@intus/core/general/Loading";
import { colors } from "@intus/styles/Colors";

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
