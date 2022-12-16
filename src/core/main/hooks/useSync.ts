export const useSync = () => {
	const sync = async () => {
		await test();
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
