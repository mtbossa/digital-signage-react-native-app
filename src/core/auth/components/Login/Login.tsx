import React, { useContext, useState, useEffect } from "react";
import { Button, GestureResponderEvent, StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";

import { AppContext } from "intus-core/shared/contexts/AppContext";
import { useStorage } from "intus-database/AsyncStorage/hooks/useStorage";
import { StorageKeys } from "intus-database/AsyncStorage/StorageKeys";
import { IntusAPIClient } from "intus-api/IntusAPIClient";
import { Loading } from "intus-core/shared/components/Loading";
import { requestPairingCodeRequest } from "intus-api/requests/RequestPairingCodeRequest";
import { getAPITokenRequest } from "intus-api/requests/GetAPITokenRequest";
import axios from "axios";
import { Messages } from "intus-messages/Messages";

interface TimeLeft {
	minutes: number;
	seconds: number;
}

function Login() {
	const [warningMessage, setWarningMessage] = useState("");
	const [isPairDisabled, setIsPairDisabled] = useState(true);
	const [isRequestPairingCodeDisabled, setIsRequestPairingCodeDisabled] = useState(true);
	const [pairingCode, setPairingCode] = useState<string | null>(null);
	const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
	const [timeLeftInterval, setTimeLeftInterval] = useState<NodeJS.Timer | null>(null);

	const { setIsAuth, setIsLoading, isLoading } = useContext(AppContext);
	const { setItem } = useStorage();

	const API_URL = Constants.expoConfig?.extra?.apiUrl;
	const APP_ENV = Constants.expoConfig?.extra?.appEnv;

	useEffect(() => {
		(async () => {
			generatePairingCode();
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
				setIsRequestPairingCodeDisabled(false);
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

	const pair = async (_: GestureResponderEvent) => {
		try {
			setWarningMessage("");
			if (!pairingCode) return;

			const {
				data: { api_token, display_id },
			} = await getAPITokenRequest(pairingCode!);

			timeLeftInterval && clearInterval(timeLeftInterval);

			await setItem(StorageKeys.API_TOKEN, api_token);
			await setItem(StorageKeys.DISPLAY_ID, String(display_id));

			IntusAPIClient.setApiToken(api_token);

			setIsAuth(true);
		} catch (e) {
			if (axios.isAxiosError(e)) {
				if (e.response?.status === 404) {
					// Code doesn't exists anymore
					handlePairCodeNotFound();
				} else if (e.response?.status === 422) {
					// Display not created yet
					handleDisplayNotCreated();
				} else {
					setWarningMessage(Messages.TRY_AGAIN_LATER);
				}
			} else {
				setWarningMessage(Messages.TRY_AGAIN_LATER);
			}
		}
	};

	const handlePairCodeNotFound = () => {
		setWarningMessage(Messages.GENERATE_NEW_PAIR_CODE);
		setIsRequestPairingCodeDisabled(false);
		setPairingCode(null);
		setTimeLeft(null);
		timeLeftInterval && clearInterval(timeLeftInterval);
	};

	const handleDisplayNotCreated = () => {
		setIsPairDisabled(true);
		setWarningMessage(Messages.DISPLAY_NOT_CREATED);
		setTimeout(() => {
			setIsPairDisabled(false);
			setWarningMessage("");
		}, 5000);
	};

	const generatePairingCode = async () => {
		setIsLoading(true);
		setWarningMessage("");
		setIsRequestPairingCodeDisabled(true);

		try {
			const {
				data: { code, expires_at },
			} = await requestPairingCodeRequest();

			setPairingCode(code);
			startTimer(expires_at);
		} catch (e) {
			setWarningMessage(Messages.TRY_AGAIN_LATER);
			setIsRequestPairingCodeDisabled(false);
		} finally {
			setIsPairDisabled(false);
			setIsLoading(false);
		}
	};

	return (
		<View style={style.container}>
			{APP_ENV === "development" && (
				<Text style={[style.label, style.textWhite]}>API_URL: {API_URL}</Text>
			)}
			<View style={style.pairCard}>
				{isLoading && <Loading />}
				{pairingCode && timeLeft && (
					<>
						<Text style={[style.label, style.textWhite]}>Código de pareamento: {pairingCode}</Text>
						<Text style={[style.label, style.textWhite]}>
							Tempo restante: {timeLeft?.minutes}:{timeLeft?.seconds}
						</Text>
					</>
				)}
				{warningMessage && <Text style={[style.label, style.textWhite]}>{warningMessage}</Text>}
				<View style={style.pairButtonWrapper}>
					<Button onPress={pair} disabled={isPairDisabled} title="Parear"></Button>
				</View>
				<View style={style.pairButtonWrapper}>
					<Button
						onPress={() => generatePairingCode()}
						disabled={isRequestPairingCodeDisabled}
						title="Gerar novo código"
					></Button>
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
	pairCard: {
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
	pairButtonWrapper: {
		marginTop: 10,
	},
});

export default Login;
