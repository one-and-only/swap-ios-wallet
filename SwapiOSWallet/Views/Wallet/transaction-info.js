import * as React from "react";
import { View, Dimensions, StyleSheet, Text, ScrollView, TouchableOpacity, } from "react-native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const {width, height} = Dimensions.get("window");
const widthScale = width/375;

// normalize the input so that it scales evenly across devices
function normalize (pre) {
	return Math.floor(pre * widthScale);
}

// initializing a simple variable to store
// route parameters means less typing + cleaner code
var params = {};
var _txdate;
var _txage;

function formatTXAge(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600*24));
    var h = Math.floor(seconds % (3600*24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    
    var dDisplay = d > 0 ? d + (d == 1 ? " Day, " : " Days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " Hour, " : " Hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " Minute " : " Minutes ") : "";
    return dDisplay + hDisplay + mDisplay;
}

var confirmationColor;
var confirmationWarning;

export default class SwapTransactionInfo extends React.Component {
    constructor(props) {
        super(props);
        params = props.route.params;

        _txdate = new Date(params.timestamp).toLocaleDateString();
        _txage = formatTXAge((Date.now() - params.timestamp)/1000);

        confirmationColor = params.confirmations > 0 ? "lime" : "orange";
        confirmationWarning = params.confirmations < 10 ? " (Unconfirmed)" : "";
    }

    render() {
        return (
            <ScrollView contentContainerStyle={styles.mainView}>
                <View style={[styles.propertyContainer, styles.text]}>
                    <Text style={[styles.propertyText, styles.text]}><FontAwesome5 size={normalize(18)} name={"calendar-day"} color={"white"} solid /> TX Date (Local): <Text style={{color: "lime"}}>{_txdate}</Text></Text>
                    <Text style={[styles.propertyText, styles.text]}><FontAwesome5 size={normalize(18)} name={"cube"} color={"white"} solid /> Block: <Text style={{color: "lime"}}>{params.block}</Text></Text>
                    <Text style={[styles.propertyText, styles.text]}><FontAwesome5 size={normalize(18)} name={"code-branch"} color={"white"} solid /> Tx Version: <Text style={{color: "lime"}}>{params.version}</Text></Text>
                    <Text style={[styles.propertyText, styles.text]}><FontAwesome5 size={normalize(18)} name={"file-invoice-dollar"} color={"white"} solid /> Fee: <Text style={{color: "lime"}}>{params.fee}</Text></Text>
                    <Text style={[styles.propertyText, styles.text]}><FontAwesome5 size={normalize(18)} name={"handshake"} color={"white"} solid /> # Of Confirmations: <Text style={{color: confirmationColor}}>{params.confirmations}</Text>{confirmationWarning}</Text>
                    <Text style={[styles.propertyText, styles.text]}><FontAwesome5 size={normalize(18)} name={"clock"} color={"white"} solid /> Age: <Text style={{color: "lime"}}>{_txage}</Text></Text>
                    <Text style={[styles.propertyText, styles.text]}><FontAwesome5 size={normalize(18)} name={"hdd"} color={"white"} solid /> Size: <Text style={{color: "lime"}}>{params.size} kB</Text></Text>
                    <Text style={[styles.propertyText, styles.text]}><FontAwesome5 size={normalize(18)} name={"shield-alt"} color={"white"} solid /> RingCT/type: <Text style={{color: "lime"}}>{params.ringCT_type}</Text></Text>
                </View>
                <View style={{marginTop: normalize(height * 0.16)}}></View>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("Transactions")} style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Show All Transactions</Text>
                </TouchableOpacity>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    mainView: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        backgroundColor: "#052344",
    },

    text: {
        color: "white",
    },

    titleText: {
        fontSize: normalize(25),
        fontWeight: "bold",
    },

    propertyContainer: {
        justifyContent: "center",
    },

    propertyText: {
        fontSize: normalize(20),
        margin: normalize(10),
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
		color: "white",
		fontSize: 18,
		fontWeight: "700",
	},
});
