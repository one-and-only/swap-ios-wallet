import * as React from "react";
import { Dimensions, Text, View, StyleSheet, Image, } from "react-native";

import * as Settings from "../../Helpers/settings";

const {width, height} = Dimensions.get("window");
const widthScale = width/375;
const au_to_xwp = 1000000000000; // 1,000,000,000,000 atomic units in one XWP (like XMR)

// normalize the input so that it scales evenly across devices
function normalize (pre) {
	return Math.floor(pre * widthScale);
}

function refreshWalletSearchThread() {
	// every 5 minutes, send a "heartbeat" to the web wallet
	// this ensures that the wallet is still being synced while the user is in the wallet
	// 300,000ms = 5 minutes
	setInterval(() => {
		address_promise = Settings.select("walletAddress");
		viewKey_promise = Settings.select("viewKey");
		Promise.all([address_promise, viewKey_promise]).then(wallet => {
			var data = "{\"address\": \"" + wallet[0] + "\", \"view_key\": \"" + wallet[1] + "\"}";
			fetch(
				"https://wallet.getswap.eu/api/ping",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: data
				}
			).then(response => response.json())
				.then((jsonResponse) => {
					switch (jsonResponse.status) {
					case "error":
						console.log("Ping resulted in an error");
						console.log(jsonResponse.reason);
						break;
					}
				}).catch(err => console.log("Error" + err));
		});
	}, 300_000);
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
				const _result = await pRetry(fetchTransactions, {
					onFailedAttempt: error => {
						console.log(`Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`);
					},
					retries: 10,
					maxTimeout: 10000,
				}).then(result => {
					this.setState({
						total_balance: result.total_received / au_to_xwp,
						total_unlocked_balance: result.total_received_unlocked / au_to_xwp,
					});
					switch(result.status) {
					case "success":
						Settings.insert("total_balance", result.total_received);
						Settings.insert("total_unlocked_balance", result.total_received_unlocked);
						break;
					case "error":
						switch(result.reason) {
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
			<View style={{backgroundColor: "#052344", display: "flex", flex: 1,}}>
				<View style={styles.balanceContainer}>
					<View style={[styles.balanceChildContainer, {paddingTop: height * 0.03,}]}>
						<Text numberOfLines={1} style={styles.balanceText}>Unlocked: {this.state.total_unlocked_balance}</Text>
						<Image style={[styles.balanceImage, {marginLeft: normalize(5),}]} source={require("../../Resources/Images/logo-circle-white-nofill.png")} />
					</View>
					<View style={[styles.balanceChildContainer, {marginTop: normalize(15),}]}>
						<Text numberOfLines={1} style={styles.balanceText}>Total: {this.state.total_balance}</Text>
						<Image style={[styles.balanceImage, {marginLeft: normalize(5),}]} source={require("../../Resources/Images/logo-circle-white-nofill.png")} />
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
