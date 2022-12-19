import { isAxiosError } from "axios";
import { Q } from "@nozbe/watermelondb";

import { displayPostsSyncRequest } from "intus-api/requests/DisplayPostsSyncRequest";
import { MediaWithPosts } from "intus-api/responses/DisplayPostsSyncResponse";
import { database } from "intus-database/WatermelonDB";
import { Media } from "intus-database/WatermelonDB/models/Media/Media";
import { Post } from "intus-database/WatermelonDB/models/Post";
import { downloadHandler, mediaExists } from "../services/DownloadService";
import { createMedia } from "intus-database/WatermelonDB/models/Media/create/createMedia";

export const useSync = () => {
	const sync = async () => {
		try {
			const {
				data: { data: mediaWithPosts },
			} = await displayPostsSyncRequest();

			const result = await Promise.allSettled(
				mediaWithPosts.map(async mediaWithPosts => {
					const [media] = await database
						.get<Media>("medias")
						.query(Q.where("media_id", mediaWithPosts.id))
						.fetch();

					if (media) {
						console.log("Media exists: ", media.media_id);
					} else {
						console.log("Media doesnt exists");
						// TODO create error classes and thrown them inside these functions
						// so we can handle them properly in the result array. Ex.: inside downloadHandler
						// throw a DownloadFailedError class with the media id that failed
						const createdMedia = await createMedia(mediaWithPosts);
						const downloadedMedia = await downloadHandler(mediaWithPosts);
						await createdMedia.setDownloadedPath(downloadedMedia.downloadedPath);
					}
				})
			);

			result.forEach(result => {
				if (result.status === "rejected") {
					console.log("Reason: ", result.reason);
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
