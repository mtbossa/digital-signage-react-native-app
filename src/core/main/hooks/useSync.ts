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
import { getAllApiPostsIds } from "intus-database/WatermelonDB/models/Post/query/getAllApiPostsIds";
import { destroyManyMedias } from "intus-database/WatermelonDB/models/Media/delete/destroyManyMedias";
import { destroyManyPosts } from "intus-database/WatermelonDB/models/Post/delete/destroyManyPosts";

export const useSync = () => {
	const sync = async () => {
		try {
			const postsApiIds = await getAllApiPostsIds();
			const response = await displayPostsSyncRequest(postsApiIds);

			await deleteMedias(response.data.deletable_medias_ids);
			await deletePosts(response.data.deletable_posts_ids);
			await createAndUpdateMedias(response.data.available);
			await checkAndDownloadMediasFiles();
			await createAndUpdatePosts(response.data.available);
		} catch (err) {
			console.log(err);
			if (isAxiosError(err)) {
				console.error("Axios could not make the request");
			}
		}

		console.log("Sync is over");
		return true;
	};

	const deleteMedias = async (deletableMediasIds: number[]) => {
		if (deletableMediasIds.length === 0) {
			return;
		}
		await destroyManyMedias(deletableMediasIds);
	};

	const deletePosts = async (deletablePostsIds: number[]) => {
		if (deletablePostsIds.length === 0) {
			return;
		}
		await destroyManyPosts(deletablePostsIds);
	};

	const createAndUpdateMedias = async (mediasWithPosts: MediaWithPosts[]) => {
		const mediasBatch: Media[] = [];

		for (const mediaWithPosts of mediasWithPosts) {
			const media = await findMediaByMediaId(mediaWithPosts.id);
			if (media) {
				mediasBatch.push(prepareUpdateMedia(media, mediaWithPosts));
			} else {
				mediasBatch.push(prepareCreateMedia(mediaWithPosts));
			}
		}

		await database.write(() => database.batch(...mediasBatch));
	};

	const checkAndDownloadMediasFiles = async () => {
		const allMedias = await database.get<Media>("medias").query().fetch();
		const succesfullDownloadsNew: {
			media: Media;
			downloadedPath: string;
		}[] = [];
		const failedDownloadsNew: any[] = [];

		for (const media of allMedias) {
			try {
				const result = await mediaDownloadHandler(media);
				succesfullDownloadsNew.push(result);
			} catch (e) {
				failedDownloadsNew.push(e);
			}
		}

		const batchDownloadUpdates = succesfullDownloadsNew.map(result => {
			const { media, downloadedPath } = result;
			return media.prepareUpdate(updateMedia => {
				updateMedia.downloaded = true;
				updateMedia.downloadedPath = downloadedPath;
			});
		});

		await database.write(() => database.batch(...batchDownloadUpdates));
	};

	const createAndUpdatePosts = async (mediasWithPosts: MediaWithPosts[]) => {
		const postBatches: Post[] = [];

		for (const mediaWithPosts of mediasWithPosts) {
			const media = await findMediaByMediaId(mediaWithPosts.id);
			if (!media) {
				// TODO do something if media is not created
				continue;
			}

			for (const apiPost of mediaWithPosts.posts) {
				const post = await findPostByPostId(apiPost.id);
				if (post) {
					postBatches.push(prepareUpdatePost(post, apiPost, media.id));
				} else {
					postBatches.push(prepareCreatePost(apiPost, media.id));
				}
			}
		}

		await database.write(() => database.batch(...postBatches));
	};

	return {
		sync,
	};
};
