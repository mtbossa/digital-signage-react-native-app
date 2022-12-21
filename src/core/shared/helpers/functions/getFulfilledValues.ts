export const getFulfilledValues = <T>(result: PromiseSettledResult<T>[]) => {
	return result.map(result => {
		if (result.status === "fulfilled" && result.value) {
			return result.value;
		}
	}) as T[];
};
