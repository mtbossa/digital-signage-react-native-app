import axios from "axios";
const API_URL = "http://192.168.1.99";

export const axiosClient = axios.create({
	baseURL: `${API_URL}/`,
	headers: {
		Authorization: `Bearer ${process.env.API_TOKEN}`,
	},
	timeout: 1000, // ms = 10s
});
