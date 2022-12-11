import React, { useContext } from "react";
import { Text, StyleSheet, View } from "react-native";
import { AppContext } from "../../../contexts/AppContext";
import { colors } from "../../../styles/Colors";
import { Login } from "../../auth/components/Login";
import { Loading } from "../../general/Loading";

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
