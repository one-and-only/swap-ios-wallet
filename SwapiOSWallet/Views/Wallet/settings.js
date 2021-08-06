import * as React from "react";
import { Dimensions, Text, View, ScrollView, StyleSheet, TextInput, } from "react-native";

import * as Settings from "../../Helpers/settings";

const {width, height} = Dimensions.get("window");
const widthScale = width/375;

// normalize the input so that it scales evenly across devices
function normalize (pre) {
	return Math.floor(pre * widthScale);
}

const handleSpendKeySec = (text) => {
	Settings.insert("spendKey_sec", text);
};
const handleSpendKeyPub = (text) => {
	Settings.insert("spendKey_pub", text);
};
const handleViewKeySec = (text) => {
	Settings.insert("viewKey_sec", text);
};
const handleViewKeyPub = (text) => {
	Settings.insert("viewKey_pub", text);
};

export default class SwapSettings extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			spendKey_sec: "Fetching...",
			spendKey_pub: "Fetching...",
			viewKey_sec: "Fetching...",
			viewKey_pub: "Fetching...",
		};

		spendKeySec = Settings.select("spendKey_sec");
		spendKeyPub = Settings.select("spendKey_pub");
		viewKeySec = Settings.select("viewKey_sec");
		viewKeyPub = Settings.select("viewKey_pub");

		Promise.all([spendKeySec, spendKeyPub, viewKeySec, viewKeyPub]).then((settings) => {
			var spendKey_sec;
			var spendKey_pub;
			var viewKey_sec;
			var viewKey_pub;

			(settings[0] != null) ? spendKey_sec = settings[0] : spendKey_sec = "";
			(settings[1] != null) ? spendKey_pub = settings[1] : spendKey_pub = "";
			(settings[2] != null) ? viewKey_sec = settings[2] : viewKey_sec = "";
			(settings[3] != null) ? viewKey_pub = settings[3] : viewKey_pub = "";
            
			this.setState({
				spendKey_sec: spendKey_sec,
				spendKey_pub: spendKey_pub,
				viewKey_sec: viewKey_sec,
				viewKey_pub: viewKey_pub,
			});
		});
	}

	render() {
		return (
			<ScrollView contentContainerStyle={styles.mainView}>
				<View style={{flexDirection: "row", marginTop: normalize(10),}}>
					<Text style={styles.text}>Spend Key (Private):</Text>
					<View style={[styles.flexContainerChild, {marginLeft: normalize(10),}]}>
						<TextInput style={[styles.text, styles.textBox]} underlineColorAndroid='transparent' placeholder='Spend Key (Private)' placeholderTextColor='#c9c9c9' defaultValue={this.state.spendKey_sec} autoCapitalize='none' onChangeText={handleSpendKeySec}></TextInput>
					</View>
				</View>
				<View style={{flexDirection: "row", marginTop: normalize(10),}}>
					<Text style={styles.text}>Spend Key (Public):</Text>
					<View style={[styles.flexContainerChild, {marginLeft: normalize(10),}]}>
						<TextInput style={[styles.text, styles.textBox]} underlineColorAndroid='transparent' placeholder='Spend Key (Public)' placeholderTextColor='#c9c9c9' defaultValue={this.state.spendKey_pub} autoCapitalize='none' onChangeText={handleSpendKeyPub}></TextInput>
					</View>
				</View>
				<View style={{flexDirection: "row", marginTop: normalize(10),}}>
					<Text style={styles.text}>View Key (Private):</Text>
					<View style={[styles.flexContainerChild, {marginLeft: normalize(10),}]}>
						<TextInput style={[styles.text, styles.textBox]} underlineColorAndroid='transparent' placeholder='View Key (Private)' placeholderTextColor='#c9c9c9' defaultValue={this.state.viewKey_sec} autoCapitalize='none' onChangeText={handleViewKeySec}></TextInput>
					</View>
				</View>
				<View style={{flexDirection: "row", marginTop: normalize(10),}}>
					<Text style={styles.text}>View Key (Public):</Text>
					<View style={[styles.flexContainerChild, {marginLeft: normalize(10),}]}>
						<TextInput style={[styles.text, styles.textBox]} underlineColorAndroid='transparent' placeholder='View Key (Public)' placeholderTextColor='#c9c9c9' defaultValue={this.state.viewKey_pub} autoCapitalize='none' onChangeText={handleViewKeyPub}></TextInput>
					</View>
				</View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	mainView: {
		alignItems: "center",
		backgroundColor: "#052344",
		display: "flex",
		flexDirection: "column",
		flex: 1,
		justifyContent: "flex-start",
	},

	text: {
		color: "white",
		fontSize: normalize(18),
	},

	textBox: {
		maxWidth: width * 0.55,
	}
});
