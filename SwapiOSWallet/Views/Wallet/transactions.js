import * as React from "react";
import { Dimensions, Text, View, StyleSheet, TouchableOpacity, Image, Alert, FlatList } from "react-native";
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
		alignItems: "center"
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

	swapCurrencyLogo: {
		height: normalize(22),
		width: normalize(22),
	},

	statusText: {
		textAlign: "center",
		color: "white",
		fontSize: normalize(18),
		marginTop: normalize(10),
		marginBottom: normalize(10),
	},
});

export default class SwapTransactions extends React.Component {
	transactionIndex = -1; // index of the transaction we're parsing; needed because of Promise.all (async, but much faster)
	totalTransactions = -1;
	hasInitialSync = false;

	generate_transaction_row({ item: transaction }) {
		const date = new Date(transaction.timestamp).toLocaleDateString();
		const txColor = (transaction.receiving) ? "lime" : "orange";
		const directionIcon = (transaction.receiving) ? "arrow-down" : "arrow-up";
		return (
			// we need some sort of unique key for each row so RN doesn't complain. tx_hash works great for this
			<TouchableOpacity style={styles.row} onPress={() => { this.props.navigation.navigate("Transaction Details", { hash: transaction.hash, amount: transaction.amount, timestamp: transaction.timestamp, block: transaction.height, size: transaction.size, fee: transaction.fee, version: transaction.version, confirmations: transaction.confirmations, pubKey: transaction.pubKey, ringCT_type: transaction.ringct_info }) }}>
				<Text style={[styles.item, { color: txColor, }]}><FontAwesome5 size={normalize(18)} name={"calendar-day"} color={txColor} solid />  {date}</Text>
				<Text style={[styles.item, { marginLeft: width * 0.15, color: txColor, }]}><FontAwesome5 size={normalize(18)} name={directionIcon} color={txColor} solid /> <Image source={require("../../Resources/Images/logo-circle-white-nofill.png")} style={styles.swapCurrencyLogo} /> {transaction.amount}</Text>
			</TouchableOpacity>
		);
	}

	extractTransactionRowKey(transaction) {
		return transaction.hash;
	}

	constructor(props) {
		super(props);
		this.state = {
			rows: [<Progress.Bar key="progress" indeterminate={true} color="#22b6f2" unfilledColor="#a260f8" width={width * 0.75} height={8} />],
			statusText: "Prepairing",
		}
		this.getTransactions();
	}

	getItemLayout(data, index) {
		return {
			length: 54, // 44 item height, 10 item padding
			offset: 54 * index,
			index
		}
	}

	async getTransactions() {
		select("transactions").then(transactions => {
			const transactionsJson = transactions ? JSON.parse(transactions) : [];
			if (transactionsJson.length > 0) {
				this.hasInitialSync = true;
				this.setState({
					rows: <FlatList
						data={transactionsJson}
						renderItem={this.generate_transaction_row}
						keyExtractor={this.extractTransactionRowKey}
						getItemLayout={this.getItemLayout}
						maxToRenderPerBatch={(height / 54) * 2}
						initialNumToRender={(height / 54) * 2}
					/>,
					savedTransactions: transactionsJson,
					statusText: "",
				});
			}
		}).catch(err => console.log("Error getting saved transactions:", err));

		const address = await select("walletAddress");
		const viewKey = await select("viewKey_sec");
		fetch("https://wallet.getswap.eu/api/get_address_txs", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				address: address,
				view_key: viewKey
			}),
		}).then((res) => res.json().then(async (transactionsJSON) => {
			let localTransactions = [];

			this.totalTransactions = transactionsJSON.transactions.length;
			this.transactionIndex = 0;
			for (let i = 0; i < transactionsJSON.transactions.length; i++) {
				localTransactions.push(await this.getTransactionDetails(address, viewKey, transactionsJSON.transactions[i].hash));
				this.transactionIndex++;
			}
			localTransactions.sort((a, b) => b.timestamp - a.timestamp);
			await insert("transactions", JSON.stringify(localTransactions));
			this.setState({
				rows: <FlatList
					data={localTransactions}
					renderItem={this.generate_transaction_row}
					keyExtractor={this.extractTransactionRowKey}
					getItemLayout={this.getItemLayout}
					maxToRenderPerBatch={(height / 54) * 2}
					initialNumToRender={(height / 54) * 2}
				/>,
				savedTransactions: localTransactions,
				statusText: "",
			});
			this.totalTransactions = -1;
			this.transactionIndex = -1;
		})).catch(() => {
			this.props.navigation.navigate("Wallet");
			Alert.alert("Error", "Failed to connect to our servers. Please check your internet connection and try again.")
		});
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
					amount: (dataJson.total_sent > dataJson.total_received) ? ((dataJson.total_sent - dataJson.total_received) / 1000000000000).toPrecision(4) : ((dataJson.total_received - dataJson.total_sent) / 1000000000000).toPrecision(4),
					fee: dataJson.fee / 1000000000000, // AU to XWP
					timestamp: dataJson.timestamp,
					height: dataJson.tx_height,
					size: dataJson.size / 1000, // bytes to KB
					version: dataJson.tx_version,
					confirmations: dataJson.no_confirmations,
					pubKey: dataJson.pub_key,
					ringct_info: `YES/${dataJson.rct_type}`,
				});
			})).catch(() => {
				Alert.alert("Error", "Failed to connect to our servers. Check your internet connection and try again.");
				reject("No Internet");
			});
		});
	}

	render() {
		return (
			<View style={styles.mainView}>
				<Text style={styles.statusText}>{this.state.statusText}</Text>
				{this.state.rows}
			</View>
		);
	}
}
