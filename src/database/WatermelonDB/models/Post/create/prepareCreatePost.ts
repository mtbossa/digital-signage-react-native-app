import { database } from "intus-database/WatermelonDB";
import { Post as APIPost } from "intus-api/responses/DisplayPostsSyncResponse";
import { Post } from "../Post";

export const prepareCreatePost = (apiPost: APIPost, localMediaId: string) => {
	return database.get<Post>("posts").prepareCreate(newPost => {
		newPost.media_id = localMediaId;
		newPost.post_api_id = apiPost.id;
		newPost.media_api_id = apiPost.media_id;
		newPost.start_date = apiPost.start_date;
		newPost.end_date = apiPost.end_date;
		newPost.start_time = apiPost.start_time;
		newPost.end_time = apiPost.end_time;
		newPost.expose_time = apiPost.expose_time;
		newPost.recurrence = apiPost.recurrence;
		newPost.showing = false;
	});
};
