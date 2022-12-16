import { useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AppContext } from "intus-core/shared/contexts/AppContext";
import { StorageKeys } from "../StorageKeys";

export const useStorage = () => {
	const { setIsLoading } = useContext(AppContext);

	const setItem = async (key: StorageKeys, value: string) => {
		setIsLoading(true);
		await AsyncStorage.setItem(key, value);
		setIsLoading(false);
	};
	
	const getItem = async (key: StorageKeys) => {
		setIsLoading(true);
		const item = await AsyncStorage.getItem(key);
		setIsLoading(false);
		
		return item;
	};

	return {
		setItem,
		getItem
	};
};
