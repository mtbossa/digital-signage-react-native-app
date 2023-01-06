import * as FileSystem from "expo-file-system";
import { getFulfilledValues } from "intus-core/shared/helpers/functions/getFulfilledValues";
import { database } from "intus-database/WatermelonDB";
import { findMediaByMediaId } from "../query/findMediaByMediaId";
export const destroyManyMedias = async (mediasApiIds: number[]) => {
	const result = await Promise.allSettled(
		mediasApiIds.map(async mediaApiId => {
			const media = await findMediaByMediaId(mediaApiId);
			if (!media)  {
				throw "Media already deleted";
			}
			FileSystem.deleteAsync(media.downloadedPath ?? "", { idempotent: true });
			return mediaApiId;
		})
	);

	const deletedMediasApiIds = getFulfilledValues(result);
	const joined = deletedMediasApiIds.join(",");

	if (deletedMediasApiIds.length === 0) {
		// This ensures we never call the below SQL with IN (), since it would delete every media.
		return;
	}

	await database.write(
		async () =>
			// sqlite:
			await database.adapter.unsafeExecute({
				sqls: [[`DELETE FROM medias WHERE media_id IN (${joined})`, []]],
			})
	);
};
