import { Notification } from "../Notification";

export interface PostCreatedNotification extends Notification {
	post: {
		id: string;
	};
}
