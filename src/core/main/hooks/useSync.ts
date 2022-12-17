import { axiosClient } from "intus-api/index";

export const useSync = () => {
	const sync = async () => {
		try {
			const tests = await axiosClient.get("api/raspberry/display/posts");
			console.log(tests.data);
		} catch (e) {
			if (e instanceof Error)
			console.error(e);
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
