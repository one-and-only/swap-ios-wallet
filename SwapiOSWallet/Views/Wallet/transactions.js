import * as React from "react";
import { Dimensions, Text, View, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import * as Blockchain from '../../Helpers/blockchain';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const {width, height} = Dimensions.get("window");
const widthScale = width/375;

// normalize the input so that it scales evenly across devices
function normalize (pre) {
	return Math.floor(pre * widthScale);
}

const transactions = [
    {
        "height": 5705751,
        "hash": "5340428e1226376dcc5c3e51f640add30949da968c29657ba2a57d368ae88919",
        "size": 0.1,
        "fee": 850,
		"amount": 5.77,
		"version": 2,
		"confirmations": 0,
		"pubKey": "abc123",
		"ringct_info": "YES/0",
		"stealthAddress": "ff313fb3d560ed1573a77d8f3db051c617515d81ae344c0e6f96832jsdgjksjksdf89",
		"receiving": false,
    },
    {
        "height": 5701100,
        "hash": "5340428e1223jhj34j3424e51f640add30949da968c29657ba2a57d368ae88919",
        "size": 5.7,
        "fee": 400,
		"amount": 2.35,
		"version": 2,
		"confirmations": 0,
		"pubKey": "abc123",
		"ringct_info": "YES/0",
		"stealthAddress": "ff313fb3d560ed1573a77d8f3db051c617515d81ae344c0e6f96832jsdgjksjksdf89",
		"receiving": true,
    },
    {
        "height": 5600000,
        "hash": "jl23bj4h3444hhlll1226376dcc5c3e51f640add30949da968c29657ba2a57d368",
        "size": 29.9,
        "fee": 1215,
		"amount": 1.321,
		"version": 2,
		"confirmations": 0,
		"pubKey": "abc123",
		"ringct_info": "YES/0",
		"stealthAddress": "ff313fb3d560ed1573a77d8f3db051c617515d81ae344c0e6f96832jsdgjksjksdf89",
		"receiving": false,
    },
]

// styles need to be defined before
// dynamic generation of rows
const styles = StyleSheet.create({
	mainView: {
		display: "flex",
		flex: 1,
		backgroundColor: "#052344",
		alignItems: "center",
	},

	titleText: {
		paddingTop: normalize(5),
		color: "white",
		fontSize: normalize(25),
		fontWeight: "bold",
		textAlign: "center",
	},

	item: {
		marginTop: normalize(10),
		fontSize: normalize(22),
		height: 44,
	},

	row: {
		flexDirection: "row",
	},

	txContainer: {
		flexDirection: "column",
	},

	swapCurrencyLogo: {
		height: normalize(22),
		width: normalize(22),
	}
});

var rows = [];

export default class SwapTransactions extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<ScrollView contentContainerStyle={styles.mainView}>
				<Text style={[styles.titleText, {paddingBottom: height * 0.05,}]}>Transactions</Text>
				<View style={styles.txContainer}>
					{
						transactions.map(transaction => {
							const timestamp = Blockchain.blockToDate(transaction.height).valueOf();
							const date = Blockchain.blockToDate(transaction.height).toLocaleDateString();
							const txColor = (transaction.receiving) ? "lime" : "orange";
							const directionIcon = (transaction.receiving) ? "arrow-down" : "arrow-up";
							rows.push(
								<TouchableOpacity style={styles.row} key={transaction.hash} onPress={() => { this.props.navigation.navigate("Transaction Details", {hash: transaction.hash, amount: transaction.amount, timestamp: timestamp, block: transaction.height, size: transaction.size, fee: transaction.fee, version: transaction.version, confirmations: transaction.confirmations, pubKey: transaction.pubKey, ringCT_type: transaction.ringct_info, stealthAddress: transaction.stealthAddress}) }}>
									<Text style={[styles.item, {color: txColor,}]}><FontAwesome5 size={normalize(18)} name={"calendar-day"} color={txColor} solid />  {date}</Text>
									<Text style={[styles.item, {marginLeft: width * 0.15, color: txColor,}]}><FontAwesome5 size={normalize(18)} name={directionIcon} color={txColor} solid /> <Image source={require("../../Resources/Images/logo-circle-white-nofill.png")} style={styles.swapCurrencyLogo} /> {transaction.amount}</Text>
								</TouchableOpacity>
							);
						})
					}{rows}{/* clear rows so they don't duplicate on app restart */ rows = []}
				</View>
			</ScrollView>
		);
	}
}
