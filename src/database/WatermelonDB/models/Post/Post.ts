import { Model } from "@nozbe/watermelondb";
import { field, json, lazy, relation } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";
import { Media } from "../Media/Media";
import { Q } from "@nozbe/watermelondb";

interface Recurrence {
	day: number | null;
	isoweekday: number | null;
	month: number | null;
}

export class Post extends Model {
	static table = "posts";

	@field("post_api_id") post_api_id!: number;
	@field("media_api_id") media_api_id!: number;
	@field("media_id") media_id!: string;
	@field("start_time") start_time!: string;
	@field("end_time") end_time!: string;
	@field("start_date") start_date!: string | null;
	@field("end_date") end_date!: string | null;
	@field("expose_time") expose_time!: number | null;
	@json("recurrence", json => json) recurrence!: Recurrence | null;
	@field("showing") showing!: boolean;

	static associations: Associations = {
		medias: { type: "belongs_to", key: "media_id" },
	};

	@relation("medias", "media_id") media!: Promise<Media>;
}
