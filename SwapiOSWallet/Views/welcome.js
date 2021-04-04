import * as React from 'react';
import {View, Text, StyleSheet, Dimensions, Image, TouchableOpacity,} from 'react-native';

const {width, height} = Dimensions.get('window');
const widthScale = width/375;

// normalize the input so that it scales evenly across devices
function normalize (pre) {
    return Math.floor(pre * widthScale);
}

export default class SwapWelcome extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={[styles.flexContainer, {backgroundColor: '#052344', flex: 1,}]}>
                <View style={[styles.flexContainer, {flex: 4, marginTop: normalize(15), paddingTop: height * 0.1,}]}>
                    <View style={[styles.flexContainerChild, {flex: 1,}]}>
                        <TouchableOpacity style={{flexDirection: 'row',}} onPress={() => this.props.navigation.navigate('Create Wallet')}>
                            <View style={[styles.flexContainer, {flexDirection: 'row', width: '95%',}]}>
                                <Image source={require('../Resources/Images/new-wallet.png')} style={{height: normalize(50), width: normalize(46), resizeMode: 'stretch'}} />
                                <View style={{flexDirection: 'row', flexWrap: 'wrap', marginLeft: normalize(15),}}>
                                    <Text style={styles.optionTitle}>Create a new wallet</Text>
                                    <Text style={styles.optionBody}>Choose this option if this is your first time using Swap.</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.flexContainerChild, {flex: 2, marginLeft: normalize(5), marginTop: height * 0.05,}]}>
                        <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => this.props.navigation.navigate('Restore Wallet')}>
                            <View style={[styles.flexContainer, {flexDirection: 'row', width: '90%',}]}>
                                <Image source={require('../Resources/Images/restore-wallet.png')} style={{height: normalize(75), width: normalize(75), resizeMode: 'stretch'}} />
                                <View style={{flexDirection: 'row', flexWrap: 'wrap', marginLeft: normalize(10),}}>
                                    <Text style={[styles.optionTitle, {fontSize: normalize(22),}]}>Restore wallet from keys or mnemonic seed</Text>
                                    <Text style={styles.optionBody}>Enter your private keys or 25-word mnemonic seed to restore your wallet.</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.flexContainer, {backgroundColor: '#052344', flex: 8,}]}>
                    <View style={[styles.flexContainerChild, {flexDirection: "row", flex: 1, marginTop: height * 0.35,}]}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')} style={[styles.buttonContainer, { marginRight: width * 0.05 }]}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => alert("Changing the app language is not currently supported.")} style={styles.buttonContainer}>
                            <Text style={styles.buttonText}>Change Language</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.flexContainerChild, {flex: 1, marginTop: height * 0.05,}]}>
                        <Text style={{color: 'white', alignSelf: 'center', fontWeight: '700', fontSize: normalize(14)}}>
                            ©2021 Swap Foundation
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flexContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
    },

    flexContainerChild: {
        alignItems: 'baseline',
        maxWidth: width * 0.9,
        textAlign: 'left',
    },

    optionTitle: {
        color: '#fff',
        fontSize: normalize(25),
        fontWeight: '700',
    },

    optionBody: {
        color: '#b4bdc8',
        fontSize: normalize(13),
    },

    buttonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "700",
        alignSelf: "center",
    },

    buttonContainer: {
        elevation: 8,
        backgroundColor: "#2074d4",
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
})
