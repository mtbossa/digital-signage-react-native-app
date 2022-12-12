module.exports = function (api) {
	api.cache(true);
	return {
		presets: ["babel-preset-expo"],
		plugins: [
			[
				"module-resolver",
				{
					root: ["./src"],
					alias: {
						"intus-core": "/core",
						"intus-contexts": "/contexts",
						"intus-database": "/database",
						"intus-styles": "/styles",
					},
				},
			],
		],
	};
};
