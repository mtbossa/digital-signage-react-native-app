import { isAxiosError } from "axios";
import { displayPostsSyncRequest } from "intus-api/requests/DisplayPostsSyncRequest";

export const useSync = () => {
	const sync = async () => {
		try {
			const {
				data: { data: mediaWithPosts },
			} = await displayPostsSyncRequest();
		} catch (err) {
			if (isAxiosError(err)) {
				console.error("Could not sync with backend");
			}
		}

		console.log("Sync is over");
		return true;
	};

	return {
		sync,
	};
};
