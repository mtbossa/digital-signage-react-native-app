import { BroadcastingAuthResponse } from "intus-api/responses/BroadcastingAuth";
import { axiosClient } from "..";

export const broadcastingAuthRequest = async (channelName: string, socketId: string) => {
	return await axiosClient.get<BroadcastingAuthResponse>(
		`api/broadcasting/auth?channel_name=${channelName}&socket_id=${socketId}`,
		{
			headers: {
				Authorization: "Bearer yZE3gVNJMtiRshEq0OeJDYesfh9jophBEMU2ij7p",
			},
		}
	);
};
