import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Dimensions } from "react-native";

import SwapWallet from "./Wallet/wallet";
import SwapTransactions from "./Wallet/transactions";
import SwapSend from "./Wallet/send";
import SwapSettings from "./Wallet/settings";
import SwapWalletInfo from "./Wallet/info";
import SwapTransactionInfo from "./Wallet/transaction-info";

const {width, height} = Dimensions.get("window");
const widthScale = width/375;

// normalize the input so that it scales evenly across devices
function normalize (pre) {
	return Math.floor(pre * widthScale);
}

const walletOptions = {
	tabBarIcon: ({ color }) => (
		<FontAwesome5 size={normalize(30)} name={"wallet"} color={color} solid />
	),
};

const transactionsOptions = {
	title: "TXs",
	tabBarIcon: ({ color }) => (
		<FontAwesome5 size={normalize(30)} name={"exchange-alt"} color={color} solid />
	),
};

const sendOptions = {
	tabBarIcon: ({ color }) => (
		<FontAwesome5 size={normalize(30)} name={"paper-plane"} color={color} solid />
	),
};

const settingsOptions = {
	tabBarIcon: ({ color }) => (
		<FontAwesome5 size={normalize(30)} name={"cogs"} color={color} solid />
	),
};

const infoOptions = {
	tabBarIcon: ({ color }) => (
		<FontAwesome5 size={normalize(30)} name={"address-book"} color={color} solid />
	),
};

const navigatorOptions = {
	activeTintColor: "#a260f8",
	inactiveTintColor: "#AEAEAE",
	labelStyle: {
		fontSize: normalize(15),
	},
	style: {
		backgroundColor: "#052344",
		height: height * 0.12,
		paddingRight: normalize(10),
	}
};

export default class SwapWalletHome extends React.Component {
	constructor(props) {
		super(props);
	}

	hiddenOptions = {
		// hide the button from the tab bar
		/*
		This is a hidden page that can only
		be accessed by explicit navigation.
		*/
		tabBarButton: () => null,
	};

	render() {
		const Tab = createBottomTabNavigator();

		return (
			<NavigationContainer independent={true}>
				<Tab.Navigator initialRouteName="Wallet" barStyle={{height: height * 0.08,}} backBehavior="initialRoute" tabBarOptions={navigatorOptions}>
					<Tab.Screen name="Wallet" navigation={this.props.navigation} component={SwapWallet} options={walletOptions}/>
					<Tab.Screen name="Transactions" navigation={this.props.navigation} component={SwapTransactions} options={transactionsOptions}/>
					<Tab.Screen name="Send" navigation={this.props.navigation} component={SwapSend} options={sendOptions}/>
					<Tab.Screen name="Settings" navigation={this.props.navigation} component={SwapSettings} options={settingsOptions}/>
					<Tab.Screen name="Wallet Info" navigation={this.props.navigation} component={SwapWalletInfo} options={infoOptions}/>
					<Tab.Screen name="Transaction Details" navigation={this.props.navigation} component={SwapTransactionInfo} options={this.hiddenOptions} />
				</Tab.Navigator>
			</NavigationContainer>
		);
	}
}
