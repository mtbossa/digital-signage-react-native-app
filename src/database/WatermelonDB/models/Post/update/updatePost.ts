import { database } from "intus-database/WatermelonDB";
import { Post as APIPost } from "intus-api/responses/DisplayPostsSyncResponse";
import { Post } from "../Post";

export const updatePost = async (post: Post, apiPost: APIPost) => {
	return await database.write(async () => {
		const updatedPost = await post.update(updatePost => {
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

		console.log("Post updated: ", updatedPost);

		return updatedPost;
	});
};
