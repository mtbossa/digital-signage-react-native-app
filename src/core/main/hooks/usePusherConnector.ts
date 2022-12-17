import { Pusher } from "@pusher/pusher-websocket-react-native";
import { axiosClient } from "intus-api/index";
import { broadcastingAuthRequest } from "intus-api/requests/BroadcastingAuthRequest";
import { BroadcastingAuthResponse } from "intus-api/responses/BroadcastingAuth";
import {
	getCurrentDisplayChannelName,
	PrivateChannels,
} from "intus-api/websockets/PrivateChannels";

const handleAuthorization = async (channelName: string, socketId: string) => {
	try {
		const {
			data: { auth },
		} = await broadcastingAuthRequest(channelName, socketId);

		return {
			auth,
		};
	} catch (e) {
		// TODO do something if can't authenticate
		console.error("ERROR HERE ON AUTHORIZER");
		return {
			auth: "an error occcured",
		};
	}
};

export const usePusherConnector = () => {
	const connect = async () => {
		const apiKey = "67f6f5d1618646d3ea95";
		const cluster = "sa1";

		const pusher = Pusher.getInstance();

		try {
			await pusher.init({
				apiKey,
				cluster,
				authEndpoint: "http://192.168.1.99/api/broadcasting/auth",
				onAuthorizer: handleAuthorization,
			});

			await pusher.subscribe({
				channelName: getCurrentDisplayChannelName(),
				onEvent: event => {
					console.log("Received event", event);
				},
				onSubscriptionSucceeded: data => {
					console.log("onSubscriptionSucceeded");
				},
			});

			await pusher.connect();
		} catch (e) {
			console.log("Error while connecting", e);
		}
	};

	return {
		connect,
	};
};
