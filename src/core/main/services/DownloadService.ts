import * as FileSystem from "expo-file-system";
import { MediaWithPosts } from "intus-api/responses/DisplayPostsSyncResponse";

export const downloadHandler = (media: MediaWithPosts) => {
	return new Promise<MediaWithPosts>(async (resolve, reject) => {
		const DOWNLOAD_URL = `http://192.168.1.99/api/media/${media.filename}/download`;
		const DOWNLOAD_PATH = makeDownloadPath(media.filename);
		const MAX_TRIES = 3;

		let tries = 1;

		const downloadResumable = FileSystem.createDownloadResumable(
			DOWNLOAD_URL,
			DOWNLOAD_PATH,
			{
				headers: {
					Authorization: "Bearer yZE3gVNJMtiRshEq0OeJDYesfh9jophBEMU2ij7p",
				},
			},
			progress => {
				console.log("Progress", progress);
			}
		);

		while (tries <= MAX_TRIES) {
			try {
				tries = tries + 1;

				const download = await downloadResumable.downloadAsync();

				if (!isStatusCodeOk(download)) {
					// We try to delete the file if the status code is not 200
					await FileSystem.deleteAsync(DOWNLOAD_PATH, { idempotent: true });
				} else {
					resolve(media);
				}
			} catch (e) {}
		}

		reject(media);
	});
};

const isStatusCodeOk = (downloadResult: FileSystem.FileSystemDownloadResult | undefined) => {
	return downloadResult?.status === 200;
};

const makeDownloadPath = (filename: string) => FileSystem.documentDirectory + filename;
