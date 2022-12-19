export class DownloadFailedError extends Error {
	constructor(public mediaId: number, public maxTries: number) {
		super(`Download of media with id: ${mediaId} failed after ${maxTries} tries.`);
	}
}
