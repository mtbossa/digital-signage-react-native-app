import * as FileSystem from "expo-file-system";
import { MediaWithPosts } from "intus-api/responses/DisplayPostsSyncResponse";

export const downloadHandler = async (
	media: MediaWithPosts
): Promise<MediaWithPosts & { downloadedPath: string }> => {
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
				await deleteFile(DOWNLOAD_PATH);
			} else {
				return { ...media, downloadedPath: download!.uri };
			}
		} catch (e) {}
	}

	// throw here works as reject() call inside a Promise.
	throw media;
};

const isStatusCodeOk = (downloadResult: FileSystem.FileSystemDownloadResult | undefined) => {
	return downloadResult?.status === 200;
};

export const deleteFile = async (path: string) => {
	return await FileSystem.deleteAsync(path, { idempotent: true });
};

export const makeDownloadPath = (filename: string) =>
	`${FileSystem.documentDirectory}/medias/${filename}`;

export const mediaExists = async (filename: string) =>
	(await FileSystem.getInfoAsync(makeDownloadPath(filename))).exists;
