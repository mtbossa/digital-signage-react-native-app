import axios, { AxiosInstance, CreateAxiosDefaults } from "axios";
import Constants from "expo-constants";

class IntusAPIClient {
	private TIMEOUT = 10000; // ms = 10s
	private API_TOKEN: string | null = null;
	API_URL = Constants.expoConfig?.extra?.apiUrl ?? process.env.API_URL ?? "localhost";

	DEFAULT_AXIOS_CONFIG: CreateAxiosDefaults = {
		baseURL: `${this.API_URL}/`,
		timeout: this.TIMEOUT, // ms = 10s
	};

	private axios: AxiosInstance;
	private authenticatedAxios: AxiosInstance | null = null;

	constructor() {
		this.axios = axios.create(this.DEFAULT_AXIOS_CONFIG);
	}

	get request() {
		return this.axios;
	}

	get authRequest() {
		if (!this.authenticatedAxios) {
			throw new Error("You must set the API Token before making authenticated requests.");
		}

		return this.authenticatedAxios;
	}

	setApiToken(apiToken: string) {
		this.API_TOKEN = apiToken;
		this.createAuthenticatedAxiosInstance();
	}

	private createAuthenticatedAxiosInstance() {
		this.authenticatedAxios = axios.create({
			...this.DEFAULT_AXIOS_CONFIG,
			headers: {
				Authorization: `Bearer ${this.API_TOKEN}`,
			},
		});
	}
}

export default new IntusAPIClient();
