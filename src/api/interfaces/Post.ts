import { Media } from "./Media";
import { Recurrence } from "./Recurrence";

export interface Post {
	id: number;
	start_date: string | null;
	end_date: string | null;
	start_time: string;
	end_time: string;
	expose_time: number | null;
	media: Media;
	expired: boolean;
	recurrence?: Recurrence;
}
