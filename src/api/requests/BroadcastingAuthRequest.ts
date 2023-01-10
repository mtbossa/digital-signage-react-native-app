import { IntusAPIClient } from "intus-api/IntusAPIClient";
import { BroadcastingAuthResponse } from "intus-api/responses/BroadcastingAuth";

export const broadcastingAuthRequest = async (channelName: string, socketId: string) => {
	return await IntusAPIClient.authRequest.get<BroadcastingAuthResponse>(
		`api/broadcasting/auth?channel_name=${channelName}&socket_id=${socketId}`
	);
};
