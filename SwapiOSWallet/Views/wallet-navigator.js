import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import SwapWallet from './Wallet/wallet';
import SwapTransactions from './Wallet/transactions';
import SwapSend from './Wallet/send';
import SwapSettings from './Wallet/settings';

export default class SwapWalletHome extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const Drawer = createDrawerNavigator();

        return (
            <NavigationContainer independent={true}>
                <Drawer.Navigator initialRouteName="Home">
                    <Drawer.Screen name="Wallet" navigation={this.props.navigation} component={SwapWallet}/>
                    <Drawer.Screen name="Transactions" navigation={this.props.navigation} component={SwapTransactions}/>
                    <Drawer.Screen name="Send" navigation={this.props.navigation} component={SwapSend}/>
                    <Drawer.Screen name="Settings" navigation={this.props.navigation} component={SwapSettings}/>
                </Drawer.Navigator>
            </NavigationContainer>
        );
    }
}
