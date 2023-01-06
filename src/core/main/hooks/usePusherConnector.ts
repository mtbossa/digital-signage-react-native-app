import { Pusher, PusherEvent } from "@pusher/pusher-websocket-react-native";
import { broadcastingAuthRequest } from "intus-api/requests/BroadcastingAuthRequest";
import { Notification } from "intus-api/websockets/Notification";
import { PostCreatedNotification } from "intus-api/websockets/notifications/PostCreated";
import { PostDeletedNotification } from "intus-api/websockets/notifications/PostDeleted";
import { PostUpdatedNotification } from "intus-api/websockets/notifications/PostUpdated";
import { getCurrentDisplayChannelName } from "intus-api/websockets/PrivateChannels";
import { database } from "intus-database/WatermelonDB";
import { createMedia } from "intus-database/WatermelonDB/models/Media/create/createMedia";
import { destroyMedia } from "intus-database/WatermelonDB/models/Media/delete/destroyMedia";
import { findMediaByMediaId } from "intus-database/WatermelonDB/models/Media/query/findMediaByMediaId";
import { createPost } from "intus-database/WatermelonDB/models/Post/create/createPost";
import { destroyPostByPostApiId } from "intus-database/WatermelonDB/models/Post/delete/destroyPost";
import { findPostByPostId } from "intus-database/WatermelonDB/models/Post/query/findPostByPostId";
import { updatePost } from "intus-database/WatermelonDB/models/Post/update/updatePost";
import CarouselService from "../services/CarouselService";
import { mediaDownloadHandler } from "../services/DownloadService";

const handleAuthorization = async (channelName: string, socketId: string) => {
	try {
		const {
			data: { auth },
		} = await broadcastingAuthRequest(channelName, socketId);

		return {
			auth,
		};
	} catch (e) {
		// TODO do something if can't authenticate
		console.error("ERROR HERE ON AUTHORIZER");
		return {
			auth: "an error occcured",
		};
	}
};

export const usePusherConnector = () => {
	const connect = async () => {
		const apiKey = "67f6f5d1618646d3ea95";
		const cluster = "sa1";

		const pusher = Pusher.getInstance();

		try {
			await pusher.init({
				apiKey,
				cluster,
				authEndpoint: "http://192.168.1.99/api/broadcasting/auth",
				onAuthorizer: handleAuthorization,
			});

			await pusher.subscribe({
				channelName: getCurrentDisplayChannelName(),
				onEvent: handleEvent,
				onSubscriptionSucceeded: data => {
					console.log("onSubscriptionSucceeded");
				},
			});

			await pusher.connect();
		} catch (e) {
			console.log("Error while connecting", e);
		}
	};

	const handleEvent = (event: PusherEvent) => {
		const data = JSON.parse(event.data) as Notification;

		if (data.type === "App\\Notifications\\DisplayPost\\PostCreated") {
			handlePostCreatedNotification(data as PostCreatedNotification);
		}

		if (data.type === "App\\Notifications\\DisplayPost\\PostDeleted") {
			handlePostDeletedNotification(data as PostDeletedNotification);
		}

		if (data.type === "App\\Notifications\\DisplayPost\\PostUpdated") {
			handlePostUpdatedNotification(data as PostUpdatedNotification);
		}
	};

	const handlePostCreatedNotification = async (
		postCreatedNotification: PostCreatedNotification
	) => {
		const { post } = postCreatedNotification;
		const localPostData = { ...post, media_id: post.media.id, recurrence: post.recurrence };

		const foundMedia = await findMediaByMediaId(post.media.id);

		if (foundMedia) {
			await createPost(localPostData, foundMedia.id);
		} else {
			const createdMedia = await createMedia(post.media);
			try {
				const { downloadedPath } = await mediaDownloadHandler(createdMedia);
				await createdMedia.setDownloadedPath(downloadedPath);
				await createPost(localPostData, createdMedia.id);
			} catch {
				// TODO do something if cant download media
			}
		}
	};

	const handlePostDeletedNotification = async (
		postDeletedNotification: PostDeletedNotification
	) => {
		const { canDeleteMedia, media_id, post_id } = postDeletedNotification;
		await destroyPostByPostApiId(post_id);
		if (canDeleteMedia) {
			await destroyMedia(media_id);
		}
	};

	const handlePostUpdatedNotification = async (
		postUpdatedNotification: PostUpdatedNotification
	) => {
		const { post } = postUpdatedNotification;
		const localPostData = { ...post, media_id: post.media.id, recurrence: post.recurrence };

		const foundMedia = await findMediaByMediaId(post.media.id);
		const foundPost = await findPostByPostId(post.id);

		if (foundMedia) {
			await updatePost(foundPost!, localPostData, foundMedia.id);
		} else {
			const createdMedia = await createMedia(post.media);
			try {
				const { downloadedPath } = await mediaDownloadHandler(createdMedia);
				await createdMedia.setDownloadedPath(downloadedPath);
				await updatePost(foundPost!, localPostData, createdMedia.id);
			} catch {
				// TODO do something if cant download media
			}
		}

		CarouselService.removePostFromCarousel(foundPost!.post_api_id);
	};

	return {
		connect,
	};
};
