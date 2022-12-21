export class DownloadFailedError extends Error {
	constructor(public mediaId: number) {
		super(`Download of media with id: ${mediaId} failed.`);
	}
}
