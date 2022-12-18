import { Model } from "@nozbe/watermelondb";
import { field, json } from "@nozbe/watermelondb/decorators";

export class Media extends Model {
	static table = "medias";

	@field("media_id") mediaId!: number;
	@field("filename") filename!: string;
	@field("path") path!: string;
	@field("type") type!: "video" | "image";
}
