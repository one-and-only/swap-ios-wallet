import * as React from "react";
import { Dimensions, Text, ScrollView, StyleSheet, } from "react-native";

import * as Settings from "../../Helpers/settings";

const {width, height} = Dimensions.get("window");
const widthScale = width/375;

// normalize the input so that it scales evenly across devices
function normalize (pre) {
	return Math.floor(pre * widthScale);
}

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

		mnemonic = Settings.select("mnemonic");
		address = Settings.select("walletAddress");
		viewKeySec = Settings.select("viewKey_sec");
		viewKeyPub = Settings.select("viewKey_pub");
		spendKeySec = Settings.select("spendKey_sec");
		spendKeyPub = Settings.select("spendKey_pub");

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
			<ScrollView style={{backgroundColor: "#052344", paddingBottom: height * 0.5, paddingLeft: normalize(10), paddingTop: height * 0.02,}}>
				<Text style={styles.text}>Mnemonic Seed (Private): <Text style={{fontSize: normalize(15),}}>{this.state.mnemonic}</Text></Text>
				<Text style={styles.text}>Account Address (Public): <Text style={{fontSize: normalize((15),)}}>{this.state.address}</Text></Text>
				<Text style={styles.text}>View Key (Private): <Text style={{fontSize: normalize((15),)}}>{this.state.viewKey_sec}</Text></Text>
				<Text style={styles.text}>Spend Key (Private): <Text style={{fontSize: normalize((15),)}}>{this.state.spendKey_sec}</Text></Text>
				<Text style={styles.text}>View Key (Public): <Text style={{fontSize: normalize((15),)}}>{this.state.viewKey_pub}</Text></Text>
				<Text style={styles.text}>Spend Key (Public): <Text style={{fontSize: normalize((15),)}}>{this.state.spendKey_pub}</Text></Text>
			</ScrollView>
		);
	}

}

const styles = StyleSheet.create({
	text: {
		color: "white",
		fontSize: normalize(20),
		padding: normalize(5),
	}
});