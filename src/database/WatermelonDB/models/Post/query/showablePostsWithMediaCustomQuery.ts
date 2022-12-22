import { Q } from "@nozbe/watermelondb";
import { database } from "intus-database/WatermelonDB";
import { Media } from "../../Media/Media";

export interface PostWithMedia {
	id: string;
	post_api_id: number;
	expose_time: number;
	filename: string;
	type: Pick<Media, "type">;
}

export const showablePostsWithMediaCustomQuery = async (): Promise<PostWithMedia[]> => {
	return database
		.get("posts")
		.query(
			Q.unsafeSqlQuery(
				`
        SELECT
        p.id, p.post_api_id, p.expose_time, m.filename, m.type
        FROM
          posts p
          LEFT JOIN medias m ON m.media_id = p.media_api_id
        WHERE
          START_DATE <= date('now')
          AND p.end_date >= date('now')
          AND p.start_time <= time('now')
          AND p.end_time > time('now')
          AND m.downloaded = true
      `
			)
		)
		.unsafeFetchRaw() as Promise<PostWithMedia[]>;
};
