import { findPostByPostId } from "../query/findPostByPostId";

export const destroyPostByPostApiId = async (postApiId: number) => {
	const post = await findPostByPostId(postApiId);
	post!.destroyPermanently();
};
