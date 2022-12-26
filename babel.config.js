module.exports = function (api) {
	api.cache(true);
	return {
		presets: ["babel-preset-expo"],
		plugins: [
			[
				"module-resolver",
				{
					alias: {
						"intus-core": "./src/core",
						"intus-contexts": "./src/contexts",
						"intus-database": "./src/database",
						"intus-styles": "./src/styles",
						"intus-api": "./src/api",
					},
				},
			],
			["@babel/plugin-proposal-decorators", { legacy: true }],
			["transform-inline-environment-variables"],
		],
	};
};
