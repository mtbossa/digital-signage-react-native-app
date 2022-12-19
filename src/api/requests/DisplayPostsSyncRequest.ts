import { DisplayPostsSyncResponse } from "intus-api/responses/DisplayPostsSyncResponse";
import { axiosClient } from "..";

export const displayPostsSyncRequest = async () => {
	return await axiosClient.get<DisplayPostsSyncResponse>("api/display/1/posts/sync", {
		headers: {
			Authorization: "Bearer yZE3gVNJMtiRshEq0OeJDYesfh9jophBEMU2ij7p",
		},
	});
};
