import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

// Reference: https://docs.expo.dev/build-reference/variables/
let Config = {
	apiUrl: process.env.API_URL,
	pusherAppKey: process.env.DEVELOPMENT_PUSHER_APP_KEY,
	pusherAppCluster: process.env.DEVELOPMENT_PUSHER_APP_CLUSTER,
};

if (process.env.APP_ENV === "production") {
	Config.apiUrl = "https://mural.revendahost.inf.br";
	Config.pusherAppCluster = process.env.PRODUCTION_PUSHER_APP_KEY;
	Config.pusherAppKey = process.env.PRODUCTION_PUSHER_APP_CLUSTER;
} else if (process.env.APP_ENV === "staging") {
	Config.apiUrl = "https://mural.revendahost.inf.br";
	Config.pusherAppCluster = process.env.STAGING_PUSHER_APP_KEY;
	Config.pusherAppKey = process.env.STAGING_PUSHER_APP_CLUSTER;
}

module.exports = {
	expo: {
		name: "expo-typescript",
		slug: "expo-typescript",
		version: "1.0.0",
		orientation: "default",
		icon: "./assets/icon.png",
		userInterfaceStyle: "light",
		splash: {
			image: "./assets/splash.png",
			resizeMode: "contain",
			backgroundColor: "#ffffff",
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
			package: "com.mtbossa.expotypescript",
		},
		web: {
			favicon: "./assets/favicon.png",
		},
		extra: {
			eas: {
				projectId: "1e43f8a6-7841-4b5b-a7dc-2c3f80155779",
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