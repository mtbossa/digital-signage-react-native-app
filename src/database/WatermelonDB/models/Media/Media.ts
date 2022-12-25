import { Model } from "@nozbe/watermelondb";
import { field, json, writer } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";

export class Media extends Model {
	static table = "medias";

	@field("media_id") media_id!: number;
	@field("filename") filename!: string;
	@field("type") type!: "video" | "image";
	@field("downloaded") downloaded!: boolean;
	@field("downloadedPath") downloadedPath!: string | null;

	static associations: Associations = {
		posts: { type: "has_many", foreignKey: "media_id" },
	};

	@writer async setDownloadedPath(downloadedPath: string) {
		await this.update(media => {
			media.downloaded = true;
			media.downloadedPath = downloadedPath;
		});
	}
}
