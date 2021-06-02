import * as React from 'react';
import { Dimensions, Text, View, StyleSheet, TextInput, } from 'react-native';

import * as Settings from '../../Helpers/settings';

const {width, height} = Dimensions.get('window');
const widthScale = width/375;

// normalize the input so that it scales evenly across devices
function normalize (pre) {
    return Math.floor(pre * widthScale);
}

export default class SwapSettings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            spendKey: "Fetching...",
        };

        spendKeyPromise = Settings.select("spendKey");

        Promise.all([spendKeyPromise]).then((settings) => {
            var spendKey;
            if (settings[0] != null) {
                spendKey = settings[0];
            } else {
                spendKey = "";
            }

            this.setState({
                spendKey: spendKey,
            })
        });
    }

    handleSpendKey = (text) => {
        Settings.insert('spendKey', text);
    }

    render() {
        return (
            <View style={this.styles.mainView}>
                <View style={{flexDirection: 'row', marginTop: normalize(10),}}>
                    <Text style={this.styles.text}>Spend Key:</Text>
                    <View style={[this.styles.flexContainerChild, {marginLeft: normalize(10),}]}>
                        <TextInput style={[this.styles.text, this.styles.textBox]} underlineColorAndroid='transparent' placeholder='Spend Key' placeholderTextColor='#c9c9c9' defaultValue={this.state.spendKey} autoCapitalize='none' onChangeText={this.handleSpendKey}></TextInput>
                    </View>
                </View>
            </View>
        );
    }

    styles = StyleSheet.create({
        text: {
            color: 'white',
            fontSize: normalize(18),
        },

        mainView: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flex: 1,
            backgroundColor: '#052344',
            paddingLeft: width * 0.025,
        },

        textBox: {
            maxWidth: width * 0.6,
        }
    })
}