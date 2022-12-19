import { isAxiosError } from "axios";
import { Q } from "@nozbe/watermelondb";

import { displayPostsSyncRequest } from "intus-api/requests/DisplayPostsSyncRequest";
import { database } from "intus-database/WatermelonDB";
import { Media } from "intus-database/WatermelonDB/models/Media/Media";
import { mediaDownloadHandler, mediaExists } from "../services/DownloadService";
import { createMedia } from "intus-database/WatermelonDB/models/Media/create/createMedia";
import { DownloadFailedError } from "intus-core/shared/helpers/errors/DownloadFailedError";

export const useSync = () => {
	const sync = async () => {
		try {
			const {
				data: { data: mediaWithPosts },
			} = await displayPostsSyncRequest();

			// TODO compare the returned medias from sync request with the currently stored medias
			// and delete the ones that didn't come with this request, since it means that they're expired.

			const result = await Promise.allSettled(
				mediaWithPosts.map(async mediaWithPosts => {
					const [media] = await database
						.get<Media>("medias")
						.query(Q.where("media_id", mediaWithPosts.id))
						.fetch();

					if (media) {
						if (!media.downloaded && !mediaExists(media.filename)) {
							const updatedMedia = await mediaDownloadHandler(media);
							console.log("Local saved media", { updatedMedia });
						}
					} else {
						const createdMedia = await createMedia(mediaWithPosts);
						const updatedMedia = await mediaDownloadHandler(createdMedia);
						console.log("Newly created media", { updatedMedia });
					}
				})
			);

			result.forEach(result => {
				if (result.status === "rejected") {
					if (result.reason instanceof DownloadFailedError) {
						// TODO do something if download failed
						console.log("Is object", result.reason.mediaId);
					}
				}
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
