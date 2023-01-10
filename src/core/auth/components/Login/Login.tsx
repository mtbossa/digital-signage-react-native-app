import React, { useContext, useRef, useState, useEffect } from "react";
import { Button, GestureResponderEvent, StyleSheet, Text, TextInput, View } from "react-native";
import Constants from "expo-constants";

import { AppContext } from "intus-core/shared/contexts/AppContext";
import { useStorage } from "intus-database/AsyncStorage/hooks/useStorage";
import { StorageKeys } from "intus-database/AsyncStorage/StorageKeys";
import { IntusAPIClient } from "intus-api/IntusAPIClient";
import { Loading } from "intus-core/shared/components/Loading";
import { requestPairingCodeRequest } from "intus-api/requests/RequestPairingCodeRequest";

interface TimeLeft {
	minutes: number;
	seconds: number;
}

function Login() {
	const [token, setToken] = useState("");
	const [pairingCode, setPairingCode] = useState<string | null>(null);
	const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
	const [timeLeftInterval, setTimeLeftInterval] = useState<NodeJS.Timer | null>(null);

	const { setIsAuth, setIsLoading, isLoading } = useContext(AppContext);
	const { setItem } = useStorage();

	const API_URL = Constants.expoConfig?.extra?.apiUrl;

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			try {
				const {
					data: { code, expires_at },
				} = await requestPairingCodeRequest();

				setPairingCode(code);
				startTimer(expires_at);

				setIsLoading(false);
			} catch (e) {
				console.error(e);
			}
		})();
	}, []);

	const startTimer = (expiresAt: string) => {
		const now = new Date();
		const expire = new Date(expiresAt);

		const diffMs = Math.abs(+expire - +now);
		let secondsLeft = Math.ceil(diffMs / 1000);

		const interval = setInterval(() => {
			secondsLeft -= 1;
			if (secondsLeft <= 0) {
				clearInterval(interval);
			}
			var minutes = Math.floor(secondsLeft / 60);
			var seconds = secondsLeft - minutes * 60;

			setTimeLeft({
				minutes,
				seconds,
			});
		}, 1000);

		setTimeLeftInterval(interval);
	};

	const login = async (_: GestureResponderEvent) => {
		try {
			await setItem(StorageKeys.API_TOKEN, token);
			IntusAPIClient.setApiToken(token);
			setIsAuth(true);
			timeLeftInterval && clearInterval(timeLeftInterval);
		} catch (e) {
			console.log("Error while saving api token");
		}
	};

	return (
		<View style={style.container}>
			<Text style={[style.label, style.textWhite]}>API_URL: {API_URL}</Text>
			<View style={style.loginCard}>
				{isLoading && <Loading />}
				{pairingCode && (
					<>
						<Text style={[style.label, style.textWhite]}>Pairing code: {pairingCode}</Text>
						<Text style={[style.label, style.textWhite]}>
							Time left: {timeLeft?.minutes}:{timeLeft?.seconds}
						</Text>
						<View style={style.loginButtonWrapper}>
							<Button onPress={login} title="Login"></Button>
						</View>
					</>
				)}
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
