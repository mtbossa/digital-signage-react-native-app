import { database } from "intus-database/WatermelonDB";
import { Post as APIPost } from "intus-api/responses/DisplayPostsSyncResponse";
import { Post } from "../Post";

export const createPost = async (apiPost: APIPost) => {
	return await database.write(async () => {
		const createdPost = await database.get<Post>("posts").create(newPost => {
			newPost.post_id = apiPost.id;
			newPost.media_id = apiPost.media_id;
			newPost.start_date = apiPost.start_date;
			newPost.end_date = apiPost.end_date;
			newPost.start_time = apiPost.start_time;
			newPost.end_time = apiPost.end_time;
			newPost.expose_time = apiPost.expose_time;
			newPost.recurrence = apiPost.recurrence;
			newPost.showing = false;
		});

		console.log("New post created: ", createdPost.asModel);

		return createdPost;
	});
};
