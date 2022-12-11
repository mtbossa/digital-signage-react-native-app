import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Button, GestureResponderEvent, StyleSheet, Text, TextInput, View } from "react-native";
import { StorageKeys } from "../../database/AsyncStorage/StorageKeys";

function Login() {
	const [token, setToken] = useState("");

	const storeData = async (_: GestureResponderEvent) => {
		try {
			await AsyncStorage.setItem(StorageKeys.API_TOKEN, token);

			console.log(await AsyncStorage.getItem(StorageKeys.API_TOKEN));

			await AsyncStorage.removeItem(StorageKeys.API_TOKEN);

			console.log(await AsyncStorage.getItem(StorageKeys.API_TOKEN));
		} catch (e) {
			console.log("Error while saving api token");
		}
	};

	return (
		<View style={style.container}>
			<View style={style.loginCard}>
				<Text style={[style.label, style.textWhite]}>Insira o token recebido</Text>
				<TextInput
					style={[style.input, style.textWhite]}
					placeholderTextColor={"grey"}
					placeholder="Token"
					onChangeText={text => setToken(text)}
				/>
				<View style={style.loginButtonWrapper}>
					<Button onPress={storeData} title="Login"></Button>
				</View>
			</View>
		</View>
	);
}

const style = StyleSheet.create({
	container: {
		height: "100%",
		borderWidth: 1,
		borderColor: "red",
		alignItems: "center",
		justifyContent: "center",
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
