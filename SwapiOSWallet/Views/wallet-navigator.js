import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import { Dimensions, } from 'react-native';

import SwapWallet from './Wallet/wallet';
import SwapTransactions from './Wallet/transactions';
import SwapSend from './Wallet/send';
import SwapSettings from './Wallet/settings';

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

    render() {
        const Drawer = createDrawerNavigator();
        const drawerContentOptions = {
            style: {
                backgroundColor: '#0a478a',
            },
            itemStyle: {
                borderRadius: 15,
            },
            labelStyle: {
                color: 'white',
                fontWeight: '700',
                fontSize: normalize(18),
            },
            inactiveBackgroundColor: "#1066c2",
            activeBackgroundColor: '#a260f8',
        };

        return (
            <NavigationContainer independent={true}>
                <Drawer.Navigator initialRouteName="Home" drawerContentOptions={drawerContentOptions}>
                    <Drawer.Screen name="Wallet" navigation={this.props.navigation} component={SwapWallet}/>
                    <Drawer.Screen name="Transactions" navigation={this.props.navigation} component={SwapTransactions}/>
                    <Drawer.Screen name="Send" navigation={this.props.navigation} component={SwapSend}/>
                    <Drawer.Screen name="Settings" navigation={this.props.navigation} component={SwapSettings}/>
                </Drawer.Navigator>
            </NavigationContainer>
        );
    }
}
