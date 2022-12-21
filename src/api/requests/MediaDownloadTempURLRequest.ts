import { DisplayPostsSyncResponse } from "intus-api/responses/DisplayPostsSyncResponse";
import { MediaDownloadTempURLResponse } from "intus-api/responses/MediaDownloadTempURLResponse";
import { axiosClient } from "..";

export const mediaDownloadTempURLRequest = async (filename: string) => {
	return await axiosClient.get<MediaDownloadTempURLResponse>(
		`api/media/${filename}/download?temp_url=true`
	);
};
