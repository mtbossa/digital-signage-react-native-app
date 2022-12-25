import { database } from "intus-database/WatermelonDB";
import { Post } from "../Post";

interface CreatePost {
	id: number;
	start_time: string;
	end_time: string;
	start_date: string | null;
	end_date: string | null;
	expose_time: number | null;
	media_id: number;
	recurrence?: Recurrence;
}

interface Recurrence {
	isoweekday: number | null;
	day: number | null;
	month: number | null;
}

export const createPost = async (createPostData: CreatePost, localMediaId: string) => {
	return await database.write(async () => {
		const createdPost = await database.get<Post>("posts").create(newPost => {
			newPost.post_api_id = createPostData.id;
			newPost.media_api_id = createPostData.media_id;
			newPost.start_date = createPostData.start_date;
			newPost.end_date = createPostData.end_date;
			newPost.start_time = createPostData.start_time;
			newPost.end_time = createPostData.end_time;
			newPost.expose_time = createPostData.expose_time;
			newPost.recurrence = createPostData.recurrence ?? null;
			newPost.showing = false;
			newPost.media_id = localMediaId;
		});

		return createdPost;
	});
};
