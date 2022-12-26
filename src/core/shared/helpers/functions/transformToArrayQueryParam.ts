export const transformToArrayQueryParam = (param_name: string, values: number[] | string[]) => {
	// posts_ids[]=1&posts_ids[]=2
	return values.map(value => `${param_name}[]=${String(value)}`).join(`&`);
};
