import { isAxiosError } from "axios";
import { Q } from "@nozbe/watermelondb";

import { displayPostsSyncRequest } from "intus-api/requests/DisplayPostsSyncRequest";
import { database } from "intus-database/WatermelonDB";
import { Media } from "intus-database/WatermelonDB/models/Media/Media";
import { mediaDownloadHandler, mediaExists } from "../services/DownloadService";
import { createMedia } from "intus-database/WatermelonDB/models/Media/create/createMedia";
import { DownloadFailedError } from "intus-core/shared/helpers/errors/DownloadFailedError";
import { createPost } from "intus-database/WatermelonDB/models/Post/create/createPost";
import { Post } from "intus-database/WatermelonDB/models/Post/Post";
import { updatePost } from "intus-database/WatermelonDB/models/Post/update/updatePost";
import { findPostByPostId } from "intus-database/WatermelonDB/models/Post/query/findPostByPostId";
import { findMediaByMediaId } from "intus-database/WatermelonDB/models/Media/query/findMediaByMediaId";

export const useSync = () => {
	const sync = async () => {
		try {
			const {
				data: { data: mediasWithPosts },
			} = await displayPostsSyncRequest();

			// TODO compare the returned medias from sync request with the currently stored medias
			// and delete the ones that didn't come with this request, since it means that they're expired.

			const result = await Promise.allSettled(
				mediasWithPosts.map(async mediaWithPosts => {
					const media = await findMediaByMediaId(mediaWithPosts.id);

					if (media) {
						const mediaFileExists = await mediaExists(media.filename);

						// This is a insurance that the media file and data is always correct, because
						// it could happen that the media download failed but downloaded property is true,
						// and vice-versa
						if (!media.downloaded && mediaFileExists.exists) {
							await media.setDownloadedPath(mediaFileExists.path);
						} else if (!mediaFileExists.exists) {
							await mediaDownloadHandler(media);
						}
					} else {
						const createdMedia = await createMedia(mediaWithPosts);
						await mediaDownloadHandler(createdMedia);
					}

					const postsResult = await Promise.allSettled(
						mediaWithPosts.posts.map(async apiPost => {
							const post = await findPostByPostId(apiPost.id);

							if (post) {
								await updatePost(post, apiPost);
							} else {
								await createPost(apiPost);
							}
						})
					);
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
