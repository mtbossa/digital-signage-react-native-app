import * as FileSystem from "expo-file-system";
import { getFulfilledValues } from "intus-core/shared/helpers/functions/getFulfilledValues";
import { database } from "intus-database/WatermelonDB";
export const destroyManyPosts = async (postsApiIds: number[]) => {
	if (postsApiIds.length === 0) {
		// This ensures we never call the below SQL with IN (), since it would delete every post.
		return;
	}
	const postsApiIdsJoined = postsApiIds.join(",");
	await database.write(
		async () =>
			// sqlite:
			await database.adapter.unsafeExecute({
				sqls: [[`DELETE FROM posts WHERE post_api_id IN (${postsApiIdsJoined})`, []]],
			})
	);
};
