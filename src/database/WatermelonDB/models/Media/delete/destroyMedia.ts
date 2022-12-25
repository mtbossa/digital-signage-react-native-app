import * as FileSystem from "expo-file-system";
import { database } from "intus-database/WatermelonDB";

import { findMediaByMediaId } from "../query/findMediaByMediaId";

export const destroyMedia = async (mediaApiId: number) => {
	const media = await findMediaByMediaId(mediaApiId);
	await FileSystem.deleteAsync(media!.downloadedPath ?? "", { idempotent: true });
	return await database.write(async () => await media!.destroyPermanently());
};
