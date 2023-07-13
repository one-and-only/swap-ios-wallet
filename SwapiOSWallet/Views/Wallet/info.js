import * as React from "react";
import { Dimensions, Text, ScrollView, StyleSheet, TouchableOpacity, } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";

import * as Settings from "../../Helpers/settings";
import { normalize } from "../../Helpers/gui";

const { width, height } = Dimensions.get("window");
const widthScale = width / 375;

export default class SwapWalletInfo extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mnemonic: "Fetching...",
			address: "Fetching...",
			viewKey_sec: "Fetching...",
			viewKey_pub: "Fetching...",
			spendKey_sec: "Fetching...",
			spendKey_pub: "Fetching...",
		};

		const mnemonic = Settings.select("mnemonic");
		const address = Settings.select("walletAddress");
		const viewKeySec = Settings.select("viewKey_sec");
		const viewKeyPub = Settings.select("viewKey_pub");
		const spendKeySec = Settings.select("spendKey_sec");
		const spendKeyPub = Settings.select("spendKey_pub");

		Promise.all([mnemonic, address, viewKeySec, viewKeyPub, spendKeySec, spendKeyPub]).then(wallet => {
			this.setState({
				mnemonic: wallet[0],
				address: wallet[1],
				viewKey_sec: wallet[2],
				viewKey_pub: wallet[3],
				spendKey_sec: wallet[4],
				spendKey_pub: wallet[5],
			});
		});
	}

	render() {
		return (
			<ScrollView style={{ backgroundColor: "#052344", paddingBottom: height * 0.5, paddingLeft: normalize(10, widthScale), paddingTop: height * 0.02, }}>
				<TouchableOpacity onPress={() => { Clipboard.setString(this.state.mnemonic); alert("Copied Mnemonic to Clipboard"); }}><Text style={styles.text}>Mnemonic Seed (Private): <Text style={{ fontSize: normalize(15, widthScale), }}>{this.state.mnemonic}</Text></Text></TouchableOpacity>
				<TouchableOpacity onPress={() => { Clipboard.setString(this.state.address); alert("Copied Wallet Address to Clipboard"); }}><Text style={styles.text}>Account Address (Public): <Text style={{ fontSize: normalize((15, widthScale),) }}>{this.state.address}</Text></Text></TouchableOpacity>
				<TouchableOpacity onPress={() => { Clipboard.setString(this.state.viewKey_sec); alert("Copied Private View Key to Clipboard"); }}><Text style={styles.text}>View Key (Private): <Text style={{ fontSize: normalize((15, widthScale),) }}>{this.state.viewKey_sec}</Text></Text></TouchableOpacity>
				<TouchableOpacity onPress={() => { Clipboard.setString(this.state.spendKey_sec); alert("Copied  Private Spend Key to Clipboard"); }}><Text style={styles.text}>Spend Key (Private): <Text style={{ fontSize: normalize((15, widthScale),) }}>{this.state.spendKey_sec}</Text></Text></TouchableOpacity>
				<TouchableOpacity onPress={() => { Clipboard.setString(this.state.viewKey_pub); alert("Copied Public View Key to Clipboard"); }}><Text style={styles.text}>View Key (Public): <Text style={{ fontSize: normalize((15, widthScale),) }}>{this.state.viewKey_pub}</Text></Text></TouchableOpacity>
				<TouchableOpacity onPress={() => { Clipboard.setString(this.state.spendKey_pub); alert("Copied Public Spend Key to Clipboard"); }}><Text style={styles.text}>Spend Key (Public): <Text style={{ fontSize: normalize((15, widthScale),) }}>{this.state.spendKey_pub}</Text></Text></TouchableOpacity>
			</ScrollView>
		);
	}

}

const styles = StyleSheet.create({
	text: {
		color: "white",
		fontSize: normalize(20, widthScale),
		padding: normalize(5, widthScale),
	}
});