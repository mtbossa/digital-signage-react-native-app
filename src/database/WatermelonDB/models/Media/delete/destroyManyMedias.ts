import * as FileSystem from "expo-file-system";
import { getFulfilledValues } from "intus-core/shared/helpers/functions/getFulfilledValues";
import { database } from "intus-database/WatermelonDB";
import { findMediaByMediaId } from "../query/findMediaByMediaId";
export const destroyManyMedias = async (mediasApiIds: number[]) => {
	const deletedMediasIds: number[] = [];

	for (const mediaApiId of mediasApiIds) {
		const media = await findMediaByMediaId(mediaApiId);
		if (!media) {
			continue;
		}

		try {
			await FileSystem.deleteAsync(media.downloadedPath ?? "");
			deletedMediasIds.push(mediaApiId);
		} catch {
			// Not able to delete media, so we don't delete it from database, so later we can check for deletion again.
		}
	}

	if (deletedMediasIds.length === 0) {
		// This ensures we never call the below SQL with IN (), since it would delete every media.
		return;
	}

	const joined = deletedMediasIds.join(",");

	await database.write(
		async () =>
			// sqlite:
			await database.adapter.unsafeExecute({
				sqls: [[`DELETE FROM medias WHERE media_id IN (${joined})`, []]],
			})
	);
};
