import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { Dimensions, View, } from 'react-native';

import SwapWallet from './Wallet/wallet';
import SwapTransactions from './Wallet/transactions';
import SwapSend from './Wallet/send';
import SwapSettings from './Wallet/settings';
import SwapWalletInfo from './Wallet/info';

const {width, height} = Dimensions.get('window');
const widthScale = width/375;

// normalize the input so that it scales evenly across devices
function normalize (pre) {
    return Math.floor(pre * widthScale);
}

export default class SwapWalletHome extends React.Component {
    constructor(props) {
        super(props);
    }

    walletOptions = {
        tabBarIcon: ({ color }) => (
            <FontAwesome5 size={normalize(30)} name={'wallet'} color={color} solid />
        ),
    }

    transactionsOptions = {
        title: "TXs",
        tabBarIcon: ({ color }) => (
            <FontAwesome5 size={normalize(30)} name={'exchange-alt'} color={color} solid />
        ),
    }

    sendOptions = {
        tabBarIcon: ({ color }) => (
            <FontAwesome5 size={normalize(30)} name={'paper-plane'} color={color} solid />
        ),
    }

    settingsOptions = {
        tabBarIcon: ({ color }) => (
            <FontAwesome5 size={normalize(30)} name={'cogs'} color={color} solid />
        ),
    }

    infoOptions = {
        tabBarIcon: ({ color }) => (
            <FontAwesome5 size={normalize(30)} name={'address-book'} color={color} solid />
        ),
    }

    navigatorOptions = {
        activeTintColor: '#a260f8',
        inactiveTintColor: '#AEAEAE',
        labelStyle: {
            fontSize: normalize(15),
        },
        style: {
            backgroundColor: '#052344',
            height: height * 0.12,
            paddingRight: normalize(10),
        }
    }

    render() {
        const Tab = createBottomTabNavigator();

        return (
            <NavigationContainer independent={true}>
                <Tab.Navigator initialRouteName="Wallet" barStyle={{height: height * 0.08,}} backBehavior="initialRoute" tabBarOptions={this.navigatorOptions}>
                    <Tab.Screen name="Wallet" navigation={this.props.navigation} component={SwapWallet} options={this.walletOptions}/>
                    <Tab.Screen name="Transactions" navigation={this.props.navigation} component={SwapTransactions} options={this.transactionsOptions}/>
                    <Tab.Screen name="Send" navigation={this.props.navigation} component={SwapSend} options={this.sendOptions}/>
                    <Tab.Screen name="Settings" navigation={this.props.navigation} component={SwapSettings} options={this.settingsOptions}/>
                    <Tab.Screen name="Wallet Info" navigation={this.props.navigation} component={SwapWalletInfo} options={this.infoOptions}/>
                </Tab.Navigator>
            </NavigationContainer>
        );
    }
}
