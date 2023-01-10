import { IntusAPIClient } from "intus-api/IntusAPIClient";
import { GetAPITokenResponse } from "intus-api/responses/GetAPITokenResponse";

export const getAPITokenRequest = async (code: string) => {
	return await IntusAPIClient.request.patch<GetAPITokenResponse>(`api/pairing-codes/${code}`);
};
