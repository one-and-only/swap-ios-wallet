import * as React from 'react';
import { Dimensions, Text, View, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';

import * as Settings from '../../Helpers/settings';

const {width, height} = Dimensions.get('window');
const widthScale = width/375;
const au_to_xwp = 1000000000000; // 1,000,000,000,000 atomic units in one XWP (like XMR)
var auToSend = 0;
var addressToSendTo = "";

// normalize the input so that it scales evenly across devices
function normalize (pre) {
    return Math.floor(pre * widthScale);
}

export default class SwapSend extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            spendKey: "Fetching...",
        };

        spendKeyPromise = Settings.select("spendKey");

        Promise.all([spendKeyPromise]).then((settings) => {
            var spendKey;

            (settings[0] != null) ? spendKey = settings[0] : spendKey = "";
            
            this.setState({
                spendKey: spendKey,
            });
        });
    }

    handleAmount = (text) => {
        auToSend = Number(text) * au_to_xwp;
    }

    handleAddress = (text) => {
        addressToSendTo = text;
    }

    render() {
        return (
            <View style={this.styles.mainView}>
                <View style={{flex: 15}}>
                    <View style={{flexDirection: 'row', marginTop: normalize(10),}}>
                        <Text style={this.styles.text}>Amount:</Text>
                        <View style={[this.styles.flexContainerChild, {marginLeft: normalize(10),}]}>
                            <TextInput style={[this.styles.text, this.styles.textBox]} underlineColorAndroid='transparent' placeholder='Amount' placeholderTextColor='#c9c9c9' autoCapitalize='none' keyboardType='decimal-pad' onChangeText={this.handleAmount}></TextInput>
                            <Image style={[this.styles.balanceImage, {marginLeft: normalize(5), marginTop: normalize(5),}]} source={require('../../Resources/Images/logo-circle-white-nofill.png')} />
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: normalize(15),}}>
                        <Text style={this.styles.text}>Address:</Text>
                        <View style={[this.styles.flexContainerChild, {marginLeft: normalize(10),}]}>
                            <TextInput style={[this.styles.text, this.styles.textBox]} underlineColorAndroid='transparent' placeholder='Address' placeholderTextColor='#c9c9c9' autoCapitalize='none' keyboardType='ascii-capable' onChangeText={this.handleAddress}></TextInput>
                            <Image style={[this.styles.addressImage, {marginLeft: normalize(5), marginTop: normalize(7), marginBottom: normalize(3),}]} source={require('../../Resources/Images/address-book.png')} />
                        </View>
                    </View>
                </View>
                <View style={[this.styles.flexContainerChild, {flex: 1, marginBottom: height * 0.07,}]}>
                    <TouchableOpacity onPress={() => alert("Sending XWP is not currently supported.")} style={[this.styles.buttonContainer, { marginRight: width * 0.05 }]}>
                        <Text style={this.styles.buttonText}>Send</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {this.props.navigation.goBack();}} style={this.styles.buttonContainer}>
                        <Text style={this.styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    styles = StyleSheet.create({
        text: {
            color: 'white',
            fontSize: normalize(22),
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
        },

        balanceImage: {
            height: normalize(22),
            width: normalize(22),
        },

        addressImage: {
            height: normalize(22),
            width: normalize(24.68),
        },

        flexContainerChild: {
            flexDirection: 'row',
        },

        buttonContainer: {
            elevation: 8,
            backgroundColor: "#2074d4",
            borderRadius: 5,
            paddingVertical: 10,
            paddingHorizontal: 12,
        },

        buttonText: {
            fontSize: 18,
            color: "#fff",
            fontWeight: "700",
            alignSelf: "center",
        },
    })
}