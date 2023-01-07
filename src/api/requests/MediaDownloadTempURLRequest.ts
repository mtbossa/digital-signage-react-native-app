import { IntusAPIClient } from "intus-api/IntusAPIClient";
import { MediaDownloadTempURLResponse } from "intus-api/responses/MediaDownloadTempURLResponse";

export const mediaDownloadTempURLRequest = async (filename: string) => {
	return await IntusAPIClient.authRequest.get<MediaDownloadTempURLResponse>(
		`api/media/${filename}/download?temp_url=true`
	);
};
