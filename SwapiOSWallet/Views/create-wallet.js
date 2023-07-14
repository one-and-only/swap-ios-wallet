import * as React from "react";
import { Alert, Dimensions, View } from "react-native";
import * as Progress from "react-native-progress";

import * as Settings from "../Helpers/settings";

const { width, height } = Dimensions.get("window");
const widthScale = width / 375;

export default class SwapCreateWallet extends React.Component {
	constructor(props) {
		super(props);

		async function create_wallet(props) {
			const new_wallet = await (await fetch(process.env.MOBILE_WALLET_API_PREFIX)).json();

			await Settings.insert("spendKey_pub", new_wallet.spendKey_pub);
			await Settings.insert("viewKey_pub", new_wallet.viewKey_pub);
			await Settings.insert("spendKey_sec", new_wallet.spendKey_sec);
			await Settings.insert("viewKey_sec", new_wallet.viewKey_sec);
			await Settings.insert("mnemonic", new_wallet.mnemonic);
			await Settings.insert("walletAddress", new_wallet.wallet_address);
			await Settings.insert("defaultPage", "Wallet Home");
			props.navigation.navigate("Wallet Home");
		}

		create_wallet(this.props);
	}

	render() {
		return (
			<View style={{ backgroundColor: "#052344", paddingBottom: height * 0.5, }}>
				<Progress.CircleSnail size={normalize(300, widthScale)} indeterminate={true} color={["#22b6f2", "#a260f8"]} indeterminateAnimationDuration='500' style={{ marginTop: height * 0.2 }} />
			</View>
		);
	}
}