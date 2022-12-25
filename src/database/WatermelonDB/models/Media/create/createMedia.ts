import { MediaWithPosts } from "intus-api/responses/DisplayPostsSyncResponse";
import { database } from "intus-database/WatermelonDB";
import { Media } from "../Media";

interface CreateMedia {
	id: number;
	filename: string;
	type: "video" | "image";
}

export const createMedia = async (media: CreateMedia) => {
	return await database.write(async () => {
		const createdMedia = await database.get<Media>("medias").create(newMedia => {
			newMedia.media_id = media.id;
			newMedia.filename = media.filename;
			newMedia.type = media.type;
			newMedia.downloaded = false;
		});

		console.log("New media create: ", createdMedia.asModel);

		return createdMedia;
	});
};
