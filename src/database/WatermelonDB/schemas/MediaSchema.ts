import { tableSchema } from "@nozbe/watermelondb";

export const MediaSchema = tableSchema({
	name: "medias",
	columns: [
		{
			name: "media_id",
			type: "number",
			isIndexed: true,
		},
	],
});
