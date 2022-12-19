import { isAxiosError } from "axios";

import { displayPostsSyncRequest } from "intus-api/requests/DisplayPostsSyncRequest";
import { MediaWithPosts } from "intus-api/responses/DisplayPostsSyncResponse";
import { downloadHandler } from "../services/DownloadService";

export const useSync = () => {
	const sync = async () => {
		try {
			const {
				data: { data: mediaWithPosts },
			} = await displayPostsSyncRequest();

			const downloadAllMedias = mediaWithPosts.map(media => downloadHandler(media));

			const downloadResult = await Promise.allSettled(downloadAllMedias);

			const successfulDownloads = downloadResult.filter(
				result => result.status === "fulfilled"
			) as PromiseFulfilledResult<MediaWithPosts>[];

			const failedDownloads = downloadResult.filter(
				result => result.status === "rejected"
			) as PromiseRejectedResult[];

			successfulDownloads.forEach(result => {
				console.log("HEEEEERE sucesss", result.value);
				//! Store media and posts on database
			});

			failedDownloads.forEach(result => {
				// We know result.reason is a MediaWithPosts because the downloadHandler() function rejects()
				// with the MediaWithPosts value. Reject value goes into reason property.
				const media: MediaWithPosts = result.reason;
				// TODO do something with the medias that failed to download, probably create a retry button
			});
		} catch (err) {
			if (isAxiosError(err)) {
				console.error("Axios could not make the request");
			}
		}

		console.log("Sync is over");
		return true;
	};

	return {
		sync,
	};
};
