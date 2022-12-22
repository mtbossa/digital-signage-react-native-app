import { tableSchema } from "@nozbe/watermelondb";

export const PostSchema = tableSchema({
	name: "posts",
	columns: [
		{
			name: "post_api_id",
			type: "number",
			isIndexed: true,
		},
		{
			name: "media_api_id",
			type: "number",
		},
		{
			name: "media_id",
			type: "string",
		},
		{
			name: "start_time",
			type: "string",
		},
		{
			name: "end_time",
			type: "string",
		},
		{
			name: "start_date",
			type: "string",
			isOptional: true,
		},
		{
			name: "end_date",
			type: "string",
			isOptional: true,
		},
		{
			name: "expose_time",
			type: "number",
			isOptional: true,
		},
		{
			name: "recurrence",
			type: "string",
			isOptional: true,
		},
		{
			name: "showing",
			type: "boolean",
		},
	],
});
