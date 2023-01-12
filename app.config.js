import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

const getDevelopmentApiUrl = () => {
	if (process.env.API_URL && process.env.API_URL !== "") {
		// We need to check for empty string because .env could be like this: API_URL=
		// and then apiUrl value would be an empty string.
		return process.env.API_URL;
	}

	return "http://localhost:8080";
};

// Reference: https://docs.expo.dev/build-reference/variables/
let Config = {
	apiUrl: getDevelopmentApiUrl(),
	pusherAppKey: process.env.DEVELOPMENT_PUSHER_APP_KEY,
	pusherAppCluster: process.env.DEVELOPMENT_PUSHER_APP_CLUSTER,
	appEnv: "development",
};

if (process.env.APP_ENV === "production") {
	Config.apiUrl = "https://mural.revendahost.inf.br";
	Config.pusherAppCluster = process.env.PRODUCTION_PUSHER_APP_KEY;
	Config.pusherAppKey = process.env.PRODUCTION_PUSHER_APP_CLUSTER;
	Config.appEnv = "production";
} else if (process.env.APP_ENV === "staging") {
	Config.apiUrl = "https://mural.revendahost.inf.br";
	Config.pusherAppCluster = process.env.STAGING_PUSHER_APP_KEY;
	Config.pusherAppKey = process.env.STAGING_PUSHER_APP_CLUSTER;
	Config.appEnv = "staging";
}

module.exports = {
	expo: {
		name: "Intus Murais",
		slug: "intus-murais",
		version: "1.0.0",
		orientation: "default",
		icon: "./assets/icon.png",
		userInterfaceStyle: "light",
		splash: {
			image: "./assets/splash.png",
			resizeMode: "contain",
			backgroundColor: "#000000",
		},
		updates: {
			fallbackToCacheTimeout: 0,
		},
		assetBundlePatterns: ["**/*"],
		ios: {
			supportsTablet: true,
		},
		android: {
			adaptiveIcon: {
				foregroundImage: "./assets/adaptive-icon.png",
				backgroundColor: "#FFFFFF",
			},
			intentFilters: [
				{
					action: "MAIN",
					category: ["LEANBACK_LAUNCHER"],
				},
			],
			permissions: ["READ_EXTERNAL_STORAGE", "WRITE_EXTERNAL_STORAGE", "INTERNET"],
			package: "com.intus.intusmurais",
		},
		web: {
			favicon: "./assets/favicon.png",
		},
		extra: {
			eas: {
				projectId: "6349dc0c-d6e0-4d6b-a327-6bee1766e0cd"
			},
			...Config,
		},
		plugins: [
			[
				"expo-build-properties",
				{
					android: {
						kotlinVersion: "1.6.10",
					},
				},
			],
		],
	},
};
