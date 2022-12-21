import { Model } from "@nozbe/watermelondb";
import { field, json } from "@nozbe/watermelondb/decorators";

interface Recurrence {
	day: number | null;
	isoweekday: number | null;
	month: number | null;
}

export class Post extends Model {
	static table = "posts";

	@field("post_id") post_id!: number;
	@field("media_id") media_id!: number;
	@field("start_time") start_time!: string;
	@field("end_time") end_time!: string;
	@field("start_date") start_date!: string | null;
	@field("end_date") end_date!: string | null;
	@field("expose_time") expose_time!: number | null;
	@json("recurrence", json => json) recurrence!: Recurrence | null;
	@field("showing") showing!: boolean;
}
