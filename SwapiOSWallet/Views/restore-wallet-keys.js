import * as React from "react";
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";

import * as Settings from "../Helpers/settings";

const { width, height } = Dimensions.get("window");
const widthScale = width / 375;

// normalize the input so that it scales evenly across devices
function normalize(pre) {
	return Math.floor(pre * widthScale);
}

const handleWalletAddress = (text) => {
	Settings.insert("walletAddress", text);
};

const handleViewKey = (text) => {
	Settings.insert("viewKey", text);
};

export default class SwapRestoreWalletFromKeys extends React.Component {
	constructor(props) {
		super(props);
	}

	restoreWalletFromKeys() {
		let addressPromise = Settings.select("walletAddress"),
			viewKeyPromise = Settings.select("viewKey_sec");
		Promise.all([addressPromise, viewKeyPromise]).then((walletInfo) => {
			let payload =
				"{\"withCredentials\":true,\"address\":\"" +
				walletInfo[0] +
				"\",\"view_key\":\"" +
				walletInfo[1] +
				"\",\"create_account\":true,\"generated_locally\":false}";
			fetch("https://wallet.getswap.eu/api/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: payload,
			})
				.then((res) => res.json())
				.then((res) => {
					switch (res.status) {
					case "success":
						Settings.insert("defaultPage", "Wallet Home").then(() => {
							Settings.select("defaultPage").then((defaultPage) =>
								this.props.navigation.navigate(defaultPage)
							);
						});
						break;
					case "error":
						Alert.alert("Login Error. Check your address and private key");
					}
				})
				.catch(() => {
					Alert.alert("Error", "Failed to connect to our servers. Check your internet connection and try again!");
				});
		});
	}

	render() {
		return (
			<View style={[styles.flexContainer, { backgroundColor: "#052344", flex: 1, }]}>
				<View style={[styles.flexContainer, { flex: 8, marginTop: normalize(15), paddingTop: height * 0.1, }]}>
					<View style={[styles.flexContainerChild, { flex: 2, marginTop: height * 0.05, }]}>
						<Text style={{ flexDirection: "row" }} onPress={() => this.props.navigation.navigate("Restore Wallet")}>
							<View style={[styles.flexContainer, { flexDirection: "row", width: "90%", }]}>
								<View style={{ flexDirection: "row", flexWrap: "wrap", marginLeft: normalize(20), }}>
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
									<Text style={styles.titleText}>View Key</Text>
								</View>
							</Text>
						</Text>
					</View>
					<View style={[styles.flexContainerChild, { flex: 2, marginTop: height * 0.05, }]}>
						<TextInput style={styles.textBox} placeholder='View Key' placeholderTextColor='#c9c9c9' autoCapitalize='none' onChangeText={handleViewKey}></TextInput>
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
						<Text style={{ color: "white", alignSelf: "center", fontWeight: "700", fontSize: normalize(14) }}>
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
		fontSize: normalize(22),
		height: 45,
	},

	titleText: {
		color: "white",
		fontSize: normalize(30),
	},
});