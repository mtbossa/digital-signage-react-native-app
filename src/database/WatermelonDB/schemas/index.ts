import { appSchema } from "@nozbe/watermelondb";
import { PostSchema } from "./PostSchema";

export const schema = appSchema({
	version: 1,
	tables: [PostSchema],
});
