import { IntusAPIClient } from "intus-api/IntusAPIClient";
import { DisplayPostsSyncResponse } from "intus-api/responses/DisplayPostsSyncResponse";
import { transformToArrayQueryParam } from "intus-core/shared/helpers/functions/transformToArrayQueryParam";

export const displayPostsSyncRequest = async (currentStoredPostsIds: number[]) => {
	let idsQuery = transformToArrayQueryParam("posts_ids", currentStoredPostsIds);

	if (idsQuery === "") {
		idsQuery = "posts_ids[]=";
	}

	return await IntusAPIClient.authRequest.get<DisplayPostsSyncResponse>(
		`api/display/posts/sync?${idsQuery}`
	);
};
