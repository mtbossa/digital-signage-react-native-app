import { IntusAPIClient } from "intus-api/IntusAPIClient";
import { BroadcastingAuthResponse } from "intus-api/responses/BroadcastingAuth";
import { RequestPairingCodeResponse } from "intus-api/responses/RequestPairingCodeResponse";

export const requestPairingCodeRequest = async () => {
	return await IntusAPIClient.request.post<RequestPairingCodeResponse>(`api/pairing-codes`);
};
