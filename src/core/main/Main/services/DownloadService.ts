import * as FileSystem from "expo-file-system";

export const FILENAME = "hkbqDKBuDBrrKAvgVJBBwoWvYV1rtq49y562Mcvx.mp4";
// export const FILENAME = "a.mp4";
// const DOWNLOAD_URL =  'http://techslides.com/demos/sample-videos/small.mp4';
export const DOWNLOAD_PATH = FileSystem.documentDirectory + FILENAME;

export const downloadHandler = async (filename: string) => {
	const DOWNLOAD_URL = `http://192.168.1.99/api/media/${filename}/download`;
	const MAX_TRIES = 3;

	let tries = 1;

	const downloadResumable = FileSystem.createDownloadResumable(
		DOWNLOAD_URL,
		DOWNLOAD_PATH,
		{},
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
				return download;
			}
		} catch (e) {}
	}

	throw new Error("Failed to download after 3 tries");
};

const isStatusCodeOk = (downloadResult: FileSystem.FileSystemDownloadResult | undefined) => {
	return downloadResult?.status === 200;
};
