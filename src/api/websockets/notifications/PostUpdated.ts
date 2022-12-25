import { Notification } from "../Notification";

export interface PostUpdatedNotification extends Notification {
	post: {
		id: number;
		start_date: string | null;
		end_date: string | null;
		start_time: string;
		end_time: string;
		expose_time: number | null;
		showing: boolean | null;
		media: {
			id: number;
			path: string;
			type: "image" | "video";
			filename: string;
		};
		recurrence?: {
			isoweekday: number | null;
			day: number | null;
			month: number | null;
		};
	};
}
