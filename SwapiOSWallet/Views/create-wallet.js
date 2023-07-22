import { MOBILE_WALLET_API_PREFIX } from "@config";
import * as React from "react";
import { Alert, Dimensions, View } from "react-native";
import * as Progress from "react-native-progress";

import * as Settings from "../Helpers/settings";
import { normalize } from "../Helpers/gui";

const { width, height } = Dimensions.get("window");
const widthScale = width / 375;

export default class SwapCreateWallet extends React.Component {
	async create_wallet(props) {
		try {
			console.log(`${MOBILE_WALLET_API_PREFIX}/create_wallet`);
			const new_wallet = await (await fetch(`${MOBILE_WALLET_API_PREFIX}/create_wallet`)).json();

			await Settings.insert("spendKey_pub", new_wallet.public_spend_key);
			await Settings.insert("viewKey_pub", new_wallet.public_view_key);
			await Settings.insert("spendKey_sec", new_wallet.private_spend_key);
			await Settings.insert("viewKey_sec", new_wallet.private_view_key);
			await Settings.insert("mnemonic", new_wallet.mnemonic);
			await Settings.insert("walletAddress", new_wallet.address);
			await Settings.insert("defaultPage", "Wallet Home");
			props.navigation.navigate("Wallet Home");
		} catch (e) {
			Alert.alert("Error", `Error while running the create wallet API request`);
			console.log(e);
			props.navigation.navigate("Home");
		}
	}	
	
	constructor(props) {
		super(props);

		this.create_wallet(this.props);
	}

	render() {
		return (
			<View style={{ backgroundColor: "#052344", paddingBottom: height * 0.5, }}>
				<Progress.CircleSnail size={normalize(300, widthScale)} indeterminate={true} color={["#22b6f2", "#a260f8"]} indeterminateAnimationDuration='500' style={{ marginTop: height * 0.2 }} />
			</View>
		);
	}
}