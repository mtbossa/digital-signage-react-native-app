import * as FileSystem from "expo-file-system";

import { findMediaByMediaId } from "../query/findMediaByMediaId";

export const destroyMedia = async (mediaApiId: number) => {
	const media = await findMediaByMediaId(mediaApiId);
	await FileSystem.deleteAsync(media!.downloadedPath ?? "", { idempotent: true });
	media!.destroyPermanently();
};
