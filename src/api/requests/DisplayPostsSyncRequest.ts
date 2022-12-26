import { DisplayPostsSyncResponse } from "intus-api/responses/DisplayPostsSyncResponse";
import { transformToArrayQueryParam } from "intus-core/shared/helpers/functions/transformToArrayQueryParam";
import { axiosClient } from "..";

export const displayPostsSyncRequest = async (currentStoredPostsIds: number[]) => {
	let idsQuery = transformToArrayQueryParam("posts_ids", currentStoredPostsIds);

	if (idsQuery === "") {
		idsQuery = "posts_ids[]=";
	}

	return await axiosClient.get<DisplayPostsSyncResponse>(`api/display/1/posts/sync?${idsQuery}`);
};
