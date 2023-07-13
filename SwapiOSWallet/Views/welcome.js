import React from "react";
import { Dimensions, Image, StyleSheet, Text, Alert, TouchableOpacity, View } from "react-native";

import { normalize } from "../Helpers/gui";

const { width, height } = Dimensions.get("window");
const widthScale = width / 375;

export default class SwapWelcome extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={[styles.flexContainer, { backgroundColor: "#052344", flex: 1, }]}>
				<View style={[styles.flexContainer, { flex: 4, marginTop: normalize(15, widthScale), }]}>
					<View style={[styles.flexContainerChild, { flex: 1, }]}>
						<TouchableOpacity style={{ flexDirection: "row", }} onPress={() => this.props.navigation.navigate("Create Wallet")}>
							<View style={[styles.flexContainer, { flexDirection: "row", width: "95%", }]}>
								<Image source={require("../Resources/Images/new-wallet.png")} style={{ height: normalize(50, widthScale), width: normalize(46, widthScale), resizeMode: "stretch" }} />
								<View style={{ flexDirection: "row", flexWrap: "wrap", marginLeft: normalize(15, widthScale), }}>
									<Text style={styles.optionTitle}>Create a new wallet</Text>
									<Text style={styles.optionBody}>Choose this option if this is your first time using Swap.</Text>
								</View>
							</View>
						</TouchableOpacity>
					</View>
					<View style={[styles.flexContainerChild, { flex: 1, marginLeft: normalize(5, widthScale), marginTop: height * 0.05, }]}>
						<TouchableOpacity style={{ flexDirection: "row" }} onPress={() => this.props.navigation.navigate("Restore Wallet From Keys")}>
							<View style={[styles.flexContainer, { flexDirection: "row", width: "90%", }]}>
								<Image source={require("../Resources/Images/restore-wallet.png")} style={{ height: normalize(75, widthScale), width: normalize(75, widthScale), resizeMode: "stretch" }} />
								<View style={{ flexDirection: "row", flexWrap: "wrap", marginLeft: normalize(10, widthScale), }}>
									<Text style={[styles.optionTitle, { fontSize: normalize(22, widthScale), }]}>Restore wallet from private keys</Text>
									<Text style={styles.optionBody}>Enter your address and view key</Text>
								</View>
							</View>
						</TouchableOpacity>
					</View>
					<View style={[styles.flexContainerChild, { flex: 1, marginLeft: normalize(5, widthScale), marginTop: height * 0.05, }]}>
						<TouchableOpacity style={{ flexDirection: "row" }} onPress={() => this.props.navigation.navigate("Restore Wallet From Mnemonic")}>
							<View style={[styles.flexContainer, { flexDirection: "row", width: "90%", }]}>
								<Image source={require("../Resources/Images/restore-wallet.png")} style={{ height: normalize(75, widthScale), width: normalize(75, widthScale), resizeMode: "stretch" }} />
								<View style={{ flexDirection: "row", flexWrap: "wrap", marginLeft: normalize(10, widthScale), }}>
									<Text style={[styles.optionTitle, { fontSize: normalize(22, widthScale), }]}>Restore wallet from mnemonic</Text>
									<Text style={styles.optionBody}>Enter your 25-word mnemonic</Text>
								</View>
							</View>
						</TouchableOpacity>
					</View>
				</View>
				<View style={[styles.flexContainer, { backgroundColor: "#052344", flex: 4, }]}>
					<View style={[styles.flexContainerChild, { flexDirection: "row", flex: 1, marginTop: height * 0.25, }]}>
						<TouchableOpacity onPress={() => this.props.navigation.navigate("Home")} style={[styles.buttonContainer, { marginRight: width * 0.05 }]}>
							<Text style={styles.buttonText}>Cancel</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => Alert.alert("Unsupported", "Changing the app language is not currently supported.")} style={styles.buttonContainer}>
							<Text style={styles.buttonText}>Change Language</Text>
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

	optionBody: {
		color: "#b4bdc8",
		fontSize: normalize(13, widthScale),
	},

	optionTitle: {
		color: "white",
		fontSize: normalize(25, widthScale),
		fontWeight: "700",
	},
});
