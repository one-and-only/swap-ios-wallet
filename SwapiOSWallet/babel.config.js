module.exports = {
	presets: ["module:@react-native/babel-preset"],
	"plugins": [
		["module:react-native-dotenv", {
		  "envName": "SWAP_MOBILE_WALLET_ENV",
		  "moduleName": "@config",
		  "path": ".env",
		  "blocklist": null,
		  "allowlist": [
			"MOBILE_WALLET_API_PREFIX"
		  ],
		  "safe": true,
		  "allowUndefined": false,
		  "verbose": false
		}]
	  ]
};
