import * as React from "react";
import { Dimensions, Text, View, StyleSheet, TextInput, Image, TouchableOpacity, Alert } from "react-native";
import * as Progress from "react-native-progress";

import * as Settings from "../../Helpers/settings";
import { normalize } from "../../Helpers/gui";

const { width, height } = Dimensions.get("window");
const widthScale = width / 375;
var auToSend = "";
var addressToSendTo = "";

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
		})).catch(() => Alert.alert("Error", "Failed to connect to our servers. Check your internet connection and try again."));

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
					<View style={{ flexDirection: "row", marginTop: normalize(10, widthScale), }}>
						<Text style={styles.text}>Amount:</Text>
						<View style={[styles.flexContainerChild, { marginLeft: normalize(10, widthScale), }]}>
							<TextInput style={[styles.text, styles.textBox]} underlineColorAndroid='transparent' placeholder='Amount' placeholderTextColor='#c9c9c9' autoCapitalize='none' keyboardType='decimal-pad' onChangeText={handleAmount}></TextInput>
							<Image style={[styles.balanceImage, { marginLeft: normalize(5, widthScale), marginTop: normalize(5, widthScale), }]} source={require("../../Resources/Images/logo-circle-white-nofill.png")} />
						</View>
					</View>
					<View style={{ flexDirection: "row", marginTop: normalize(15, widthScale), }}>
						<Text style={styles.text}>Address:</Text>
						<View style={[styles.flexContainerChild, { marginLeft: normalize(10, widthScale), }]}>
							<TextInput style={[styles.text, styles.textBox]} underlineColorAndroid='transparent' placeholder='Address' placeholderTextColor='#c9c9c9' autoCapitalize='none' keyboardType='ascii-capable' onChangeText={handleAddress}></TextInput>
							<Image style={[styles.addressImage, { marginLeft: normalize(5, widthScale), marginTop: normalize(7, widthScale), marginBottom: normalize(3, widthScale), }]} source={require("../../Resources/Images/address-book.png")} />
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
		height: normalize(22, widthScale),
		width: normalize(24.68, widthScale),
	},
	balanceImage: {
		height: normalize(22, widthScale),
		width: normalize(22, widthScale),
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
		fontSize: normalize(18, widthScale),
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
		fontSize: normalize(18, widthScale),
		margin: normalize(12, widthScale),
		textAlign: "center",
	},

	text: {
		color: "white",
		fontSize: normalize(22, widthScale),
	},

	textBox: {
		maxWidth: width * 0.6,
	},
});