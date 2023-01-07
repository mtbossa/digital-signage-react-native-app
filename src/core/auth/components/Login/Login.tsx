import React, { useContext, useState } from "react";
import { Button, GestureResponderEvent, StyleSheet, Text, TextInput, View } from "react-native";

import { AppContext } from "intus-core/shared/contexts/AppContext";
import { useStorage } from "intus-database/AsyncStorage/hooks/useStorage";
import { StorageKeys } from "intus-database/AsyncStorage/StorageKeys";
import { IntusAPIClient } from "intus-api/IntusAPIClient";

function Login() {
	const [token, setToken] = useState("");

	const { setIsAuth } = useContext(AppContext);
	const { setItem } = useStorage();

	const login = async (_: GestureResponderEvent) => {
		try {
			await setItem(StorageKeys.API_TOKEN, token);
			IntusAPIClient.setApiToken(token);
			setIsAuth(true);
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
					<Button onPress={login} title="Login"></Button>
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
