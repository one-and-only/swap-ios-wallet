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
import { logPageView } from "../Helpers/analytics";
import { normalize } from "../Helpers/gui";

const { width, height } = Dimensions.get("window");
const widthScale = width / 375;

const walletOptions = {
	tabBarIcon: ({ color }) => (
		<FontAwesome5 size={normalize(30, widthScale)} name={"wallet"} color={color} solid />
	),
};

const transactionsOptions = {
	title: "TXs",
	tabBarIcon: ({ color }) => (
		<FontAwesome5 size={normalize(30, widthScale)} name={"exchange-alt"} color={color} solid />
	),
};

const sendOptions = {
	tabBarIcon: ({ color }) => (
		<FontAwesome5 size={normalize(30, widthScale)} name={"paper-plane"} color={color} solid />
	),
};

const settingsOptions = {
	tabBarIcon: ({ color }) => (
		<FontAwesome5 size={normalize(30, widthScale)} name={"cogs"} color={color} solid />
	),
};

const infoOptions = {
	tabBarIcon: ({ color }) => (
		<FontAwesome5 size={normalize(30, widthScale)} name={"address-book"} color={color} solid />
	),
};

const navigatorOptions = {
	activeTintColor: "#a260f8",
	inactiveTintColor: "#AEAEAE",
	labelStyle: {
		fontSize: normalize(15, widthScale),
	},
	style: {
		backgroundColor: "#052344",
		height: height * 0.12,
		paddingRight: normalize(10, widthScale),
	}
};

export default class SwapWalletHome extends React.Component {
	constructor(props) {
		super(props);
		this.routeNameRef = React.createRef();
		this.navigationRef = React.createRef();
	}

	hiddenOptions = {
		/*
		Hide the button from the tab bar
		This is a hidden page that can only
		be accessed by explicit navigation.
		*/
		tabBarButton: () => null,
	};

	render() {
		const Tab = createBottomTabNavigator();

		return (
			<NavigationContainer
				independent={true}
				ref={this.navigationRef}
				onReady={() => {
					this.routeNameRef.current = this.navigationRef.current.getCurrentRoute().name;
				}}
				onStateChange={async () => {
					const previousRouteName = this.routeNameRef.current;
					const currentRouteName = this.navigationRef.current.getCurrentRoute().name;

					if (previousRouteName !== currentRouteName) {
						await logPageView(currentRouteName);
					}
					// Save the current route name for later comparison
					this.routeNameRef.current = currentRouteName;
				}}
			>
				<Tab.Navigator initialRouteName="Wallet" barStyle={{ height: height * 0.08, }} backBehavior="initialRoute" tabBarOptions={navigatorOptions}>
					<Tab.Screen name="Wallet" navigation={this.props.navigation} component={SwapWallet} options={walletOptions} />
					<Tab.Screen name="Transactions" navigation={this.props.navigation} component={SwapTransactions} options={transactionsOptions} />
					<Tab.Screen name="Send" navigation={this.props.navigation} component={SwapSend} options={sendOptions} />
					<Tab.Screen name="Settings" navigation={this.props.navigation} component={SwapSettings} options={settingsOptions} />
					<Tab.Screen name="Wallet Info" navigation={this.props.navigation} component={SwapWalletInfo} options={infoOptions} />
					<Tab.Screen name="Transaction Details" navigation={this.props.navigation} component={SwapTransactionInfo} options={this.hiddenOptions} />
				</Tab.Navigator>
			</NavigationContainer>
		);
	}
}
