import * as FileSystem from "expo-file-system";

export const FILENAME = "hkbqDKBuDBrrKAvgVJBBwoWvYV1rtq49y562Mcvx.mp4";
// export const FILENAME = "a.mp4";
// const DOWNLOAD_URL =  'http://techslides.com/demos/sample-videos/small.mp4';
export const DOWNLOAD_PATH = FileSystem.documentDirectory + FILENAME;

export const downloadHandler = async (filename: string) => {
	const DOWNLOAD_URL = `http://192.168.1.99/api/media/${filename}/download`;
	const MAX_TRIES = 3;

	let tries = 1;
	let downloadSucess = false;

	const downloadResumable = FileSystem.createDownloadResumable(
		DOWNLOAD_URL,
		DOWNLOAD_PATH,
		{},
		progress => {
			console.log("Progress", progress);
		}
	);

	while (!downloadSucess && tries <= MAX_TRIES) {
		try {
			console.log("Trying to download video in try: ", tries);
			tries = tries + 1;

			const download = await downloadResumable.downloadAsync();

			if (!isStatusCodeOk(download)) {
				try {
					console.log("Deleting file because status code is not 200");
					// We try to delete the file if the status code is not 200
					await FileSystem.deleteAsync(DOWNLOAD_PATH);
				} catch {
					// We don't have to do anything here
				}
			} else {
				console.log("Finished downloading to ", download?.uri);
				// downloadSucess = true;

				return download;
			}
		} catch (e) {}
	}

	throw new Error("Failed to download after 3 tries");
};

const isStatusCodeOk = (downloadResult: FileSystem.FileSystemDownloadResult | undefined) => {
	return downloadResult?.status === 200;
};
