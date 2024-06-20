import * as React from "react";
import { Alert, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Clipboard from '@react-native-clipboard/clipboard';

import * as Settings from "../Helpers/settings";
import { normalize } from "../Helpers/gui";

const { width, height } = Dimensions.get("window");
const widthScale = width / 375;

export default class SwapRestoreWalletFromMnemonic extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			enteredMnemonic: ""
		};
	}

	// change to const handleMnemonic ...
	handleMnemonic = (text) => {
		this.setState({
			enteredMnemonic: text
		});
	}

	async mnemonicLogin() {
		if (this.state.enteredMnemonic === "") {
			Alert.alert("Error", "Please enter your mnemonic");
			return;
		}

		const response = await (await fetch("https://wallet.getswap.eu/mobileapi/restore_from_mnemonic", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				mnemonic: this.state.enteredMnemonic
			})
		})).json();

		if (!response.success) {
			Alert.alert("Error", "Invalid mnemonic");
			return;
		}

		await Settings.insert("mnemonic", this.state.enteredMnemonic);
		await Settings.insert("spendKey_pub", response.public_spend_key);
		await Settings.insert("viewKey_pub", response.public_view_key);
		await Settings.insert("spendKey_sec", response.private_spend_key);
		await Settings.insert("viewKey_sec", response.private_view_key);
		await Settings.insert("walletAddress", response.address);
		await Settings.insert("defaultPage", "Wallet Home");
		this.props.navigation.navigate("Wallet Home");
	}

	render() {
		return (
			<View style={[styles.flexContainer, { backgroundColor: "#052344", flex: 1, }]}>
				<View style={[styles.flexContainer, { flex: 8, marginTop: normalize(60, widthScale), paddingTop: height * 0.1, }]}>
					<View style={[styles.flexContainerChild, { flex: 2, marginTop: height * 0.05, }]}>
						<Text style={{ flexDirection: "row" }} onPress={() => this.props.navigation.navigate("Restore Wallet")}>
							<View style={[styles.flexContainer, { flexDirection: "row", }]}>
								<View style={{ flexDirection: "row", flexWrap: "wrap", }}>
									<Text style={styles.titleText}>Enter Mnemonic:</Text>
								</View>
							</View>
						</Text>
					</View>
					<View style={[styles.flexContainerChild, { flex: 10, marginTop: height * 0.05, }]}>
						<TextInput value={this.state.enteredMnemonic} style={styles.textBox} placeholder='Mnemonic...' placeholderTextColor='#c9c9c9' autoCapitalize='none' autoCorrect={false} returnKeyType="done" onChangeText={this.handleMnemonic}></TextInput>
					</View>
					<View style={[styles.flexContainerChild, { flex: 12, marginTop: height * 0.05, }]}>
					<TouchableOpacity onPress={async () => this.setState({ enteredMnemonic: await Clipboard.getString() })} style={styles.buttonContainer}>
						<Text style={styles.buttonText}>Paste From Clipboard</Text>
					</TouchableOpacity>
					</View>
				</View>
				<View style={[styles.flexContainer, { flex: 4, }]}></View>
				<View style={[styles.flexContainer, { backgroundColor: "#052344", flex: 8, }]}>
					<View style={[styles.flexContainerChild, { flexDirection: "row", flex: 1, marginTop: height * 0.1, }]}>
						<TouchableOpacity onPress={() => this.props.navigation.goBack()} style={[styles.buttonContainer, { marginRight: width * 0.05 }]}>
							<Text style={styles.buttonText}>Cancel</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => this.mnemonicLogin()} style={styles.buttonContainer}>
							<Text style={styles.buttonText}>Open Wallet</Text>
						</TouchableOpacity>
					</View>
					<View style={[styles.flexContainerChild, { flex: 1, marginTop: height * 0.05, }]}>
						<Text style={{ color: "white", alignSelf: "center", fontWeight: "700", fontSize: normalize(14, widthScale) }}>
						</Text>
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	buttonContainer: {
		backgroundColor: "#2074d4",
		borderRadius: 5,
		elevation: 8,
		paddingHorizontal: 12,
		paddingVertical: 10,
	},

	buttonText: {
		alignSelf: "center",
		color: "white",
		fontSize: 18,
		fontWeight: "700",
	},

	flexContainer: {
		alignItems: "center",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center"
	},

	flexContainerChild: {
		alignItems: "baseline",
		maxWidth: width * 0.9,
		textAlign: "left",
	},

	textBox: {
		color: "white",
		fontSize: normalize(22, widthScale),
		height: 45,
	},

	titleText: {
		color: "white",
		fontSize: normalize(30, widthScale),
	},
});