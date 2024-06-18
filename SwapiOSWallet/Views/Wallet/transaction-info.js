import * as React from "react";
import { View, Dimensions, StyleSheet, Text, ScrollView, TouchableOpacity, } from "react-native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { normalize } from "../../Helpers/gui";

const { width, height } = Dimensions.get("window");
const widthScale = width / 375;

// initializing a simple letiable to store
// route parameters means less typing + cleaner code
let params = {};
let _txdate;
let _txage;

function formatTXAge(seconds) {
	seconds = Number(seconds);
	let d = Math.floor(seconds / (3600 * 24));
	let h = Math.floor(seconds % (3600 * 24) / 3600);
	let m = Math.floor(seconds % 3600 / 60);

	let dDisplay = d > 0 ? d + (d == 1 ? " Day, " : " Days, ") : "";
	let hDisplay = h > 0 ? h + (h == 1 ? " Hour, " : " Hours, ") : "";
	let mDisplay = m > 0 ? m + (m == 1 ? " Minute " : " Minutes ") : "";
	return dDisplay + hDisplay + mDisplay;
}

let confirmationColor;
let confirmationWarning;

export default class SwapTransactionInfo extends React.Component {
	constructor(props) {
		super(props);
		params = props.route.params;

		_txdate = new Date(params.timestamp).toLocaleDateString();
		_txage = formatTXAge((Date.now() - params.timestamp) / 1000);

		confirmationColor = params.confirmations > 0 ? "lime" : "orange";
		confirmationWarning = params.confirmations < 10 ? " (Unconfirmed)" : "";
	}

	render() {
		return (
			<ScrollView contentContainerStyle={styles.mainView}>
				<View style={[styles.propertyContainer, styles.text]}>
					<Text style={[styles.propertyText, styles.text]}><FontAwesome5 size={normalize(18, widthScale)} name={"calendar-day"} color={"white"} solid /> TX Date (Local): <Text style={{ color: "lime" }}>{_txdate}</Text></Text>
					<Text style={[styles.propertyText, styles.text]}><FontAwesome5 size={normalize(18, widthScale)} name={"cube"} color={"white"} solid /> Block: <Text style={{ color: "lime" }}>{params.block}</Text></Text>
					<Text style={[styles.propertyText, styles.text]}><FontAwesome5 size={normalize(18, widthScale)} name={"code-branch"} color={"white"} solid /> Tx Version: <Text style={{ color: "lime" }}>{params.version}</Text></Text>
					<Text style={[styles.propertyText, styles.text]}><FontAwesome5 size={normalize(18, widthScale)} name={"file-invoice-dollar"} color={"white"} solid /> Fee: <Text style={{ color: "lime" }}>{params.fee}</Text></Text>
					<Text style={[styles.propertyText, styles.text]}><FontAwesome5 size={normalize(18, widthScale)} name={"handshake"} color={"white"} solid /> # Of Confirmations: <Text style={{ color: confirmationColor }}>{params.confirmations}</Text>{confirmationWarning}</Text>
					<Text style={[styles.propertyText, styles.text]}><FontAwesome5 size={normalize(18, widthScale)} name={"clock"} color={"white"} solid /> Age: <Text style={{ color: "lime" }}>{_txage}</Text></Text>
					<Text style={[styles.propertyText, styles.text]}><FontAwesome5 size={normalize(18, widthScale)} name={"hdd"} color={"white"} solid /> Size: <Text style={{ color: "lime" }}>{params.size} kB</Text></Text>
					<Text style={[styles.propertyText, styles.text]}><FontAwesome5 size={normalize(18, widthScale)} name={"shield-alt"} color={"white"} solid /> RingCT/type: <Text style={{ color: "lime" }}>{params.ringCT_type}</Text></Text>
				</View>
				<View style={{ marginTop: normalize(height * 0.16, widthScale) }}></View>
				<TouchableOpacity onPress={() => this.props.navigation.navigate("Transactions")} style={styles.buttonContainer}>
					<Text style={styles.buttonText}>Show All Transactions</Text>
				</TouchableOpacity>
			</ScrollView>
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

	mainView: {
		alignItems: "center",
		backgroundColor: "#052344",
		display: "flex",
		flex: 1,
		flexDirection: "column",
		textAlign: "center",
	},

	propertyContainer: {
		justifyContent: "center",
	},

	propertyText: {
		fontSize: normalize(20, widthScale),
		margin: normalize(10, widthScale),
	},

	text: {
		color: "white",
	},
});
