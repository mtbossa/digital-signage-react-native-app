import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStorage } from "intus-database/AsyncStorage/hooks/useStorage";
import { StorageKeys } from "intus-database/AsyncStorage/StorageKeys";

export const useAuth = () => {
	const { getItem } = useStorage();

	const getAPIToken = async () => {
		const apiKey = await getItem(StorageKeys.API_TOKEN);
		return apiKey;
	};

	return {
		getAPIToken
	};
};
