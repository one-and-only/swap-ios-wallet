import * as React from "react";
import { Dimensions, Text, View, StyleSheet, TouchableOpacity, ScrollView, Image, Settings } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { select, insert } from "../../Helpers/settings";
import * as Progress from 'react-native-progress';

const { width, height } = Dimensions.get("window");
const widthScale = width / 375;

// normalize the input so that it scales evenly across devices
function normalize(pre) {
	return Math.floor(pre * widthScale);
}

// styles need to be defined before
// dynamic generation of rows
const styles = StyleSheet.create({
	mainView: {
		display: "flex",
		flex: 1,
		backgroundColor: "#052344",
		alignItems: "center",
	},

	titleText: {
		paddingTop: normalize(5),
		color: "white",
		fontSize: normalize(25),
		fontWeight: "bold",
		textAlign: "center",
	},

	item: {
		marginTop: normalize(10),
		fontSize: normalize(22),
		height: 44,
	},

	row: {
		flexDirection: "row",
	},

	txContainer: {
		flexDirection: "column",
	},

	swapCurrencyLogo: {
		height: normalize(22),
		width: normalize(22),
	},

	statusText: {
		textAlign: "center",
		color: "white",
		margin: normalize(12),
		fontSize: normalize(18),
	},
});

export default class SwapTransactions extends React.Component {
	transactionIndex = -1; // index of the transaction we're parsing; needed because of Promise.all (async, but much faster)
	totalTransactions = -1;
	hasInitialSync = false;

	generate_transaction_row(transaction) {
		const date = new Date(transaction.timestamp).toLocaleDateString();
		const txColor = (transaction.receiving) ? "lime" : "orange";
		const directionIcon = (transaction.receiving) ? "arrow-down" : "arrow-up";
		return (
			// we need some sort of unique key for each row so RN doesn't complain. tx_hash works great for this
			<TouchableOpacity key={transaction.hash} style={styles.row} onPress={() => { this.props.navigation.navigate("Transaction Details", { hash: transaction.hash, amount: transaction.amount, timestamp: transaction.timestamp, block: transaction.height, size: transaction.size, fee: transaction.fee, version: transaction.version, confirmations: transaction.confirmations, pubKey: transaction.pubKey, ringCT_type: transaction.ringct_info }) }}>
				<Text style={[styles.item, { color: txColor, }]}><FontAwesome5 size={normalize(18)} name={"calendar-day"} color={txColor} solid />  {date}</Text>
				<Text style={[styles.item, { marginLeft: width * 0.15, color: txColor, }]}><FontAwesome5 size={normalize(18)} name={directionIcon} color={txColor} solid /> <Image source={require("../../Resources/Images/logo-circle-white-nofill.png")} style={styles.swapCurrencyLogo} /> {transaction.amount}</Text>
			</TouchableOpacity>
		);
	}

	constructor(props) {
		super(props);
		this.state = {
			rows: [<Progress.Bar key="progress" indeterminate={true} color="#22b6f2" unfilledColor="#a260f8" width={width * 0.75} height={8} />],
			statusText: "Prepairing",
		}
		this.getTransactions();
	}

	async getTransactions() {
		select("transactions").then(transactions => {
			const transactionsJson = transactions ? JSON.parse(transactions) : [];
			if (transactionsJson.length > 0) {
				this.hasInitialSync = true;
				let localRows = [];
				transactionsJson.map(transaction => {
					localRows.push(this.generate_transaction_row(transaction));
				});
				this.setState({
					rows: localRows,
					savedTransactions: localTransactions,
					statusText: "",
				});
			}
		}).catch(err => console.log("Error getting saved transactions:", err));

		const address = await select("walletAddress");
		const viewKey = await select("viewKey_sec");
		const transactions = await fetch("https://wallet.getswap.eu/api/get_address_txs", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				address: address,
				view_key: viewKey
			}),
		});
		const transactionsJSON = await transactions.json().catch(err => console.log("Error getting transactions for parsing:", err));
		let localTransactions = [];

		this.totalTransactions = transactionsJSON.transactions.length;
		this.transactionIndex = 0;
		for (let i = 0; i < transactionsJSON.transactions.length; i++) {
			localTransactions.push(await this.getTransactionDetails(address, viewKey, transactionsJSON.transactions[i].hash));
			this.transactionIndex++;
		}
		localTransactions.sort((a, b) => b.timestamp - a.timestamp);
		await insert("transactions", JSON.stringify(localTransactions));
		let localRows = [];
		localTransactions.map(transaction => {
			localRows.push(this.generate_transaction_row(transaction));
		});
		this.setState({
			rows: localRows,
			savedTransactions: localTransactions,
			statusText: "",
		});
		this.totalTransactions = -1;
		this.transactionIndex = -1;
	}

	getTransactionDetails(address, viewKey, tx_hash) {
		return new Promise((resolve, reject) => {
			!this.hasInitialSync && this.setState({
				rows: this.state.rows,
				savedTransactions: this.state.savedTransactions,
				statusText: `Parsing Transaction ${this.transactionIndex + 1}/${this.totalTransactions}`,
			});
			fetch("https://wallet.getswap.eu/api/get_tx", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					address: address,
					view_key: viewKey,
					tx_hash: tx_hash
				}),
			}).then(data => data.json().then(dataJson => {
				resolve({
					hash: dataJson.tx_hash,
					receiving: dataJson.total_sent > dataJson.total_received,
					amount: (dataJson.total_sent > dataJson.total_received) ? (dataJson.total_sent / 1000000000000).toPrecision(4) : (dataJson.total_received / 1000000000000).toPrecision(4),
					fee: dataJson.fee / 1000000000000, // AU to XWP
					timestamp: dataJson.timestamp,
					height: dataJson.tx_height,
					size: dataJson.size / 1000, // bytes to KB
					version: dataJson.tx_version,
					confirmations: dataJson.no_confirmations,
					pubKey: dataJson.pub_key,
					ringct_info: `YES/${dataJson.rct_type}`,
				});
			})).catch(err => reject("Error getting transaction details for parsing:" + err));
		});
	}

	render() {
		return (
			<View style={styles.mainView}>
				<Text style={[styles.titleText, { paddingBottom: height * 0.05, }]}>Transactions</Text>
				<ScrollView>
					<View style={styles.txContainer}>
						<Text style={styles.statusText}>{this.state.statusText}</Text>
						{this.state.rows}
					</View>
				</ScrollView>
			</View>
		);
	}
}
