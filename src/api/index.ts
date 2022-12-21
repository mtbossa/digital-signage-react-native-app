import axios from "axios";
import { API_URL, API_TOKEN } from "@env";
export const axiosClient = axios.create({
	baseURL: `${API_URL}/`,
	headers: {
		Authorization: `Bearer ${API_TOKEN}`,
	},
	timeout: 10000, // ms = 10s
});
