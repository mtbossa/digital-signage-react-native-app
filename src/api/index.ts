import axios from "axios";
const API_URL = "http://192.168.1.99";
const API_TOKEN = "XXX";

export const axiosClient = axios.create({
	baseURL: `${API_URL}/`,
	headers: {
		Authorization: `Bearer ${API_TOKEN}`,
	},
	timeout: 1000, // ms = 10s
});
