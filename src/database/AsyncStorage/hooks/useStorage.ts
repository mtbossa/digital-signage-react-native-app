import { useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AppContext } from "intus-core/shared/contexts/AppContext";
import { StorageKeys } from "../StorageKeys";

export const useStorage = () => {
	const setItem = async (key: StorageKeys, value: string) => {
		await AsyncStorage.setItem(key, value);
	};

	const getItem = async (key: StorageKeys) => {
		const item = await AsyncStorage.getItem(key);
		return item;
	};

	return {
		setItem,
		getItem,
	};
};
