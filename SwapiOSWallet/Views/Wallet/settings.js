import * as React from "react";
import { Dimensions, Text, View, StyleSheet, TextInput, } from "react-native";

import * as Settings from "../../Helpers/settings";

const {width, height} = Dimensions.get("window");
const widthScale = width/375;

// normalize the input so that it scales evenly across devices
function normalize (pre) {
	return Math.floor(pre * widthScale);
}

const handleSpendKey = (text) => {
	Settings.insert("spendKey", text);
};

export default class SwapSettings extends React.Component {
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
				<View style={{flexDirection: "row", marginTop: normalize(10),}}>
					<Text style={styles.text}>Spend Key:</Text>
					<View style={[styles.flexContainerChild, {marginLeft: normalize(10),}]}>
						<TextInput style={[styles.text, styles.textBox]} underlineColorAndroid='transparent' placeholder='Spend Key' placeholderTextColor='#c9c9c9' defaultValue={this.state.spendKey} autoCapitalize='none' onChangeText={handleSpendKey}></TextInput>
					</View>
				</View>
			</View>
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
		paddingLeft: width * 0.025,
	},

	text: {
		color: "white",
		fontSize: normalize(18),
	},

	textBox: {
		maxWidth: width * 0.6,
	}
});
