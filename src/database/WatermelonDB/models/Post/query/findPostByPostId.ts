import { Q } from "@nozbe/watermelondb";

import { database } from "intus-database/WatermelonDB";
import { Post } from "../Post";

export const findPostByPostId = async (postId: number): Promise<Post | null> => {
	let [post] = await database.get<Post>("posts").query(Q.where("post_api_id", postId)).fetch();
	return post || null;
};
