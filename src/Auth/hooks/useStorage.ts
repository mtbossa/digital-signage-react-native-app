import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";
import { AppContext } from "../../contexts/AppContext";
import { StorageKeys } from "../../database/AsyncStorage/StorageKeys";

export const useStorage = () => {
	const { setIsLoading } = useContext(AppContext);

	const setItem = async (key: StorageKeys, value: string) => {
		setIsLoading(true);
		await AsyncStorage.setItem(key, value);
		setIsLoading(false);
	};

	return {
		setItem,
	};
};
