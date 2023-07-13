import * as React from "react";
import { Dimensions, Text, View, ScrollView, StyleSheet, TextInput, Switch, TouchableOpacity, Alert } from "react-native";
import RNRestart from "react-native-restart";

import * as Settings from "../../Helpers/settings";
import { normalize } from "../../Helpers/gui";

const { width } = Dimensions.get("window");
const widthScale = width / 375;

const handleSpendKeySec = (text) => {
	Settings.insert("spendKey_sec", text);
};
const handleSpendKeyPub = (text) => {
	Settings.insert("spendKey_pub", text);
};
const handleEnableAnalytics = (bool) => {
	Settings.insert("enableAnalytics", JSON.stringify(bool));
};
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
			enableAnalytics: false,
		};

		const spendKeySec = Settings.select("spendKey_sec");
		const spendKeyPub = Settings.select("spendKey_pub");
		const enableAnalytics = Settings.select("enableAnalytics");

		Promise.all([spendKeySec, spendKeyPub, enableAnalytics]).then((settings) => {
			let spendKey_sec;
			let spendKey_pub;
			let enableAnalytics;

			(settings[0] != null) ? spendKey_sec = settings[0] : spendKey_sec = "";
			(settings[1] != null) ? spendKey_pub = settings[1] : spendKey_pub = "";
			(settings[2] != null) ? enableAnalytics = JSON.parse(settings[2]) : enableAnalytics = true;

			this.setState({
				spendKey_sec: spendKey_sec,
				spendKey_pub: spendKey_pub,
				enableAnalytics: enableAnalytics,
			});
		});
	}

	render() {
		return (
			<ScrollView contentContainerStyle={styles.mainView}>
				<View style={{ flexDirection: "row", marginTop: normalize(10, widthScale), }}>
					<Text style={styles.text}>Spend Key (Private):</Text>
					<View style={[styles.flexContainerChild, { marginLeft: normalize(10, widthScale), }]}>
						<TextInput style={[styles.text, styles.textBox]} underlineColorAndroid='transparent' placeholder='Spend Key (Private)' placeholderTextColor='#c9c9c9' defaultValue={this.state.spendKey_sec} autoCapitalize='none' onChangeText={handleSpendKeySec}></TextInput>
					</View>
				</View>
				<View style={{ flexDirection: "row", marginTop: normalize(10, widthScale), }}>
					<Text style={styles.text}>Spend Key (Public):</Text>
					<View style={[styles.flexContainerChild, { marginLeft: normalize(10, widthScale), }]}>
						<TextInput style={[styles.text, styles.textBox]} underlineColorAndroid='transparent' placeholder='Spend Key (Public)' placeholderTextColor='#c9c9c9' defaultValue={this.state.spendKey_pub} autoCapitalize='none' onChangeText={handleSpendKeyPub}></TextInput>
					</View>
				</View>
				<View style={{ flexDirection: "row", marginTop: normalize(10, widthScale), }}>
					<Text style={styles.text}>Enable Analytics:</Text>
					<View style={[styles.flexContainerChild, { marginLeft: normalize(10, widthScale), }]}>
						<Switch
							trackColor={{ false: "#767577", true: "#55a1f3" }}
							thumbColor={this.state.enableAnalytics ? "#a065fa" : "#a065fa"}
							ios_backgroundColor="#3e3e3e"
							onValueChange={() => { this.setState({ enableAnalytics: !this.state.enableAnalytics }); handleEnableAnalytics(!this.state.enableAnalytics); }}
							value={this.state.enableAnalytics}
						/>
					</View>
				</View>
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
