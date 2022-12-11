import React from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

function Login() {
	return (
		<View style={style.container}>
			<View style={style.loginCard}>
				<Text style={[style.label, style.textWhite]}>Insira o token recebido</Text>
				<TextInput
					style={[style.input, style.textWhite]}
					placeholder="Token"
					placeholderTextColor={"grey"}
				/>
				<View style={style.loginButtonWrapper}>
					<Button title="Login"></Button>
				</View>
			</View>
		</View>
	);
}

const style = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "red",
		height: "100%",
		width: "100%",
	},
	loginCard: {
		borderWidth: 1,
		borderColor: "blue",
		width: "50%",
	},
	label: {
		marginBottom: 5,
	},
	textWhite: {
		color: "white",
	},
	input: {
		borderColor: "white",
		borderWidth: 1,
		borderRadius: 5,
		padding: 5,
	},
	loginButtonWrapper: {
		marginTop: 10,
	},
});

export default Login;
