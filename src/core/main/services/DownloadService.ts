import * as FileSystem from "expo-file-system";
import { MediaWithPosts } from "intus-api/responses/DisplayPostsSyncResponse";
import { DownloadFailedError } from "intus-core/shared/helpers/errors/DownloadFailedError";

export const MAX_TRIES = 3;
export const MEDIAS_DIR = `${FileSystem.documentDirectory}/medias`;

export const downloadHandler = async (
	media: MediaWithPosts
): Promise<MediaWithPosts & { downloadedPath: string }> => {
	const DOWNLOAD_URL = `http://192.168.1.99/api/media/${media.filename}/download`;
	const DOWNLOAD_PATH = await makeDownloadPath(media.filename);

	let tries = 1;
	let timeout = 1000 * tries;

	const downloadResumable = FileSystem.createDownloadResumable(
		DOWNLOAD_URL,
		DOWNLOAD_PATH,
		{
			headers: {
				Authorization: "Bearer yZE3gVNJMtiRshEq0OeJDYesfh9jophBEMU2ij7p",
			},
		},
		progress => {
			console.log(`Downloading media ${media.id}. Progress`, progress);
		}
	);

	while (tries <= MAX_TRIES) {
		try {
			tries = tries + 1;
			timeout = 1000 * tries;

			await awaitableTimeout(timeout);

			const download = await downloadResumable.downloadAsync();

			if (!isStatusCodeOk(download)) {
				// We try to delete the file if the status code is not 200
				await deleteFile(DOWNLOAD_PATH);
			} else {
				return { ...media, downloadedPath: download!.uri };
			}
		} catch (e) {
			console.log(`Could not download, retrying after ${timeout}`);
		}
	}

	// throw here works as reject() call inside a Promise.
	throw new DownloadFailedError(media.id, MAX_TRIES);
};

const isStatusCodeOk = (downloadResult: FileSystem.FileSystemDownloadResult | undefined) => {
	return downloadResult?.status === 200;
};

export const deleteFile = async (path: string) => {
	return await FileSystem.deleteAsync(path, { idempotent: true });
};

export const makeDownloadPath = async (filename: string) => {
	const { exists } = await FileSystem.getInfoAsync(MEDIAS_DIR);
	if (!exists) {
		await createMediasDirectory();
	}
	return `${MEDIAS_DIR}/${filename}`;
};

export const mediaExists = async (filename: string) =>
	(await FileSystem.getInfoAsync(await makeDownloadPath(filename))).exists;

const createMediasDirectory = async () => await FileSystem.makeDirectoryAsync(MEDIAS_DIR);

const awaitableTimeout = async (timeoutMs: number) =>
	new Promise((res, _) => {
		setTimeout(() => {
			res(undefined);
		}, timeoutMs);
	});
