import { database } from "intus-database/WatermelonDB";
import { findPostByPostId } from "../query/findPostByPostId";

export const destroyPostByPostApiId = async (postApiId: number) => {
	const post = await findPostByPostId(postApiId);
	if (!post) return;
	return await database.write(async () => await post.destroyPermanently());
};
