import * as React from "react";
import { Dimensions, Text, View, StyleSheet, TextInput, Image, TouchableOpacity, Alert } from "react-native";
import * as Progress from "react-native-progress";

import * as Settings from "../../Helpers/settings";
import * as Blockchain from "../../Helpers/blockchain";

const { width, height } = Dimensions.get("window");
const widthScale = width / 375;
var auToSend = "";
var addressToSendTo = "";

// normalize the input so that it scales evenly across devices
function normalize(pre) {
	return Math.floor(pre * widthScale);
}

const handleAmount = (text) => {
	auToSend = text;
};

const handleAddress = (text) => {
	addressToSendTo = text;
};

export default class SwapSend extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			spendKey: "Fetching...",
			statusText: "",
			progressBar: null,
		};

		const spendKeyPromise = Settings.select("spendKey");

		Promise.all([spendKeyPromise]).then((settings) => {
			let spendKey;

			(settings[0] != null) ? spendKey = settings[0] : spendKey = "";

			this.setState({
				spendKey: spendKey,
				statusText: this.state.statusText,
				progressBar: this.state.progressBar,
			});
		});
	}

	async sendXWP() {
		const address = await Settings.select("walletAddress");
		const viewKey = await Settings.select("viewKey_sec");
		const spendKey_pub = await Settings.select("spendKey_pub");
		const spendKey_sec = await Settings.select("spendKey_sec");

		this.setState({
			spendKey: this.state.spendKey,
			statusText: "Status: Checking Wallet Status",
			progressBar: <Progress.Bar indeterminate={true} color="#22b6f2" unfilledColor="#a260f8" width={width * 0.75} height={8} />,
		});

		const walletIsSynced = await Blockchain.walletSynced();

		if (walletIsSynced) {
			this.setState({
				spendKey: this.state.spendKey,
				statusText: "Status: Sending XWP",
				progressBar: <Progress.Bar indeterminate={true} color="#22b6f2" unfilledColor="#a260f8" width={width * 0.75} height={8} />,
			});

			const data = JSON.stringify({
				"from_address_string": address,
				"view_key": viewKey,
				"spendKey_sec": spendKey_sec,
				"spendKey_pub": spendKey_pub,
				"is_sweeping": false,
				"payment_id_string": null,
				"sending_amount": auToSend,
				"to_address_string": addressToSendTo,
				"priority": 1,
				"nettype": 0
			});

			await fetch("https://wallet.getswap.eu/mobileapi/send_funds", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Content-Length": data.length,
				},
				body: data,
			}).then(response => response.json().then(responseJson => {
				switch (responseJson.success) {
				case true:
					Alert.alert("Success", `Sucessfully sent ${auToSend} XWP.\n\nPlease check the Transactions page for more details.`);
					break;
				case false:
					Alert.alert("Error", `Error sending ${auToSend} XWP:\n\n${responseJson.err_msg}`);
					break;
				default:
					Alert.alert("Error", `An unkown error occured while sending ${auToSend} XWP. Please notify the developers of the app. Raw error message:\n\n${responseJson}`);
				}
			}).catch(error => console.log("error while sending XWP:", error)));
		} else {
			Alert.alert("Error", `Error sending ${auToSend} XWP:\n\nYour wallet is not synchronized yet. Please wait until it is synchronized and try again later.`);
		}

		this.setState({
			spendKey: this.state.spendKey,
			statusText: "",
			progressBar: null,
		});
	}

	render() {
		return (
			<View style={styles.mainView}>
				<View style={{ flex: 3 }}>
					<View style={{ flexDirection: "row", marginTop: normalize(10), }}>
						<Text style={styles.text}>Amount:</Text>
						<View style={[styles.flexContainerChild, { marginLeft: normalize(10), }]}>
							<TextInput style={[styles.text, styles.textBox]} underlineColorAndroid='transparent' placeholder='Amount' placeholderTextColor='#c9c9c9' autoCapitalize='none' keyboardType='decimal-pad' onChangeText={handleAmount}></TextInput>
							<Image style={[styles.balanceImage, { marginLeft: normalize(5), marginTop: normalize(5), }]} source={require("../../Resources/Images/logo-circle-white-nofill.png")} />
						</View>
					</View>
					<View style={{ flexDirection: "row", marginTop: normalize(15), }}>
						<Text style={styles.text}>Address:</Text>
						<View style={[styles.flexContainerChild, { marginLeft: normalize(10), }]}>
							<TextInput style={[styles.text, styles.textBox]} underlineColorAndroid='transparent' placeholder='Address' placeholderTextColor='#c9c9c9' autoCapitalize='none' keyboardType='ascii-capable' onChangeText={handleAddress}></TextInput>
							<Image style={[styles.addressImage, { marginLeft: normalize(5), marginTop: normalize(7), marginBottom: normalize(3), }]} source={require("../../Resources/Images/address-book.png")} />
						</View>
					</View>
				</View>
				<View>
					<Text style={styles.statusText}>{this.state.statusText}</Text>
					{this.state.progressBar}
				</View>
				<View style={[styles.flexContainerChild, { flex: 1, marginTop: height * 0.3, }]}>
					<TouchableOpacity onPress={() => this.sendXWP()} style={[styles.buttonContainer, { marginRight: width * 0.05 }]}>
						<Text style={styles.buttonText}>Send</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.buttonContainer}>
						<Text style={styles.buttonText}>Cancel</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	addressImage: {
		height: normalize(22),
		width: normalize(24.68),
	},
	balanceImage: {
		height: normalize(22),
		width: normalize(22),
	},

	buttonContainer: {
		backgroundColor: "#2074d4",
		borderRadius: 5,
		elevation: 8,
		height: height * 0.06,
		paddingHorizontal: 12,
		paddingVertical: 10,
	},

	buttonText: {
		alignSelf: "center",
		color: "#fff",
		fontSize: normalize(18),
		fontWeight: "700",
	},

	flexContainerChild: {
		flexDirection: "row",
	},

	mainView: {
		alignItems: "center",
		backgroundColor: "#052344",
		display: "flex",
		flexDirection: "column",
		flex: 1,
		justifyContent: "flex-start",
		paddingLeft: width * 0.025,
	},

	statusText: {
		color: "white",
		fontSize: normalize(18),
		margin: normalize(12),
		textAlign: "center",
	},

	text: {
		color: "white",
		fontSize: normalize(22),
	},

	textBox: {
		maxWidth: width * 0.6,
	},
});