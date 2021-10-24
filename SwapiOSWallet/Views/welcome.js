import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const {width, height} = Dimensions.get("window");
const widthScale = width/375;

// normalize the input so that it scales evenly across devices
function normalize (pre) {
	return Math.floor(pre * widthScale);
}

export default class SwapWelcome extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={[styles.flexContainer, {backgroundColor: "#052344", flex: 1,}]}>
				<View style={[styles.flexContainer, {flex: 4, marginTop: normalize(15), paddingTop: height * 0.1,}]}>
					<View style={[styles.flexContainerChild, {flex: 1,}]}>
						<TouchableOpacity style={{flexDirection: "row",}} onPress={() => this.props.navigation.navigate("Create Wallet")}>
							<View style={[styles.flexContainer, {flexDirection: "row", width: "95%",}]}>
								<Image source={require("../Resources/Images/new-wallet.png")} style={{height: normalize(50), width: normalize(46), resizeMode: "stretch"}} />
								<View style={{flexDirection: "row", flexWrap: "wrap", marginLeft: normalize(15),}}>
									<Text style={styles.optionTitle}>Create a new wallet</Text>
									<Text style={styles.optionBody}>Choose this option if this is your first time using Swap.</Text>
								</View>
							</View>
						</TouchableOpacity>
					</View>
					<View style={[styles.flexContainerChild, {flex: 2, marginLeft: normalize(5), marginTop: height * 0.05,}]}>
						<TouchableOpacity style={{flexDirection: "row"}} onPress={() => this.props.navigation.navigate("Restore Wallet From Keys")}>
							<View style={[styles.flexContainer, {flexDirection: "row", width: "90%",}]}>
								<Image source={require("../Resources/Images/restore-wallet.png")} style={{height: normalize(75), width: normalize(75), resizeMode: "stretch"}} />
								<View style={{flexDirection: "row", flexWrap: "wrap", marginLeft: normalize(10),}}>
									<Text style={[styles.optionTitle, {fontSize: normalize(22),}]}>Restore wallet from private keys</Text>
									<Text style={styles.optionBody}>Enter your address and view key</Text>
								</View>
							</View>
						</TouchableOpacity>
					</View>
					<View style={[styles.flexContainerChild, {flex: 2, marginLeft: normalize(5), marginTop: height * 0.05,}]}>
						<TouchableOpacity style={{flexDirection: "row"}} onPress={() => this.props.navigation.navigate("Restore Wallet From Mnemonic")}>
							<View style={[styles.flexContainer, {flexDirection: "row", width: "90%",}]}>
								<Image source={require("../Resources/Images/restore-wallet.png")} style={{height: normalize(75), width: normalize(75), resizeMode: "stretch"}} />
								<View style={{flexDirection: "row", flexWrap: "wrap", marginLeft: normalize(10),}}>
									<Text style={[styles.optionTitle, {fontSize: normalize(22),}]}>Restore wallet from mnemonic</Text>
									<Text style={styles.optionBody}>Enter your 25-word mnemonic</Text>
								</View>
							</View>
						</TouchableOpacity>
					</View>
				</View>
				<View style={[styles.flexContainer, {backgroundColor: "#052344", flex: 8,}]}>
					<View style={[styles.flexContainerChild, {flexDirection: "row", flex: 1, marginTop: height * 0.35,}]}>
						<TouchableOpacity onPress={() => this.props.navigation.navigate("Home")} style={[styles.buttonContainer, { marginRight: width * 0.05 }]}>
							<Text style={styles.buttonText}>Cancel</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => alert("Changing the app language is not currently supported.")} style={styles.buttonContainer}>
							<Text style={styles.buttonText}>Change Language</Text>
						</TouchableOpacity>
					</View>
					<View style={[styles.flexContainerChild, {flex: 1, marginTop: height * 0.05,}]}>
						<Text style={{color: "white", alignSelf: "center", fontWeight: "700", fontSize: normalize(14)}}>
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
		fontSize: normalize(13),
	},

	optionTitle: {
		color: "white",
		fontSize: normalize(25),
		fontWeight: "700",
	},
});
