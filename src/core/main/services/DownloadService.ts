import * as FileSystem from "expo-file-system";
import { mediaDownloadTempURLRequest } from "intus-api/requests/MediaDownloadTempURLRequest";
import { DownloadFailedError } from "intus-core/shared/helpers/errors/DownloadFailedError";
import { Media } from "intus-database/WatermelonDB/models/Media/Media";

export const MAX_TRIES = 3;
export const MEDIAS_DIR = `${FileSystem.documentDirectory}/medias`;

export const mediaDownloadHandler = async (
	media: Media
): Promise<{ media: Media; downloadedPath: string }> => {
	const fileExists = await mediaExists(media.filename);
	if (fileExists) {
		return { media, downloadedPath: fileExists.path };
	}

	try {
		const {
			data: { temp_url: DOWNLOAD_URL },
		} = await mediaDownloadTempURLRequest(media.filename);
		const DOWNLOAD_PATH = await makeDownloadPath(media.filename);

		let tries = 1;
		let timeout = 1000 * tries;

		while (tries <= MAX_TRIES) {
			try {
				tries = tries + 1;
				timeout = 1000 * tries;

				await awaitableTimeout(timeout);
				const download = await FileSystem.downloadAsync(DOWNLOAD_URL, DOWNLOAD_PATH);

				if (!isStatusCodeOk(download)) {
					// We try to delete the file if the status code is not 200
					await deleteFile(DOWNLOAD_PATH);
				} else {
					return { media, downloadedPath: download.uri };
				}
			} catch (e) {
				console.log(`Could not download, retrying after ${timeout}`);
			}
		}

		// throw here works as reject() call inside a Promise.
		throw new DownloadFailedError(media.media_id, MAX_TRIES);
	} catch (e) {
		throw e;
	}
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

export const mediaExists = async (filename: string) => {
	const fileInfo = await FileSystem.getInfoAsync(await makeDownloadPath(filename));
	return {
		exists: fileInfo.exists,
		path: fileInfo.uri,
	};
};

const createMediasDirectory = async () => await FileSystem.makeDirectoryAsync(MEDIAS_DIR);

const awaitableTimeout = async (timeoutMs: number) =>
	new Promise((res, _) => {
		setTimeout(() => {
			res(undefined);
		}, timeoutMs);
	});
