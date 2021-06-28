import * as React from 'react';
import { Dimensions, Text, View, StyleSheet, } from 'react-native';

import * as Settings from '../../Helpers/settings';

const {width, height} = Dimensions.get('window');
const widthScale = width/375;

// normalize the input so that it scales evenly across devices
function normalize (pre) {
    return Math.floor(pre * widthScale);
}

export default class SwapWalletInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mnemonic: "Fetching...",
            address: "Fetching...",
            viewKey: "Fetching...",
            spendKey: "Fetching...",
        }

        mnemonic_promise = Settings.select('mnemonic');
        address_promise = Settings.select('walletAddress');
        viewKey_promise = Settings.select('viewKey');
        spendKey_promise = Settings.select('spendKey');

        Promise.all([mnemonic_promise, address_promise, viewKey_promise, spendKey_promise]).then(wallet => {
            this.setState({
                mnemonic: wallet[0],
                address: wallet[1],
                viewKey: wallet[2],
                spendKey: wallet[3],
            });
        });
    }

    render() {
        return (
            <View style={{backgroundColor: '#052344', paddingBottom: height * 0.5, paddingLeft: normalize(10), paddingTop: height * 0.02,}}>
                <Text style={styles.text}>Mnemonic Seed (Private): <Text style={{fontSize: normalize(15),}}>{this.state.mnemonic}</Text></Text>
                <Text style={styles.text}>Account Address (Public): <Text style={{fontSize: normalize((15),)}}>{this.state.address}</Text></Text>
                <Text style={styles.text}>View Key (Private): <Text style={{fontSize: normalize((15),)}}>{this.state.viewKey}</Text></Text>
                <Text style={styles.text}>Spend Key (Private): <Text style={{fontSize: normalize((15),)}}>{this.state.spendKey}</Text></Text>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    text: {
        color: "white",
        fontSize: normalize(20),
        paddingTop: height * 0.02,
    }
});