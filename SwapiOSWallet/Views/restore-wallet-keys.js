import * as React from "react";
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";

import * as Settings from "../Helpers/settings";
import { normalize } from "../Helpers/gui";

const { width, height } = Dimensions.get("window");
const widthScale = width / 375;

const handleWalletAddress = (text) => {
	Settings.insert("walletAddress", text);
};

const handleViewKey = (text) => {
	Settings.insert("viewKey_sec", text);
};

async function handleSpendKey(text) {
	await Settings.insert("spendKey_sec", text);
}

export default class SwapRestoreWalletFromKeys extends React.Component {
	constructor(props) {
		super(props);
	}

	async restoreWalletFromKeys() {
		const address = await Settings.select("walletAddress");
		const private_view_key = await Settings.select("viewKey_sec");
		const private_spend_key = await Settings.select("spendKey_sec");

		const response = await (await fetch("https://wallet.getswap.eu/mobileapi/restore_from_keys", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				private_view_key: private_view_key,
				private_spend_key: private_spend_key,
				address: address
			}),
		})).json();

		if (!response.success) {
			Alert.alert("Error", "One or more invalid private keys");
			return;
		}

		await Settings.insert("defaultPage", "Wallet Home");
		this.props.navigation.navigate(await Settings.select("defaultPage"));
	}

	render() {
		return (
			<View style={[styles.flexContainer, { backgroundColor: "#052344", flex: 1, }]}>
				<View style={[styles.flexContainer, { flex: 8, marginTop: normalize(15, widthScale), paddingTop: height * 0.1, }]}>
					<View style={[styles.flexContainerChild, { flex: 2, marginTop: height * 0.05, }]}>
						<Text style={{ flexDirection: "row" }} onPress={() => this.props.navigation.navigate("Restore Wallet")}>
							<View style={[styles.flexContainer, { flexDirection: "row", width: "90%", }]}>
								<View style={{ flexDirection: "row", flexWrap: "wrap", marginLeft: normalize(20, widthScale), }}>
									<Text style={styles.titleText}>Wallet Address</Text>
								</View>
							</View>
						</Text>
					</View>
					<View style={[styles.flexContainerChild, { flex: 2, marginTop: height * 0.05, }]}>
						<TextInput style={styles.textBox} placeholder='Wallet Address' placeholderTextColor='#c9c9c9' autoCapitalize='none' onChangeText={handleWalletAddress}></TextInput>
					</View>
					<View style={[styles.flexContainerChild, { flex: 2, marginTop: height * 0.05, }]}>
						<Text style={{ flexDirection: "row" }} onPress={() => this.props.navigation.navigate("Restore Wallet")}>
							<Text style={[styles.flexContainer, { flexDirection: "row", width: "90%", }]}>
								<View style={{ flexDirection: "row", flexWrap: "wrap", }}>
									<Text style={styles.titleText}>Private View Key</Text>
								</View>
							</Text>
						</Text>
					</View>
					<View style={[styles.flexContainerChild, { flex: 2, marginTop: height * 0.05, }]}>
						<TextInput style={styles.textBox} placeholder='View Key' placeholderTextColor='#c9c9c9' autoCapitalize='none' onChangeText={handleViewKey}></TextInput>
					</View>
					<View style={[styles.flexContainerChild, { flex: 2, marginTop: height * 0.05, }]}>
						<Text style={{ flexDirection: "row" }} onPress={() => this.props.navigation.navigate("Restore Wallet")}>
							<Text style={[styles.flexContainer, { flexDirection: "row", width: "90%", }]}>
								<View style={{ flexDirection: "row", flexWrap: "wrap", }}>
									<Text style={styles.titleText}>Private Spend Key</Text>
								</View>
							</Text>
						</Text>
					</View>
					<View style={[styles.flexContainerChild, { flex: 2, marginTop: height * 0.05, }]}>
						<TextInput style={styles.textBox} placeholder='Private Spend Key' placeholderTextColor='#c9c9c9' autoCapitalize='none' onChangeText={handleSpendKey}></TextInput>
					</View>
				</View>
				<View style={[styles.flexContainer, { flex: 4, }]}></View>
				<View style={[styles.flexContainer, { backgroundColor: "#052344", flex: 8, }]}>
					<View style={[styles.flexContainerChild, { flexDirection: "row", flex: 1, marginTop: height * 0.1, }]}>
						<TouchableOpacity onPress={() => this.props.navigation.goBack()} style={[styles.buttonContainer, { marginRight: width * 0.05 }]}>
							<Text style={styles.buttonText}>Cancel</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={this.restoreWalletFromKeys} style={styles.buttonContainer}>
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