import * as React from 'react';
import {View, Text, Dimensions,} from 'react-native';

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
        return (
            <View style={{backgroundColor: '#052344'}}>
                <Text style={{color: '#fff',}}>Some text to show that this page exists</Text>
            </View>
        );
    }
}
