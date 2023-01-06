import { database } from "intus-database/WatermelonDB";
import { Post as APIPost } from "intus-api/responses/DisplayPostsSyncResponse";
import { Post } from "../Post";
import CarouselService from "intus-core/main/services/CarouselService";

interface UpdatePost {
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

export const updatePost = async (post: Post, apiPost: UpdatePost, localMediaId: string) => {
	return await database.write(async () => {
		const updatedPost = await post.update(updatePost => {
			updatePost.post_api_id = apiPost.id;
			updatePost.media_api_id = apiPost.media_id;
			updatePost.media_id = localMediaId;
			updatePost.start_date = apiPost.start_date;
			updatePost.end_date = apiPost.end_date;
			updatePost.start_time = apiPost.start_time;
			updatePost.end_time = apiPost.end_time;
			updatePost.expose_time = apiPost.expose_time;
			updatePost.recurrence = apiPost.recurrence ?? null;
			updatePost.showing = false;
		});

		console.log("Post updated: ", updatedPost);

		// When a post is updated, always remove from carousel so get updated values next time
		CarouselService.removePostFromCarousel(apiPost.id);

		return updatedPost;
	});
};
