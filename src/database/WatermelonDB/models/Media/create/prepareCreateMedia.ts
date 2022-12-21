import { database } from "intus-database/WatermelonDB";
import { MediaWithPosts } from "intus-api/responses/DisplayPostsSyncResponse";
import { Media } from "../Media";

export const prepareCreateMedia = (mediaWithPosts: MediaWithPosts) => {
	return database.get<Media>("medias").prepareCreate(newMedia => {
		newMedia.media_id = mediaWithPosts.id;
		newMedia.filename = mediaWithPosts.filename;
		newMedia.type = mediaWithPosts.type;
		newMedia.downloaded = false;
	});
};
