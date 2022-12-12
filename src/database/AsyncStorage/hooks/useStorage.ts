import { useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AppContext } from "intus-contexts/AppContext";
import { StorageKeys } from "../StorageKeys";

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
