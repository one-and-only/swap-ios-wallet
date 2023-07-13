import * as React from "react";
import { Dimensions, Text, View, StyleSheet, Image, Alert, } from "react-native";

import * as Settings from "../../Helpers/settings";
import { walletSynced } from "../../Helpers/blockchain";
import { normalize } from "../../Helpers/gui";

const { width, height } = Dimensions.get("window");
const widthScale = width / 375;
const au_to_xwp = 1000000000000; // 1,000,000,000,000 atomic units in one XWP (like XMR)

async function refreshWalletSearchThread() {
	// every 1 minute, send a "heartbeat" to the web wallet
	// this ensures that the wallet is still being synced while the user is in the wallet
	// 60,000ms = 1 minute
	const address = await Settings.select("walletAddress");
	const viewKey = await Settings.select("viewKey_sec");
	setInterval(() => {
		fetch(
			"https://wallet.getswap.eu/api/ping",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					"address": address,
					"view_key": viewKey
				})
			}
		).then(response => response.json().then(jsonResponse => {
			switch (jsonResponse.status) {
			case "success":
				break;
			case "error":
				console.log("Ping resulted in an error");
				console.log(jsonResponse.reason);
				break;
			default:
				throw jsonResponse.reason;
			}
		}).catch(() => Alert.alert("Error", "Failed to connect to our servers. Please check your internet connection and try again.")));
	}, 60000);
}

export default class SwapWallet extends React.Component {
	constructor(props) {
		super(props);
		const address = Settings.select("walletAddress");
		const viewKey = Settings.select("viewKey_sec");
		Promise.all([address, viewKey]).then(wallet => {
			fetch("https://wallet.getswap.eu/api/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					"address": wallet[0],
					"view_key": wallet[1],
					"create_account": true,
					"generated_locally": false,
					"withCredentials": true
				})
			}).then(response => response.json().then(jsonResponse => {
				switch (jsonResponse.status) {
				case "success":
					refreshWalletSearchThread();
					break;
				case "error":
					console.log("Login resulted in an error:", jsonResponse.reason);
					break;
				default:
					throw jsonResponse.reason;
				}
			})).catch(() => Alert.alert("Error", "Failed to connect to our servers. Please check your internet connection and try again."));
		});
		refreshWalletSearchThread();
		// overcome the delay of the async function so we don't run into problems
		this.state = {
			total_balance: "Syncing",
			total_unlocked_balance: "Syncing",
		};
		const total_balancePromise = Settings.select("total_balance");
		const total_balance_unlockedPromise = Settings.select("total_unlocked_balance");

		Promise.all([total_balancePromise, total_balance_unlockedPromise]).then((balances) => {
			this.state = {
				total_balance: (typeof balances[0] == "number" && !isNaN(balances[0])) ? balances[0] / au_to_xwp : "Syncing",
				total_unlocked_balance: (typeof balances[1] == "number" && !isNaN(balances[1])) ? balances[1] / au_to_xwp : "Syncing",
			};
		});
	}

	componentDidMount() {
		let addressPromise = Settings.select("walletAddress");
		let viewKeyPromise = Settings.select("viewKey_sec");

		Promise.all([addressPromise, viewKeyPromise]).then((wallet) => {
			let data = "{\"address\":\"" + wallet[0] + "\",\"view_key\":\"" + wallet[1] + "\"}";

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
				const total_saved_balance = await Settings.select("total_balance");
				const total_saved_unlocked_balance = await Settings.select("total_unlocked_balance");
				if (total_saved_balance && total_saved_unlocked_balance) {
					this.setState({
						total_balance: (total_saved_balance / au_to_xwp).toFixed(4),
						total_unlocked_balance: (total_saved_unlocked_balance / au_to_xwp).toFixed(4),
					});
				}
				const updateBalance = async () => {
					await fetchTransactions().then(async result => {
						switch (result.status) {
						case "success":
							if (await walletSynced()) {
								this.setState({
									total_balance: (result.total_received / au_to_xwp).toFixed(4),
									total_unlocked_balance: (result.total_received_unlocked / au_to_xwp).toFixed(4),
								});
								Settings.insert("total_balance", result.total_received);
								Settings.insert("total_unlocked_balance", result.total_received_unlocked);
							}
							break;
						case "error":
							switch (result.reason) {
							case "Search thread does not exist.":
								this.setState({
									total_balance: 0,
									total_unlocked_balance: 0,
								});
								alert("Your wallet is not syncing. Please wait a few minutes and try again.");
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
				};
				await updateBalance();
				setInterval(async () => { await updateBalance(); }, 60000);
			})();
		});
	}

	render() {
		return (
			<View style={{ backgroundColor: "#052344", display: "flex", flex: 1, }}>
				<View style={styles.balanceContainer}>
					<View style={[styles.balanceChildContainer, { paddingTop: height * 0.03, }]}>
						<Text numberOfLines={1} style={styles.balanceText}>Unlocked: {this.state.total_unlocked_balance}</Text>
						<Image style={[styles.balanceImage, { marginLeft: normalize(5, widthScale), }]} source={require("../../Resources/Images/logo-circle-white-nofill.png")} />
					</View>
					<View style={[styles.balanceChildContainer, { marginTop: normalize(15, widthScale), }]}>
						<Text numberOfLines={1} style={styles.balanceText}>Total: {this.state.total_balance}</Text>
						<Image style={[styles.balanceImage, { marginLeft: normalize(5, widthScale), }]} source={require("../../Resources/Images/logo-circle-white-nofill.png")} />
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
		height: normalize(22, widthScale),
		width: normalize(22, widthScale),
	},

	balanceText: {
		color: "white",
		fontSize: normalize(18, widthScale),
		maxWidth: width * 0.8,
	}
});
