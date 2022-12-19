export interface DisplayPostsSyncResponse {
	data: MediaWithPosts[];
}

export interface MediaWithPosts {
	id: number;
	type: "image" | "video";
	filename: string;
	path: string;
	posts: Post[];
}

interface Post {
	id: number;
	start_date: Date | null;
	end_date: Date | null;
	start_time: string;
	end_time: string;
	expose_time: number | null;
	media_id: number;
	recurrence_id: number | null;
	recurrence: Recurrence | null;
}

interface Recurrence {
	id: number;
	isoweekday: number;
	day: null;
	month: null;
}
