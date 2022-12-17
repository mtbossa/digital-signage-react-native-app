import { Notification } from "../Notification";

export interface PostDeletedNotification extends Notification {
	canDeleteMedia: boolean;
	media_id: number;
	post_id: number;
}
