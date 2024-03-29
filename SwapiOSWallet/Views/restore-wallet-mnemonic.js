import * as React from "react";
import { Alert, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import * as Settings from "../Helpers/settings";

const { width, height } = Dimensions.get("window");
const widthScale = width / 375;

// normalize the input so that it scales evenly across devices
function normalize(pre) {
	return Math.floor(pre * widthScale);
}

const handleMnemonic = (text) => {
	Settings.insert("mnemonic", text);
};

export default class SwapRestoreWalletFromMnemonic extends React.Component {
	constructor(props) {
		super(props);
	}

	mnemonicLogin() {
		Settings.select("mnemonic").then((mnemonic) => {
			if (mnemonic) {
				fetch("https://wallet.getswap.eu/mobileapi/login_with_mnemonic", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						mnemonic: mnemonic,
						nettype: 0,
					}),
				}).then((res) => res.json().then((walletDataJson) => {
					if (walletDataJson.success) {
						let data = "{\"withCredentials\":true,\"address\":\"" + walletDataJson.wallet.address_string + "\",\"view_key\":\"" + walletDataJson.wallet.sec_viewKey_string + "\",\"create_account\":true,\"generated_locally\":false}";
						fetch("https://wallet.getswap.eu/api/login", {
							method: "POST",
							headers: {
								"Content-Type": "application/json"
							},
							body: data
						}).then((res) => res.json().then((loginResponseJson) => {
							switch (loginResponseJson.status) {
							case "success":
								Settings.insert("defaultPage", "Wallet Home").then(() => {
									Settings.insert("spendKey_pub", walletDataJson.wallet.pub_spendKey_string).then(() => {
										Settings.insert("viewKey_pub", walletDataJson.wallet.pub_viewKey_string).then(() => {
											Settings.insert("walletAddress", walletDataJson.wallet.address_string).then(() => {
												Settings.insert("spendKey_sec", walletDataJson.wallet.sec_spendKey_string).then(() => {
													Settings.insert("viewKey_sec", walletDataJson.wallet.sec_viewKey_string).then(() => {
														Settings.insert("mnemonic", mnemonic).then(() => {
															this.props.navigation.navigate("Wallet Home");
														});
													});
												});
											});
										});
									});
								});
								break;
							case "error":
								alert("Login Error. Check your address and private key");
								break;
							default:
								alert("Login Error. Check your address and private key");
							}
						}));
					} else {
						switch (walletDataJson.err_msg) {
						case "Invalid 25-word mnemonic":
							alert("Invalid 25-word mnemonic");
							break;
						case "Please enter a 25- or 13-word secret mnemonic.":
							alert("Please enter a 25- or 13-word secret mnemonic");
							break;
						case "Invalid 13-word mnemonic":
							alert("Invalid 13-word mnemonic");
							break;
						default:
							alert("An unknown error occured while verifying your Mnemonic. Please try again.");
							break;
						}
					}
				})).catch(() => {
					Alert.alert("Error", "Failed to connect to our servers. Please check your internet connection and try again.");
				});
			} else {
				Alert.alert("Error", "Please enter a 13 or 25-word mnemonic");
			}
		});
	}

	render() {
		return (
			<View style={[styles.flexContainer, { backgroundColor: "#052344", flex: 1, }]}>
				<View style={[styles.flexContainer, { flex: 8, marginTop: normalize(15), paddingTop: height * 0.1, }]}>
					<View style={[styles.flexContainerChild, { flex: 2, marginTop: height * 0.05, }]}>
						<Text style={{ flexDirection: "row" }} onPress={() => this.props.navigation.navigate("Restore Wallet")}>
							<View style={[styles.flexContainer, { flexDirection: "row", }]}>
								<View style={{ flexDirection: "row", flexWrap: "wrap", marginLeft: normalize(20), }}>
									<Text style={styles.titleText}>Mnemonic</Text>
								</View>
							</View>
						</Text>
					</View>
					<View style={[styles.flexContainerChild, { flex: 2, marginTop: height * 0.05, }]}>
						<TextInput style={styles.textBox} placeholder='Mnemonic' placeholderTextColor='#c9c9c9' autoCapitalize='none' onChangeText={handleMnemonic}></TextInput>
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