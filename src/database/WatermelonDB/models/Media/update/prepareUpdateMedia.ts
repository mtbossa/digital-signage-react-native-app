import { Media } from "../Media";
import { MediaWithPosts } from "intus-api/responses/DisplayPostsSyncResponse";

export const prepareUpdateMedia = (media: Media, mediaWithPosts: MediaWithPosts) =>
	media.prepareUpdate(updateMedia => {
		updateMedia.media_id = mediaWithPosts.id;
		updateMedia.filename = mediaWithPosts.filename;
		updateMedia.type = mediaWithPosts.type;
	});
