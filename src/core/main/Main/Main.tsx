import React, { useContext, useEffect } from "react";
import { Text, StyleSheet, View, Button } from "react-native";
import { Video } from "expo-av";
import * as FileSystem from "expo-file-system";

import { AppContext } from "intus-core/shared/contexts/AppContext";
import { Login } from "intus-core/auth/components/Login";
import { Loading } from "intus-core/shared/components/Loading";
import { colors } from "intus-styles/Colors";
import { useAuth } from "intus-core/auth/hooks/useAuth";
import { useStorage } from "intus-database/AsyncStorage/hooks/useStorage";
import { StorageKeys } from "intus-database/AsyncStorage/StorageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Main() {
	const { isLoading, isAuth, setIsAuth } = useContext(AppContext);

	const { isAuth: getIsAuth } = useAuth();

	useEffect(() => {
		(async () => {
			const isAlreadyAuth = await getIsAuth();
			isAlreadyAuth && setIsAuth(true);
		})();
	}, []);

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
