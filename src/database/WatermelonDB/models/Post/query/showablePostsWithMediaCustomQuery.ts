import { Q } from "@nozbe/watermelondb";
import { database } from "intus-database/WatermelonDB";
import { Media } from "../../Media/Media";

export interface PostWithMedia {
	id: string;
	post_api_id: number;
	expose_time: number;
	downloadedPath: string;
	type: "video" | "image";
}

export const showablePostsWithMediaCustomQuery = async (
	currentShowingPostsIds: number[]
): Promise<PostWithMedia[]> => {
	// We return a copy of the array because WatermelonDB docs states that: ~
	// "⚠️ You MUST NOT mutate returned objects. Doing so will corrupt the database."
	// Ref: https://nozbe.github.io/WatermelonDB/Query.html#unsafe-fetch-raw

	return [
		...((await database
			.get("posts")
			.query(
				// This query handles all cases, when start_time < or > or = to then end_time
				Q.unsafeSqlQuery(
					`
					SELECT
					p.id,
					p.post_api_id,
					p.expose_time,
					m.downloadedPath,
					m.type
				FROM
					posts p
					LEFT JOIN medias m ON m.media_id = p.media_api_id
				WHERE
					p.post_api_id NOT IN ()
					AND m.downloaded = true
					AND p.start_date <= date('now')
					AND (
						CASE
							WHEN p.start_time < p.end_time THEN (
								p.start_time <= time('now')
								AND p.end_time > time('now')
								AND p.end_date >= date('now')
							)
							WHEN p.start_time > p.end_time THEN (
								P.end_date > date('now')
								AND time('now') NOT BETWEEN p.end_time
								AND p.start_time
							)
							ELSE (1)
						END
					)
      		`
				)
			)
			.unsafeFetchRaw()) as PostWithMedia[]),
	];
};

export const removablePostsCustomQuery = async (
	currentShowingPostsIds: number[]
): Promise<Pick<PostWithMedia, "id" | "post_api_id">[]> => {
	// We return a copy of the array because WatermelonDB docs states that: ~
	// "⚠️ You MUST NOT mutate returned objects. Doing so will corrupt the database."
	// Ref: https://nozbe.github.io/WatermelonDB/Query.html#unsafe-fetch-raw

	return [
		...((await database
			.get("posts")
			.query(
				Q.unsafeSqlQuery(
					`
					SELECT
						p.id,
						p.post_api_id
					FROM
						posts p
					WHERE
						p.post_api_id IN (${currentShowingPostsIds.join(",")})
						AND (
							start_date > date('now')
							OR p.end_date < date('now')
							OR p.start_time > time('now')
							OR p.end_time < time('now')
						)
					`
				)
			)
			.unsafeFetchRaw()) as PostWithMedia[]),
	];
};
