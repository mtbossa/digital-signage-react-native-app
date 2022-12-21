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
import Model from "@nozbe/watermelondb/Model";
import { MediaWithPosts } from "intus-api/responses/DisplayPostsSyncResponse";
import { prepareUpdatePost } from "intus-database/WatermelonDB/models/Post/update/prepareUpdatePost";
import { prepareCreatePost } from "intus-database/WatermelonDB/models/Post/create/prepareCreatePost";
import { prepareUpdateMedia } from "intus-database/WatermelonDB/models/Media/update/prepareUpdateMedia";
import { prepareCreateMedia } from "intus-database/WatermelonDB/models/Media/create/prepareCreateMedia";
import { getFulfilledValues } from "intus-core/shared/helpers/functions/getFulfilledValues";

export const useSync = () => {
	const sync = async () => {
		try {
			const {
				data: { data: mediasWithPosts },
			} = await displayPostsSyncRequest();

			await createAndUpdateMedias(mediasWithPosts);
			await checkAndDownloadMediasFiles();
			await createAndUpdatePosts(mediasWithPosts);

			// // TODO compare the returned medias from sync request with the currently stored medias
			// // and delete the ones that didn't come with this request, since it means that they're expired.
		} catch (err) {
			if (isAxiosError(err)) {
				console.error("Axios could not make the request");
			}
		}

		console.log("Sync is over");
		return true;
	};

	const createAndUpdateMedias = async (mediasWithPosts: MediaWithPosts[]) => {
		const results = await Promise.allSettled(
			mediasWithPosts.map(async mediaWithPosts => {
				const media = await findMediaByMediaId(mediaWithPosts.id);
				if (media) {
					return prepareUpdateMedia(media, mediaWithPosts);
				} else {
					return prepareCreateMedia(mediaWithPosts);
				}
			})
		);

		const mediasBatch = getFulfilledValues(results);

		await database.write(() => database.batch(...mediasBatch));
	};

	const checkAndDownloadMediasFiles = async () => {
		const allMedias = await database.get<Media>("medias").query().fetch();

		const results = await Promise.allSettled(
			allMedias.map(async media => {
				return await mediaDownloadHandler(media);
			})
		);

		const failedDownloads = results.filter(
			result => result.status === "rejected"
		) as PromiseRejectedResult[];

		// TODO do something with failed downloads;

		const succesfullDownloads = getFulfilledValues(results);

		const batchDownloadUpdates = succesfullDownloads.map(result => {
			const { media, downloadedPath } = result;
			return media.prepareUpdate(updateMedia => {
				updateMedia.downloaded = true;
				updateMedia.downloadedPath = downloadedPath;
			});
		});

		await database.write(() => database.batch(...batchDownloadUpdates));
	};

	const createAndUpdatePosts = async (mediasWithPosts: MediaWithPosts[]) => {
		const results = await Promise.allSettled(
			mediasWithPosts.map(async mediaWithPosts => {
				const media = await findMediaByMediaId(mediaWithPosts.id);
				if (!media) {
					throw new Error("Media not created");
				}

				const resultsPosts = await Promise.allSettled(
					mediaWithPosts.posts.map(async apiPost => {
						const post = await findPostByPostId(apiPost.id);
						if (post) {
							return prepareUpdatePost(post, apiPost);
						} else {
							return prepareCreatePost(apiPost);
						}
					})
				);

				const postsBatch = getFulfilledValues(resultsPosts);

				return postsBatch;
			})
		);

		const batches = getFulfilledValues(results);

		await database.write(() => database.batch(...batches.flat()));
	};

	return {
		sync,
	};
};
