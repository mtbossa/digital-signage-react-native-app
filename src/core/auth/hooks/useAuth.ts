import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStorage } from "intus-database/AsyncStorage/hooks/useStorage";
import { StorageKeys } from "intus-database/AsyncStorage/StorageKeys";

export const useAuth = () => {
	const { getItem } = useStorage();

	const isAuth = async () => {
		const apiKey = await getItem(StorageKeys.API_TOKEN);
		return typeof apiKey === "string";
	};

	return {
		isAuth,
	};
};
