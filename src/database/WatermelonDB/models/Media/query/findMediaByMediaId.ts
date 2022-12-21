import { Q } from "@nozbe/watermelondb";

import { database } from "intus-database/WatermelonDB";
import { Media } from "../Media";

export const findMediaByMediaId = async (mediaId: number): Promise<Media | null> => {
	let [media] = await database.get<Media>("medias").query(Q.where("media_id", mediaId)).fetch();
	return media || null;
};
