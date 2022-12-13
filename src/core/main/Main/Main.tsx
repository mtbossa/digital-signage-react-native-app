import React, { useContext } from "react";
import { Text, StyleSheet, View } from "react-native";

import { AppContext } from "intus-core/shared/contexts/AppContext";
import { Login } from "intus-core/auth/components/Login";
import { Loading } from "intus-core/shared/components/Loading";
import { colors } from "intus-styles/Colors";

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
