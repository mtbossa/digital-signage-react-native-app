import * as FileSystem from "expo-file-system";
import { mediaDownloadTempURLRequest } from "intus-api/requests/MediaDownloadTempURLRequest";
import { DownloadFailedError } from "intus-core/shared/helpers/errors/DownloadFailedError";
import { Media } from "intus-database/WatermelonDB/models/Media/Media";

export const MAX_TRIES = 3;
export const MEDIAS_DIR = `${FileSystem.documentDirectory}/medias`;

export const mediaDownloadHandler = async (media: Media): Promise<Media> => {
	const {
		data: { temp_url: DOWNLOAD_URL },
	} = await mediaDownloadTempURLRequest(media.filename);
	const DOWNLOAD_PATH = await makeDownloadPath(media.filename);

	try {
		console.log("Trying to download...: ", { DOWNLOAD_URL, DOWNLOAD_PATH });
		const download = await FileSystem.downloadAsync(DOWNLOAD_URL, DOWNLOAD_PATH);

		if (!isStatusCodeOk(download)) {
			console.error("Status code not OK: ", download);
			// We try to delete the file if the status code is not 200
			await deleteFile(DOWNLOAD_PATH);
		} else {
			console.log("Media download successful: ", download.uri);
			await media.setDownloadedPath(download.uri);
			return media;
		}
	} catch (e) {
		console.error(`Could not download.`, e);
	}

	// throw here works as reject() call inside a Promise.
	throw new DownloadFailedError(media.media_id);
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
