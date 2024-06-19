import * as React from "react";
import { Dimensions, Text, View, ScrollView, StyleSheet, Switch, TouchableOpacity, Alert } from "react-native";
import RNRestart from "react-native-restart";

import * as Settings from "../../Helpers/settings";
import { normalize } from "../../Helpers/gui";

const { width } = Dimensions.get("window");
const widthScale = width / 375;

const logout = () => {
	Alert.alert("Logout", "Are you sure you want to logout?",
		[
			{ text: "No" },
			{
				text: "Yes",
				onPress: async () => {
					await Settings.clear();
					RNRestart.Restart();
				}
			}
		]
	);
};

export default class SwapSettings extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			spendKey_sec: "Fetching...",
			spendKey_pub: "Fetching...",
		};
	}

	render() {
		return (
			<ScrollView contentContainerStyle={styles.mainView}>
				<View style={{ flexDirection: "row", marginTop: normalize(10, widthScale), alignSelf: "center", }}>
					<TouchableOpacity style={styles.buttonContainer} onPress={logout}><Text style={[styles.text, { color: "white" }]}>Logout</Text></TouchableOpacity>
				</View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	buttonContainer: {
		backgroundColor: "#eb4034",
		borderRadius: 5,
		elevation: 8,
		paddingHorizontal: 12,
		paddingVertical: 10,
	},
	mainView: {
		alignItems: "flex-start",
		backgroundColor: "#052344",
		display: "flex",
		flex: 1,
		paddingLeft: normalize(10, widthScale),
	},

	text: {
		color: "white",
		fontSize: normalize(18, widthScale),
	},

	textBox: {
		maxWidth: width * 0.5,
	}
});
