import React, { useContext, useEffect } from "react";
import { StyleSheet, View, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AppContext } from "intus-core/shared/contexts/AppContext";
import { Login } from "intus-core/auth/components/Login";
import { Loading } from "intus-core/shared/components/Loading";
import { colors } from "intus-styles/Colors";
import { useAuth } from "intus-core/auth/hooks/useAuth";
import { StorageKeys } from "intus-database/AsyncStorage/StorageKeys";
import { Carousel } from "../Carousel";
import { createMediasDirectory } from "intus-core/main/services/DownloadService";
import { IntusAPIClient } from "intus-api/IntusAPIClient";

function Main() {
	const { isAuth, setIsAuth, isLoading, setIsLoading } = useContext(AppContext);

	const { getAPIToken } = useAuth();

	useEffect(() => {
		(async () => {
			await createMediasDirectory();
			const apiToken = await getAPIToken();
			if (apiToken) {
				IntusAPIClient.setApiToken(apiToken);
				setIsAuth(true);
			}
			setIsLoading(false);
		})();
	}, []);

	return (
		<View style={style.container}>
			<View>{isAuth ? <Carousel /> : <Login />}</View>
			<Button
				onPress={async () => {
					await AsyncStorage.removeItem(StorageKeys.API_TOKEN);
					setIsAuth(false);
				}}
				title="remove token"
			/>
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
