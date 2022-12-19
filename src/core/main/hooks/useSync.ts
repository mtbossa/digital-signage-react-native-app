import { isAxiosError } from "axios";
import * as FileSystem from "expo-file-system";

import { displayPostsSyncRequest } from "intus-api/requests/DisplayPostsSyncRequest";
import { downloadHandler } from "../services/DownloadService";

export const useSync = () => {
	const sync = async () => {
		try {
			console.log(await FileSystem.readDirectoryAsync(FileSystem.documentDirectory!));

			const {
				data: { data: mediaWithPosts },
			} = await displayPostsSyncRequest();

			const downloadAllMedias = mediaWithPosts.map(media => downloadHandler(media));

			const result = await Promise.allSettled(downloadAllMedias);

			const test = result.map(result => {
				if (result.status === "fulfilled") {
					console.log("value: ", result.value);
				} else if (result.status === "rejected") {
					console.log("reason: ", result.reason);
				}
			});

			console.log(await FileSystem.readDirectoryAsync(FileSystem.documentDirectory!));
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
