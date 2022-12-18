import { appSchema } from "@nozbe/watermelondb";
import { MediaSchema } from "./MediaSchema";
import { PostSchema } from "./PostSchema";

export const schema = appSchema({
	version: 1,
	tables: [PostSchema, MediaSchema],
});
