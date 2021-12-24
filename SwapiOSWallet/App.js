/* eslint-disable react-native/no-inline-styles */
/**
 * Swap iOS Wallet
 * https://github.com/one-and-only/swap-ios-wallet
 *
 * @format
 * @flow strict-local
 */

// React Dependencies
import * as React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {Dimensions, Image, TouchableOpacity, Linking, Alert, Text, StyleSheet, View,} from "react-native";

// Views
import SwapLoadingScreen from "./Views/loading-screen";
import SwapMainHome from "./Views/home";
import SwapWelcome from "./Views/welcome";
import SwapCreateWallet from "./Views/create-wallet";
import SwapRestoreWalletFromKeys from "./Views/restore-wallet-keys";
import SwapRestoreWalletFromMnemonic from "./Views/restore-wallet-mnemonic";
import SwapWalletHome from "./Views/wallet-navigator";

//FontAwesome
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

//Analytics
import { logPageView } from "./Helpers/analytics";

const {width, height} = Dimensions.get("window");
const widthScale = width/375;

// normalize the input so that it scales evenly across devices
function normalize (pre) {
	return Math.floor(pre * widthScale);
}

class Navigator extends React.Component {

	constructor(props) {
		super(props);
		this.routeNameRef = React.createRef();
		this.navigationRef = React.createRef();
	}

	options() {
		const headerRight = () => {
			return (
				<TouchableOpacity onPress={() => {Linking.openURL("https://swap.foundation");}}>
					<Image
						source={require("./Resources/Images/maskot.png")}
						style={{
							height: 30,
							width: 42,
							resizeMode: "stretch",
							marginRight: 30,
						}}
					/>
				</TouchableOpacity>
			);
		};

		const headerLeft = () => {
			return (
				<TouchableOpacity onPress={() => {Alert.alert("About", "Swap Mobile Wallet v0.13.0\n©2021 Antonios Papadakis");}}>
					<FontAwesome5 style={styles.infoIcon} size={normalize(30)} name={"info-circle"} color={"white"} />
				</TouchableOpacity>
			);
		};

		const title = (
			<View>
				<Text style={styles.centerText}><Image style={styles.swapLogo} source={require('./Resources/Images/header-logo.png')} /> Swap</Text>
			</View>
		);

		var options = {
			title: title,
			headerShown: true,
			headerTitleAlign: "center",
			headerStyle: {
				backgroundColor: "#052344"
			},
			headerTintColor: "#fff",
			headerTitleStyle: {
				fontWeight: "bold"
			},
			headerLeft: headerLeft, // this disables the "back" button. The user should not be able to go back at any point.
			headerRight: headerRight
		};
		return options;
	}

	render() {
		const Stack = createStackNavigator();

		return (
			<NavigationContainer
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
				<Stack.Navigator initialRouteName="Loading Screen">
					<Stack.Screen name="Loading Screen" navigation={this.props.navigation} component={SwapLoadingScreen} options={this.options} />
					<Stack.Screen name="Home" navigation={this.props.navigation} component={SwapMainHome} options={this.options} />
					<Stack.Screen name="Welcome" navigation={this.props.navigation} component={SwapWelcome} options={this.options} />
					<Stack.Screen name="Create Wallet" navigation={this.props.navigation} component={SwapCreateWallet} options={this.options} />
					<Stack.Screen name="Restore Wallet From Keys" navigation={this.props.navigation} component={SwapRestoreWalletFromKeys} options={this.options} />
					<Stack.Screen name="Restore Wallet From Mnemonic" navigation={this.props.navigation} component={SwapRestoreWalletFromMnemonic} options={this.options} />
					<Stack.Screen name="Wallet Home" navigation={this.props.navigation} component={SwapWalletHome} options={this.options} />
				</Stack.Navigator>
			</NavigationContainer>
		);
	}

}

const styles = StyleSheet.create({
	centerText: {
		fontWeight: "normal",
		fontFamily: "VerbLight",
		color: "#fff",
		fontSize: normalize(30),
	},
	swapLogo: {
		width: normalize(30),
		height: normalize(30),
	},
	infoIcon: {
		marginLeft: normalize(30),
	},
});
export default Navigator;
