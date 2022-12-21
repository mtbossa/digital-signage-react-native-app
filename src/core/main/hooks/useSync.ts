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
					return media.prepareUpdate(updateMedia => {
						updateMedia.media_id = mediaWithPosts.id;
						updateMedia.filename = mediaWithPosts.filename;
						updateMedia.type = mediaWithPosts.type;
					});
				} else {
					return database.get<Media>("medias").prepareCreate(newMedia => {
						newMedia.media_id = mediaWithPosts.id;
						newMedia.filename = mediaWithPosts.filename;
						newMedia.type = mediaWithPosts.type;
						newMedia.downloaded = false;
					});
				}
			})
		);

		const mediasBatch = results.map(result => {
			if (result.status === "fulfilled" && result.value) {
				return result.value;
			}
		}) as Media[];

		console.log({ mediasBatch });

		await database.write(() => database.batch(...mediasBatch));

		console.log("FINISH BATCHING MEDIAS");
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

		const succesfullDownloadsResult = results.filter(
			result => result.status === "fulfilled" && result.value
		) as PromiseFulfilledResult<{
			media: Media;
			downloadedPath: string;
		}>[];

		const batchDownloadUpdates = succesfullDownloadsResult.map(result => {
			const { media, downloadedPath } = result.value;
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

				const postsBatch = resultsPosts.map(result => {
					if (result.status === "fulfilled" && result.value) {
						return result.value;
					}
				}) as Post[];

				return postsBatch;
			})
		);

		const batches = results.map(result => {
			if (result.status === "fulfilled" && result.value) {
				return result.value;
			}
		}) as Post[][];

		console.log({ batches });

		await database.write(() => database.batch(...batches.flat()));

		console.log("FINISH BATCHING POSTS");
	};

	return {
		sync,
	};
};
