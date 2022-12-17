import axios, { AxiosError } from "axios";
import { axiosClient } from "intus-api/index";
import { PostResponse } from "intus-api/responses/PostResponse";

export const useSync = () => {
	const sync = async () => {
		try {
			const { data: posts } = await axiosClient.get<PostResponse>("api/raspberry/display/posts");
		} catch (err) {
			if (axios.isAxiosError(err)) {
				console.error("Could not sync with backend");
			}
		}

		console.log("Sync is over");
		return true;
	};

	return {
		sync,
	};
};

const test = () =>
	new Promise((res, rej) => {
		setTimeout(() => res(true), 5000);
	});
