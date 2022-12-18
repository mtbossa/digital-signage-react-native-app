import { tableSchema } from "@nozbe/watermelondb";

export const MediaSchema = tableSchema({
	name: "medias",
	columns: [
		{
			name: "media_id",
			type: "number",
			isIndexed: true,
		},
		{
			name: "path",
			type: "string",
		},
		{
			name: "type",
			type: "string",
		},
		{
			name: "filename",
			type: "string",
		},
	],
});
