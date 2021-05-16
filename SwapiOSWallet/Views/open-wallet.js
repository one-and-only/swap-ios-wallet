import * as React from 'react';
import {View, Text, Dimensions,} from 'react-native';

import * as Settings from '../Helpers/settings';

const {width, height} = Dimensions.get('window');
const widthScale = width/375;

let walletData = {};

// normalize the input so that it scales evenly across devices
function normalize (pre) {
    return Math.floor(pre * widthScale);
}

export default class SwapOpenWallet extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (Settings.select('walletData') != null) {
            walletData = JSON.parse(Settings.select('walletData'));
        } else {
            alert("You don't have a wallet. How did you get here?");
        }
    }

    render() {
        return (
            <View style={{backgroundColor: '#052344'}}>
                <Text style={{color: '#fff',}}>Some text to show that this page exists</Text>
            </View>
        );
    }
}
