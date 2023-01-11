import { Q } from "@nozbe/watermelondb";
import { database } from "intus-database/WatermelonDB";
import { Recurrence } from "../Post";
import { PostWithMedia } from "./showablePostsWithMediaCustomQuery";

export interface RecurrentPostWithMedia extends PostWithMedia {
	start_time: string;
	end_time: string;
	recurrence: string;
}

export const allRecurrentPostsQuery = async (): Promise<RecurrentPostWithMedia[]> => {
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
					p.start_time,
					p.end_time,
					p.expose_time,
					p.recurrence,
					m.downloadedPath,
					m.type
				FROM
					posts p
					LEFT JOIN medias m ON m.media_id = p.media_api_id
				WHERE
					m.downloaded = true
					AND p.recurrence IS NOT null
      		`
				)
			)
			.unsafeFetchRaw()) as RecurrentPostWithMedia[]),
	];
};
