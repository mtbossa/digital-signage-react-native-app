import { Q } from "@nozbe/watermelondb";

import { database } from "intus-database/WatermelonDB";

export const getAllApiPostsIds = async (): Promise<number[]> => {
	return [
		...(
			(await database
				.get("posts")
				.query(
					// This query handles all cases, when start_time < or > or = to then end_time
					Q.unsafeSqlQuery(
						`
					SELECT
					  post_api_id
				  FROM
					  posts
      		`
					)
				)
				.unsafeFetchRaw()) as { post_api_id: number }[]
		).map(post => post.post_api_id),
	];
};
