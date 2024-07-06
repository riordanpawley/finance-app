module.exports = (api) => {
	api.cache(true);
	return {
		presets: ["babel-preset-expo"],
		plugins: [
			"@babel/plugin-syntax-import-attributes",
			// For Kysely to work with Hermes
			["@babel/plugin-transform-private-methods", { loose: true }],
			// For Kysely to work with Hermes
			"@babel/plugin-transform-dynamic-import",
			[
				"module-resolver",
				{
					alias: {
						crypto: "crypto-browserify",
						vm: "vm-browserify",
					},
				},
			],

			"@babel/plugin-transform-export-namespace-from",
			"react-native-reanimated/plugin",
			// Add a web-only plugin...
			// platform === "web" && "custom-web-only-plugin",
		].filter(Boolean),
	};
};
