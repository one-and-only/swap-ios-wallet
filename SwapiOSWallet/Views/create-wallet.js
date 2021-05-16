import * as React from 'react';
import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native';

import * as Settings from '../Helpers/settings';

const {width, height} = Dimensions.get('window');
const widthScale = width/375;

// normalize the input so that it scales evenly across devices
function normalize (pre) {
    return Math.floor(pre * widthScale);
}

export default class SwapCreateWallet extends React.Component {
    handleWalletName = (text) => {
        Settings.insert('walletName', text);
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{backgroundColor: '#052344',}}>
                <View>
                    <View>
                        <Text style={styles.optionText}>Wallet Name</Text>
                        <TextInput style={styles.optionTextInput} underlineColorAndroid='transparent' placeholder='Wallet Name' placeholderTextColor='#c9c9c9' autoCapitalize='none' onChangeText={this.handleWalletName} scrollEnabled={true}>

                        </TextInput>
                    </View>
                    <View>

                    </View>
                </View>
                <View>

                </View>
                <View>
                    
                </View>
                <View>
                    
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    optionText: {
        color: '#fff',
    },
    optionTextInput: {
        color: '#fff',
        maxWidth: width * 0.3,
    },
});
