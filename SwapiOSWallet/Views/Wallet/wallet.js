import * as React from "react";
import { Dimensions, Text, View, StyleSheet, Image, } from "react-native";
import { add } from "react-native-reanimated";

import * as Settings from "../../Helpers/settings";

const { width, height } = Dimensions.get("window");
const widthScale = width / 375;
const au_to_xwp = 1000000000000; // 1,000,000,000,000 atomic units in one XWP (like XMR)

// normalize the input so that it scales evenly across devices
function normalize(pre) {
	return Math.floor(pre * widthScale);
}

async function refreshWalletSearchThread() {
	// every 1 minute, send a "heartbeat" to the web wallet
	// this ensures that the wallet is still being synced while the user is in the wallet
	// 60,000ms = 1 minute
	const address = await Settings.select("walletAddress");
	const viewKey = await Settings.select("viewKey_sec");
	setInterval(() => {
		const body = JSON.stringify({
			"address": address,
			"view_key": viewKey,
			"create_account": true,
			"generated_locally": false,
			"withCredentials": true
		});
		fetch(
			"https://wallet.getswap.eu/api/login",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Referer": "https://wallet.getswap.eu/",
					"Origin": "https://wallet.getswap.eu",
					"Accept": "application/json, text/plain, */*",
					"Host": "wallet.getswap.eu",
					"Content-Length": body.length,
					"Sec-Fetch-Site": "same-origin",
					"Sec-Fetch-Mode": "cors",
					"Sec-Fetch-Dest": "empty"
				},
				body: body
			}
		).then(response => response.json().then(jsonResponse => {
			switch (jsonResponse.status) {
				case "success":
					console.log("wallet search thread: success");
					break;
				case "error":
					console.log("Ping resulted in an error");
					console.log(jsonResponse.reason);
					break;
				default:
					throw jsonResponse.reason;
			}
		}).catch(err => console.log("error pinging", err)));
	}, 10000);
}

export default class SwapWallet extends React.Component {
	constructor(props) {
		super(props);
		refreshWalletSearchThread();
		// overcome the delay of the async function so we don't run into problems
		this.state = {
			total_balance: "Syncing",
			total_unlocked_balance: "Syncing",
		};
		total_balancePromise = Settings.select("total_balance");
		total_balance_unlockedPromise = Settings.select("total_unlocked_balance");

		Promise.all([total_balancePromise, total_balance_unlockedPromise]).then((balances) => {
			this.state = {
				total_balance: (typeof balances[0] == "number" && !isNaN(balances[0])) ? balances[0] / au_to_xwp : "Syncing",
				total_unlocked_balance: (typeof balances[1] == "number" && !isNaN(balances[1])) ? balances[1] / au_to_xwp : "Syncing",
			};
		});
	}

	componentDidMount() {
		var addressPromise = Settings.select("walletAddress");
		var viewKeyPromise = Settings.select("viewKey");

		Promise.all([addressPromise, viewKeyPromise]).then((wallet) => {
			const pRetry = require("p-retry");
			const fetch = require("node-fetch");
			var data = "{\"address\":\"" + wallet[0] + "\",\"view_key\":\"" + wallet[1] + "\"}";

			const fetchTransactions = async () => {
				const response = await fetch(
					"https://wallet.getswap.eu/api/get_address_txs",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: data,
					}
				);

				if (response.status != 200) {
					throw new Error(response.statusText);
				}

				return response.json();
			};
			(async () => {
				await pRetry(fetchTransactions, {
					retries: 10,
					maxTimeout: 10000,
				}).then(result => {
					this.setState({
						total_balance: result.total_received / au_to_xwp,
						total_unlocked_balance: result.total_received_unlocked / au_to_xwp,
					});
					switch (result.status) {
						case "success":
							Settings.insert("total_balance", result.total_received);
							Settings.insert("total_unlocked_balance", result.total_received_unlocked);
							break;
						case "error":
							switch (result.reason) {
								case "Search thread does not exist.":
									this.setState({
										total_balance: 0,
										total_unlocked_balance: 0,
									});
									break;
								default:
									alert("An unknown error occured when fetching your balance. Please try again later. If the issue persists, please notify the developers of this app. Thank you.");
									break;
							}
							break;
						default:
							alert("An unknown error occured when fetching the status of the fetch balance request. Please notify the developers of this app if the issue persists. Thank you.");
					}
				});
			})();
		});
	}

	render() {
		return (
			<View style={{ backgroundColor: "#052344", display: "flex", flex: 1, }}>
				<View style={styles.balanceContainer}>
					<View style={[styles.balanceChildContainer, { paddingTop: height * 0.03, }]}>
						<Text numberOfLines={1} style={styles.balanceText}>Unlocked: {this.state.total_unlocked_balance}</Text>
						<Image style={[styles.balanceImage, { marginLeft: normalize(5), }]} source={require("../../Resources/Images/logo-circle-white-nofill.png")} />
					</View>
					<View style={[styles.balanceChildContainer, { marginTop: normalize(15), }]}>
						<Text numberOfLines={1} style={styles.balanceText}>Total: {this.state.total_balance}</Text>
						<Image style={[styles.balanceImage, { marginLeft: normalize(5), }]} source={require("../../Resources/Images/logo-circle-white-nofill.png")} />
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	balanceChildContainer: {
		flexDirection: "row",
	},

	balanceContainer: {
		alignItems: "center",
		flexDirection: "column",
		justifyContent: "center",
	},

	balanceImage: {
		height: normalize(22),
		width: normalize(22),
	},

	balanceText: {
		color: "white",
		fontSize: normalize(18),
		maxWidth: width * 0.8,
	}
});
