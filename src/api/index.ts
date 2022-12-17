import axios from "axios";

export const axiosClient = axios.create({
	baseURL: "http://192.168.1.99/",
	headers: {
		Authorization: "Bearer yZE3gVNJMtiRshEq0OeJDYesfh9jophBEMU2ij7p",
	},
	timeout: 10000, // ms = 10s
});
