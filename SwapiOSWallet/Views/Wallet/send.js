import * as React from "react";
import { Dimensions, Text, View, StyleSheet, TextInput, Image, TouchableOpacity } from "react-native";

import * as Settings from "../../Helpers/settings";

const {width, height} = Dimensions.get("window");
const widthScale = width/375;
const au_to_xwp = 1000000000000; // 1,000,000,000,000 atomic units in one XWP (like XMR)
var auToSend = 0;
var addressToSendTo = "";

// normalize the input so that it scales evenly across devices
function normalize (pre) {
	return Math.floor(pre * widthScale);
}

const handleAmount = (text) => {
	auToSend = Number(text) * au_to_xwp;
};

const handleAddress = (text) => {
	addressToSendTo = text;
};

export default class SwapSend extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			spendKey: "Fetching...",
		};

		spendKeyPromise = Settings.select("spendKey");

		Promise.all([spendKeyPromise]).then((settings) => {
			var spendKey;

			(settings[0] != null) ? spendKey = settings[0] : spendKey = "";
            
			this.setState({
				spendKey: spendKey,
			});
		});
	}

	render() {
		return (
			<View style={styles.mainView}>
				<View style={{flex: 15}}>
					<View style={{flexDirection: "row", marginTop: normalize(10),}}>
						<Text style={styles.text}>Amount:</Text>
						<View style={[styles.flexContainerChild, {marginLeft: normalize(10),}]}>
							<TextInput style={[styles.text, styles.textBox]} underlineColorAndroid='transparent' placeholder='Amount' placeholderTextColor='#c9c9c9' autoCapitalize='none' keyboardType='decimal-pad' onChangeText={handleAmount}></TextInput>
							<Image style={[styles.balanceImage, {marginLeft: normalize(5), marginTop: normalize(5),}]} source={require("../../Resources/Images/logo-circle-white-nofill.png")} />
						</View>
					</View>
					<View style={{flexDirection: "row", marginTop: normalize(15),}}>
						<Text style={styles.text}>Address:</Text>
						<View style={[styles.flexContainerChild, {marginLeft: normalize(10),}]}>
							<TextInput style={[styles.text, styles.textBox]} underlineColorAndroid='transparent' placeholder='Address' placeholderTextColor='#c9c9c9' autoCapitalize='none' keyboardType='ascii-capable' onChangeText={handleAddress}></TextInput>
							<Image style={[styles.addressImage, {marginLeft: normalize(5), marginTop: normalize(7), marginBottom: normalize(3),}]} source={require("../../Resources/Images/address-book.png")} />
						</View>
					</View>
				</View>
				<View style={[styles.flexContainerChild, {flex: 1, marginBottom: height * 0.07,}]}>
					<TouchableOpacity onPress={() => alert("Sending XWP is not currently supported.")} style={[styles.buttonContainer, { marginRight: width * 0.05 }]}>
						<Text style={styles.buttonText}>Send</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => {this.props.navigation.goBack();}} style={styles.buttonContainer}>
						<Text style={styles.buttonText}>Cancel</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	addressImage: {
		height: normalize(22),
		width: normalize(24.68),
	},

	balanceImage: {
		height: normalize(22),
		width: normalize(22),
	},

	buttonContainer: {
		backgroundColor: "#2074d4",
		borderRadius: 5,
		elevation: 8,
		paddingHorizontal: 12,
		paddingVertical: 10,
	},

	buttonText: {
		alignSelf: "center",
		color: "#fff",
		fontSize: 18,
		fontWeight: "700",
	},

	flexContainerChild: {
		flexDirection: "row",
	},

	mainView: {
		alignItems: "center",
		backgroundColor: "#052344",
		display: "flex",
		flexDirection: "column",
		flex: 1,
		justifyContent: "flex-start",
		paddingLeft: width * 0.025,
	},

	text: {
		color: "white",
		fontSize: normalize(22),
	},

	textBox: {
		maxWidth: width * 0.6,
	},
});