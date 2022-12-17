import { Pusher } from "@pusher/pusher-websocket-react-native";
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

	const connect = async () => {
		const apiKey = "67f6f5d1618646d3ea95";
		const cluster = "sa1";

		const pusher = Pusher.getInstance();

		try {
			await pusher.init({
				apiKey,
				cluster,
				// authEndpoint: '<YOUR ENDPOINT URI>',
			});

			// await pusher.subscribe({ channelName });
			await pusher.connect();
			console.log("connected");
		} catch (e) {
			console.log(`ERROR: ${e}`);
		}
	};

	const disconnect = async () => {
		const pusher = Pusher.getInstance();

		try {
			await pusher.disconnect();
			console.log("disconnected");
		} catch (e) {
			console.log(`ERROR: ${e}`);
		}
	};

	return {
		sync,
		connect,
		disconnect,
	};
};
