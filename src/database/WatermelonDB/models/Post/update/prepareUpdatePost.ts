import { Post } from "../Post";
import { Post as APIPost } from "intus-api/responses/DisplayPostsSyncResponse";

export const prepareUpdatePost = (post: Post, apiPost: APIPost) =>
	post.prepareUpdate(updatePost => {
		updatePost.post_id = apiPost.id;
		updatePost.media_id = apiPost.media_id;
		updatePost.start_date = apiPost.start_date;
		updatePost.end_date = apiPost.end_date;
		updatePost.start_time = apiPost.start_time;
		updatePost.end_time = apiPost.end_time;
		updatePost.expose_time = apiPost.expose_time;
		updatePost.recurrence = apiPost.recurrence;
		updatePost.showing = false;
	});
